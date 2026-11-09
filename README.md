# AI Navigators — الكتابة الهادفة بالذكاء الاصطناعي

React / Express / tRPC / Drizzle starter, adapted from the Sandbox web-db-user template.

- `pnpm dev`: development server; honors `PORT` (default 3000).
- `pnpm build` / `pnpm start`: build and serve `dist/index.js` and `dist/public/`.
- `pnpm db:migrate`: apply checked-in migrations. `pnpm db:push`: generate and apply new schema changes.
- `pnpm check` / `pnpm test`: types and application tests.

Start with the Webdev skill's default-template guide. Platform login, storage, payments and service contracts live in its shared references; read the relevant capability before extending its helper.

`server/_core/publicConfig.ts` exposes only named public runtime values. Private keys stay server-side. The platform serves managed `/manus-storage/` assets; the application does not register a second proxy.

Platform configuration is readable and editable through `webdev.config`. Default settings are initial values, not enforced constraints. The agent may modify the files, commands and configuration or follow the flexible guide for another stack.

## GitHub Pages

The `Deploy AI Navigators to GitHub Pages` workflow builds and publishes the static website when changes are pushed to `main`. The project page URL is `https://akramaiselsara22-cloud.github.io/AI-NaVEGATORS1/`.

GitHub Pages serves static files, so this build uses a local, fixed-answer guide for the workshop questions. The full-stack Manus build continues to use the Express server and AI assistant when run with `pnpm dev` or deployed to a compatible server host.

To enable publishing, open **Settings → Pages** in the repository and select **GitHub Actions** as the build and deployment source.
