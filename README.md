# BestShopio Prototype

Static, build-free prototypes for the **BestShopio** SaaS e-commerce platform — the admin
shell plus every module view (Online store theme editor, Analytics, Settings, Account, …).

This repo is a clean publish of the `prototypes/` folder from the main product repo. It
contains no PRDs, design docs, or production source snapshots.

## Live site

Deployed to GitHub Pages on every push to `main`:

> https://xicanchen101.github.io/bestshopio-prototype/

## Run locally

No build needed — just serve the folder:

```bash
python3 -m http.server 8777
# then open http://localhost:8777/index.html
```

## Highlights

- **Online store › Theme editor** (`#/online-store`) — Shopify-style section editor with
  live preview, save/publish/discard, drag reorder, and desktop/mobile preview.
  - **Collection page** template: collection banner, collection list, and a full product
    feed (faceted filters with live counts, cross-group AND / same-group OR, price range,
    sort, grid/list, 3 pagination modes, product-card overrides, quick add, and
    loading / empty / normal states).
  - **Collection list page** template: the all-collections index grid.
