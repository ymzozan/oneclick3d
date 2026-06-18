# OneClick3D inference service

Self-hosted image-to-3D generation. Runs the open-source
[TripoSR](https://github.com/VAST-AI-Research/TripoSR) model on Modal's
serverless GPUs, so the web app depends on no third-party generation API.

## Deploy

```bash
pip install modal
modal token new                      # one-time authentication
modal deploy inference/modal_app.py
```

The deploy prints a public endpoint URL. Set it in the web app environment:

```bash
INFERENCE_URL=https://<your-deployment>.modal.run
```

## Contract

`POST` with a JSON body:

```json
{ "image_base64": "data:image/png;base64,…" }
```

Returns the generated mesh as `model/gltf-binary` (GLB).

## Notes

- First request after a scale-to-zero period pays a cold start while the
  container boots and loads the model onto the GPU.
- The model and background-removal weights are baked into the container image
  at build time to keep cold starts as short as possible.
- TripoSR is a fast single-image baseline; the same service structure can host
  higher-fidelity models (Hunyuan3D, TRELLIS) by swapping the loader.
