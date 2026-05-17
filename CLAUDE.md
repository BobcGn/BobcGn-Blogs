# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Quartz v4 static site — a "digital garden" blog published from an Obsidian vault. Content is written in Obsidian (`/Users/bobcgn/Markdown-Notes`) and synced into this repo's `content/` directory via rsync, then built and deployed to GitHub Pages.

## Two-Directory Architecture

```
/Users/bobcgn/Markdown-Notes/       ← Obsidian vault (source of truth)
  ├── image/                          ← Global image attachments
  ├── Public/                         ← Articles to publish (synced → content/)
  └── (other dirs)                    ← Private drafts, NOT published

/Users/bobcgn/AAA_Codings/quartz-myblogs/  ← THIS REPO (build & deploy)
  ├── content/                        ← Synced from Public/ + image/
  ├── quartz.config.ts                ← Plugin/transformer config
  ├── quartz.layout.ts                ← Page layout definitions
  └── public/                         ← Build output (deployed)
```

Content flows one way: **Obsidian → rsync → content/ → quartz build → public/ → GitHub Pages**.

## Commands

```bash
npx quartz build              # Production build → public/
npx quartz build --serve      # Dev server with hot-reload
npx quartz build -v           # Verbose build
npx quartz sync               # Commit, push, and pull upstream updates
npx quartz update             # Update Quartz to latest version
```

There is no test suite or linter in this project.

## Key Configuration

### quartz.config.ts

- **`Plugin.ObsidianFlavoredMarkdown()`** — enables `[[wikilinks]]`, `>[!callout]` blocks, Mermaid, highlights, and #tags. All default options are enabled.
- **`Plugin.CrawlLinks()`** — `markdownLinkResolution: "shortest"` matches Obsidian's default link resolution. If image filenames are unique across the vault, only the filename is needed in links.
- **`Plugin.ExplicitPublish()`** — if enabled, only files with `publish: true` in frontmatter are included.
- **`Plugin.Assets()`** — copies embedded images from content into the build output.

### Image Paths

Images live in `content/image/` (synced from `Markdown-Notes/image/`). In Obsidian-flavored Markdown, they're referenced as `![[image/filename.png]]` or `![](image/filename.png)`. Avoid spaces in image filenames — Quartz transforms spaces to hyphens, which can break `%20`-encoded Obsidian links.

### Content Frontmatter

Each Markdown file should include at minimum:
```yaml
---
title: "Post Title"
date: 2025-01-01
tags: [tag1, tag2]
---
```

## Publishing Workflow

1. Write/edit notes in Obsidian under `Markdown-Notes/Public/`
2. Run `publish.sh` from the vault directory to rsync content into this repo
3. The script auto-commits and pushes to GitHub
4. GitHub Actions builds and deploys to GitHub Pages

## Deployment

GitHub Actions workflow at `.github/workflows/deploy.yml`:
- Triggers on push to `main` branch
- Builds with Node 22 via `npx quartz build`
- Deploys `public/` via `actions/deploy-pages@v4`
