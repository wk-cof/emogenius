# README.md — Emoji Match (TypeScript)

## Overview

**Emoji Match** is a fast, no-assets memory game you can play with your child right in the browser. It’s built in **TypeScript** with **Vite** for instant dev server and tiny bundles, and it uses **emoji** (not faces) as cards so you can ship to **GitHub Pages** without managing images.

The game includes:
- Multiple **themes** (animals, sports, food, nature, space, transport) with carefully chosen emojis kids love.
- **Difficulties** (Easy/Medium/Hard/Custom) that change grid size and pair count.
- A friendly **HUD** with move counter, timer, best score, and restart.
- **Keyboard & screen-reader support** out of the box.
- **LocalStorage** persistence for last settings and best times.

---

## Why this project?

- **Zero assets**: emojis keep it lightweight and hostable anywhere.
- **Kid-friendly UX**: big tap targets, subtle animations, no ads or dark patterns.
- **TypeScript first**: safer logic and easy extension.
- **Static deploy**: one `npm run build` and push to Pages.

---

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) 18 or newer
- [npm](https://www.npmjs.com/) (bundled with Node.js)

### Install dependencies
```bash
npm install
```

### Run the development server
```bash
npm run dev
```
Vite exposes the dev server URL in the terminal (default `http://localhost:5173`). Hot Module Replacement keeps the board in sync as you tweak the code.

### Build for production
```bash
npm run build
```
This runs TypeScript type-checking followed by an optimized production build. To preview the production build locally, run:
```bash
npm run preview
```

---

## Deployment — GitHub Pages

### One-command deploy (recommended)

```bash
npm run deploy
```

The Vite config already sets the production base path to `/emogenius/`, so the bundle references the correct GitHub Pages URL. The script simply builds and publishes `dist/` to the `gh-pages` branch with [gh-pages](https://www.npmjs.com/package/gh-pages); that branch is created automatically if it does not exist.

### Manual steps (if you fork under a different repo name)

1. Update the `repoBasePath` constant inside `vite.config.ts` to match your repository slug (e.g. `/emoji-master/`), then run:
   ```bash
   npm run build
   ```

2. Publish the production build to the `gh-pages` branch:
   ```bash
   npx gh-pages -d dist
   ```
   The command above creates (or updates) a `gh-pages` branch that contains the static build artifacts.

3. Enable GitHub Pages in your repository settings: choose `Deploy from a branch` and pick the `gh-pages` branch with the `/ (root)` folder.

4. Your game will be live at `https://<username>.github.io/<your-repo-name>/` once Pages finishes publishing (usually under a minute). Future deploys are just `npm run deploy`.

---

## Live Demo

You can deploy to GitHub Pages in minutes (see **Deployment → GitHub Pages**). After deployment, your game will be available at:

```
https://<username>.github.io/<your-repo-name>/
```
