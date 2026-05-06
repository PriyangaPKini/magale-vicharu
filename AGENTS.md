# AGENTS.md

Guidance for AI agents (and humans) working in this repo. Read this before making changes.

For cross-project conventions, see `~/.claude/rules/` (`contributing.md`, `coding-principles.md`). This file documents only what is **specific to magale-vicharu**.

---

## What this is

`magale-vicharu` is a personal site — a space to put my thoughts down. Static Astro site, deployed to Netlify at <https://magale-vicharu.netlify.app/>.

## Stack

- **Astro** ≥ 6 (`output: 'static'`), Node ≥ 22.12.0.
- **`@astrojs/sitemap`** — generates `sitemap-index.xml` at build.
- **Fuse.js** — client-side fuzzy search (Cmd/Ctrl+K).
- No CSS framework — plain CSS in `src/styles/global.css`.
- No tests yet.

## Layout

```
src/
├── components/        # .astro components (Footer, Navbar, Search, PostItem, …)
├── content/
│   └── blog/          # markdown posts; one .md per post
├── content.config.ts  # zod schema for the `blog` collection
├── layouts/           # BaseLayout, PostLayout
├── pages/
│   ├── about.astro
│   ├── blog/
│   │   ├── index.astro
│   │   └── [slug].astro
│   └── index.astro
├── styles/global.css
├── constants.ts       # site-wide constants (nav links, social, etc.)
└── utils.ts
public/                # static assets (favicon, avatar, fonts)
```

## Content

Blog posts live in `src/content/blog/*.md` and must satisfy the schema in `src/content.config.ts`:

| Field | Required | Notes |
|---|---|---|
| `title` | ✅ | string |
| `date` | ✅ | ISO date string |
| `description` | optional | shown in lists / OG meta |
| `tags` | optional | string[] |
| `cover` | optional | path to image |
| `externalUrl` | optional | if set, post is treated as a cross-post and links out |
| `featured` | optional | bumps the post to the top with a star icon |

When adding fields, update the schema **and** any consuming components (`PostItem.astro`, `blog/[slug].astro`) in the same PR.

## Commands

```sh
npm install          # install deps (Node ≥ 22.12.0)
npm run dev          # local dev at http://localhost:4321
npm run build        # static build to ./dist
npm run preview      # serve ./dist locally
npm run sync:notion  # pull blog content from Notion into src/content/blog
npm run astro …      # raw Astro CLI (e.g. `astro check`)
```

## Workflow

- **`main` is protected.** No direct pushes. Every change lands via PR + squash/rebase merge (linear history is enforced).
- **Branches:** `<type>/<short-desc>` where `<type>` ∈ `feat`, `fix`, `refactor`, `chore`. See `~/.claude/rules/contributing.md`.
- **Commits:** `<Operation>. <lowercase summary>` (e.g. `Add. rss feed`). Atomic; project must build at every commit.
- **PR body** uses the template from `~/.claude/rules/contributing.md`:
  ```
  ## Because
  ## This addresses
  ## Test Plan
  ```
- **Never merge or push without explicit user request.**
- **Never `git add -A` blindly** — review staged files first; `TODO.md` and similar local notes are git-ignored on purpose.

## Content sync (Notion)

- Source of truth: a Notion database — each page with `Status = Done` becomes one markdown post.
- Script: `scripts/sync-notion.mjs`. Maps Notion properties → frontmatter (see `src/content.config.ts`), converts the body to markdown, and downloads embedded images to `public/blog-images/<slug>/` (Notion file URLs expire).
- Slug: from the Notion `Slug` property, or falls back to `<date>-<kebab-title>`.
- Workflow: `.github/workflows/sync-notion.yml` (manual `workflow_dispatch`). Runs the script and opens a `chore/sync-notion` PR via `peter-evans/create-pull-request` if anything changed. Review the diff, then merge → the deploy workflow ships it.
- Local run: copy `.env.example` (TODO) or set `NOTION_TOKEN` and `NOTION_BLOG_DB_ID`, then `npm run sync:notion`.
- Required repo secret: `NOTION_TOKEN`. The database ID is committed in the workflow env (it's not sensitive).
- The sync **does not delete** posts that disappear from Notion. Remove stale `.md` files manually if needed.

## Deployment

- GitHub Actions workflow: `.github/workflows/deploy.yml`.
- Triggers on push to `main` (i.e., PR merge) and `workflow_dispatch`.
- Builds with `npm ci && npm run build`, then `npx netlify-cli deploy --dir=dist --prod`.
- Required repo secrets: `NETLIFY_AUTH_TOKEN`, `NETLIFY_PROJECT_ID` (mapped to `NETLIFY_SITE_ID` for the CLI).
- Netlify's built-in continuous deployment is **disabled** to avoid double-deploys.

## Conventions

- **Indentation:** 2 spaces. Match surrounding style.
- **Quotes:** single quotes in TS, double quotes in HTML attributes (Astro default).
- **Imports:** relative paths inside `src/` — no path aliases configured.
- **No new dependencies** without a clear reason. Prefer the platform / vanilla over libraries.
- **Static-only.** No SSR routes, no adapters. If a feature needs a server, host it externally and call it from the client.

## Things to watch

- The `site:` URL in `astro.config.mjs` (`https://magale-vicharu.netlify.app`) drives the sitemap. Update it if a custom domain goes live.
- Cmd+K search is built at runtime against `fuse.js` over the blog collection. Keep `description` populated for better hit quality.
