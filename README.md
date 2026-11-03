# anttisimonen.me

Personal website of Antti Simonen, software architect. The site is a terminal window you navigate by typing commands (`help`, `cv`, `skills`, …), plus a plain-HTML CV at `/cv`.

Built with Angular 22. Both routes are prerendered to static HTML, so `/cv` is readable without JavaScript and the output can be hosted on any static host.

## Develop

```bash
npm install
npm start        # http://localhost:4200
npm test         # unit tests (Vitest)
npm run build    # static site in dist/anttisimonenme/browser
```

## Editing content

All CV content lives in **`src/app/data/cv.data.ts`**. The terminal and the `/cv` page both render from it.

Text in `[BRACKETS]` is treated as a placeholder: it shows muted in the terminal and highlighted on `/cv`. There are none left at the moment.

The downloadable CV is `public/antti-simonen-cv.pdf`.

## Structure

| Path | What |
|---|---|
| `src/app/data/cv.data.ts` | CV content and formatting helpers |
| `src/app/terminal/` | Terminal window, command handling (`terminal.service.ts`), command output rendering |
| `src/app/pages/home/` | Landing page: header, identity column with quick-command chips, terminal, footer |
| `src/app/pages/cv-page/` | Plain-HTML CV at `/cv` |
| `src/app/shared/` | Header, footer, placeholder highlighter |
| `src/styles.scss` | Design tokens (colours, fonts). Change `--accent` to re-theme the terminal |
