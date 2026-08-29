# andrewdunn.dev

The personal engineering blog and portfolio for Andrew Dunn.

Built with **Astro 7.x** and **MDX**, this site eschews modern bloat in favor of a strict, minimalist brutalist design system dubbed "Purity & Void".

## 🏗️ Architecture

- **Framework:** Astro 7.x (Static Site Generation)
- **Content:** MDX via Astro Content Collections (`src/content/blog/`)
- **Styling:** Vanilla CSS (`src/styles/global.css`)
- **Syntax Highlighting:** Shiki (Custom dual-tone `purity-void` theme)
- **Linting & Formatting:** ESLint + Prettier, enforced via Husky pre-commit hooks

## 🎨 Design Philosophy: "Purity & Void"

The site enforces a ruthless, content-first aesthetic. It uses no UI frameworks (like Tailwind or Bootstrap). All styling relies on a few tightly controlled CSS variables and strict semantic HTML:

- **Typography & Contrast:** High-contrast, monochromatic typography designed to prevent optical eye strain and halation (Light: `#1A1A1A` on `#FCFCFA`; Dark: `#EAEAEA` on `#121212`). Meets WCAG AA contrast ratio standards.
- **Theme Modes:** Native system preferences auto-detection with a mechanical monospace manual selector switch override (`Theme: [ Light ] / Dark` / `Theme: Light / [ Dark ]`) in the navigation header.
- **Whitespace:** Mathematical rhythm (`64px`, `96px`, `128px`).
- **Structure:** A single, centralized `800px` content column framed by a solid structural spine (`border-left: 4px solid var(--accent-action)`). The crimson spine remains unchanged in both modes to serve as a constant coordinate.
- **Accessibility:** Fully semantic DOM (Header, Main, Footer, Article) with visually-hidden skip links, keyboard focus styles, and live ARIA regions for interactive components.

## 🚀 Getting Started

### Prerequisites

- Node.js (v24+)
- npm

### Installation

Clone the repository and install dependencies:

```bash
git clone git@github.com:boxheed/andrewdunn.dev.git
cd andrewdunn.dev
npm install
```

### Development

Start the local development server (runs on `http://localhost:4321` by default):

```bash
npm run dev
```

## 📝 Content Management

All blog posts are authored in **MDX** and managed via Astro's Content Collections API.

To create a new post, add an `.mdx` file to the `src/content/blog/` directory with the following frontmatter:

```mdx
---
title: 'My Engineering Post'
date: 2026-08-28
description: 'A brief summary of the post'
---

Your content goes here...
```

Any code blocks written in standard markdown fence syntax (` ```bash `) will automatically be intercepted by the MDX pipeline, syntax-highlighted by Shiki, and wrapped with an accessible "Copy to Clipboard" component.

## 🌿 Git Workflow

This repository follows a standard Git Flow branching model:

- `main`: The production-ready branch. All code here is stable.
- `develop`: The primary development branch where new features and content are integrated.

Please ensure you run `npm run lint` and `npm run format` (or let the Husky hooks handle it) before committing to `develop`.
