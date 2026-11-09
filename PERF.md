# Performance notes

## 2026-11-09 — Visitor assistant initial JavaScript

The first production build with the `Streamdown` message renderer produced a main JavaScript bundle of 1,350.76 kB minified / 411.47 kB gzip. Replacing that renderer with a small plain-text and safe-link renderer, while asking the model for plain text, produced 465.64 kB / 139.22 kB gzip under the same `pnpm build` command. The gzip bundle decreased by 272.25 kB (66.17%) and is now below the 200 kB initial-JavaScript budget in the performance guidance. The final build completed successfully.
