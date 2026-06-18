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
| Generate 3D  | Produce a base mesh from the reference                         | Meshy        |
| Preview      | Inspect the model in the browser                               | three.js     |
| Stone Seats  | Detect and map gemstone seats for flush / pavé setting         | Vision model |
| Sculpt       | Export for organic, high-detail work                           | ZBrush       |
| CAD          | Refine settings, galleries and mountings parametrically        | MatrixGold   |
| Sprueing     | Lay out sprues and casting channels ready for production       | —            |

## Tech stack

- **Next.js 16** (App Router) and **React 19**
- **TypeScript** and **Tailwind CSS**
- **three.js** via **@react-three/fiber** / **@react-three/drei** for the viewport
- **Meshy** image-to-3D API for mesh generation
- Vision model integration for gemstone seat detection

## Getting started

```bash
npm install
cp .env.example .env.local   # add your API keys
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment

| Variable        | Description                                |
| --------------- | ------------------------------------------ |
| `MESHY_API_KEY` | API key for the Meshy image-to-3D service. |

Without keys configured, the studio runs against built-in placeholders so the
interface can be explored end to end.

## Status

Early development. The pipeline interface and viewport are in place; tool
integrations are being wired up stage by stage. A native application built on the
same engine is planned.

## License

[MIT](./LICENSE)
