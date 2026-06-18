"""
OneClick3D inference service.

A self-hosted image-to-3D endpoint built on the open-source TripoSR model and
served on Modal's serverless GPUs. The frontend sends a reference image and
receives a GLB mesh back — no third-party generation API involved.

Deploy:
    pip install modal
    modal token new          # one-time auth
    modal deploy inference/modal_app.py

The deploy prints a public URL; set it as INFERENCE_URL in the web app.
"""

import base64
import io

import modal

app = modal.App("oneclick3d-inference")

# The container image bundles TripoSR and its dependencies. Model weights are
# baked in at build time so cold starts do not pay a download cost.
MODEL_REPO = "stabilityai/TripoSR"


def _download_models() -> None:
    from huggingface_hub import hf_hub_download

    hf_hub_download(MODEL_REPO, "config.yaml")
    hf_hub_download(MODEL_REPO, "model.ckpt")
    # Warm the background-removal model used during preprocessing.
    import rembg

    rembg.new_session()


image = (
    modal.Image.debian_slim(python_version="3.11")
    .apt_install("git", "libgl1", "libglib2.0-0")
    .pip_install(
        "torch==2.4.0",
        "torchvision==0.19.0",
        "omegaconf",
        "Pillow",
        "einops",
        "transformers",
        "trimesh",
        "rembg[gpu]",
        "onnxruntime-gpu",
        "huggingface-hub",
        "xatlas",
        "numpy",
        "git+https://github.com/tatsy/torchmcubes.git",
        "git+https://github.com/VAST-AI-Research/TripoSR.git",
    )
    .run_function(_download_models)
)


@app.cls(image=image, gpu="A10G", scaledown_window=120)
class TripoSR:
    @modal.enter()
    def load(self) -> None:
        """Load the model once per container and keep it resident on the GPU."""
        import torch
        import rembg
        from tsr.system import TSR

        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.model = TSR.from_pretrained(
            MODEL_REPO, config_name="config.yaml", weight_name="model.ckpt"
        )
        self.model.renderer.set_chunk_size(8192)
        self.model.to(self.device)
        self.rembg_session = rembg.new_session()

    def _to_glb(self, image_bytes: bytes) -> bytes:
        from PIL import Image
        from tsr.utils import remove_background, resize_foreground

        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        image = remove_background(image, self.rembg_session)
        image = resize_foreground(image, 0.85)

        scene_codes = self.model([image], device=self.device)
        mesh = self.model.extract_mesh(scene_codes, has_vertex_color=True, resolution=256)[0]

        buffer = io.BytesIO()
        mesh.export(buffer, file_type="glb")
        return buffer.getvalue()

    @modal.fastapi_endpoint(method="POST")
    def generate(self, payload: dict):
        """
        Accept { "image_base64": "<data>" } and return the generated GLB.
        The image may be a bare base64 string or a data URI.
        """
        from fastapi import Response

        data = payload.get("image_base64")
        if not data:
            return Response(content="image_base64 is required", status_code=400)

        if "," in data and data.strip().startswith("data:"):
            data = data.split(",", 1)[1]

        try:
            image_bytes = base64.b64decode(data)
            glb = self._to_glb(image_bytes)
        except Exception as exc:  # surface model errors to the caller
            return Response(content=f"generation failed: {exc}", status_code=500)

        return Response(
            content=glb,
            media_type="model/gltf-binary",
            headers={"Content-Disposition": 'inline; filename="model.glb"'},
        )
