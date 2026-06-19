# OneClick3D

A production pipeline for jewelers and digital artists. OneClick3D takes a single
reference image and walks it through every stage required to reach a
casting-ready piece — base mesh generation, in-browser 3D preview, gemstone seat
mapping for flush ("invisible") setting work, and hand-off to sculpting, CAD and
sprueing.

## Why

Jewelry production today is fragmented across several specialist tools. A maker
typically moves a single design between an image-to-3D generator, a sculpting
suite, a parametric CAD package and, finally, the casting bench — re-exporting
and re-importing at every step. OneClick3D unifies that journey behind one
interface so the design, the stone layout and the casting plan stay in sync.

## Pipeline

| Stage        | Purpose                                                        | Hand-off     |
| ------------ | -------------------------------------------------------------- | ------------ |
| Reference    | Upload a reference photo or sketch                             | —            |
| Generate 3D  | Produce a base mesh from the reference                         | Self-hosted  |
| Preview      | Inspect the model in the browser                               | three.js     |
| Stone Seats  | Detect and map gemstone seats for flush / pavé setting         | Vision model |
| Sculpt       | Export for organic, high-detail work                           | ZBrush       |
| CAD          | Refine settings, galleries and mountings parametrically        | MatrixGold   |
| Sprueing     | Lay out sprues and casting channels ready for production       | —            |

## Tech stack

- **Next.js 16** (App Router) and **React 19**
- **TypeScript** and **Tailwind CSS**
- **three.js** via **@react-three/fiber** / **@react-three/drei** for the viewport
- **Self-hosted image-to-3D** — the open-source [TripoSR](https://github.com/VAST-AI-Research/TripoSR) model running on serverless GPUs (see [`inference/`](./inference)), with no third-party generation API
- Vision model integration for gemstone seat detection

## Getting started

```bash
npm install
cp .env.example .env.local   # add your API keys
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment

| Variable        | Description                                            |
| --------------- | ------------------------------------------------------ |
| `INFERENCE_URL` | URL of the self-hosted image-to-3D service (`inference/`). |

Without the service configured, the studio runs against built-in placeholders so
the interface can be explored end to end. See [`inference/README.md`](./inference/README.md)
to deploy the generation service.

## Product

OneClick3D is structured as a product, not just a tool:

- `/` — marketing landing page
- `/studio` — the generation studio with an approval-based pipeline
- `/pricing` — Free, Pro, Studio and Enterprise plans (credit-based)

The studio is localised into eight languages and runs an approval flow where
each stage can be regenerated or approved before advancing.

## Status

Early development. The studio, multilingual UI, parametric generation and
exports are in place; the self-hosted mesh service, vision-based stone seat
detection and checkout are being wired up. A native application built on the
same engine is planned.

## License

[MIT](./LICENSE)
