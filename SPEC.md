# Project Specification: "Purity & Void" Astro Engineering Blog

## 1. Architectural Overview

- **Framework:** Astro 5.x (SSG mode, zero client-side JavaScript default).
- **Target Platform:** Cloudflare Pages (`@astrojs/cloudflare` adapter optional for SSR, static export default).
- **Content Engine:** Astro Content Collections (`src/content/blog/`) parsing Markdown/MDX with frontmatter validation (Zod).
- **Styling Architecture:** Only use vnilla modern CSS (fluid typography via `clamp()`, grid, flexbox).

---

## 2. Design System: "Purity & Void" (Kenya Hara Minimalist Brutalism)

### Design Tokens

| Token             | Value     | Semantic Usage                                                                  |
| :---------------- | :-------- | :------------------------------------------------------------------------------ |
| `--bg-void`       | `#FCFCFA` | Primary page background (warm washi paper tone).                                |
| `--text-primary`  | `#1A1A1A` | Deep Charcoal for headings and body prose (avoids harsh `#000`).                |
| `--text-muted`    | `#595959` | Secondary metadata (dates, reading time). Passes WCAG AA on `--bg-void` (7:1+). |
| `--accent-action` | `#E60012` | Safety Red for single primary interaction states and structural accents.        |
| `--code-bg`       | `#F0F0EE` | Recessed light concrete background for code blocks.                             |
| `--code-line-num` | `#767676` | Line numbers in code blocks. Meets WCAG 4.5:1 minimum on `--code-bg`.           |
| `--focus-ring`    | `#E60012` | High-contrast keyboard focus indicator.                                         |

### Typography

- **Primary Sans-Serif:** `Inter`, `-apple-system`, `BlinkMacSystemFont`, `sans-serif`.
- **Code Monospace:** `JetBrains Mono`, `Fira Code`, `ui-monospace`, `monospace`.
- **Scale Hierarchy:**
  - Site / Hero Title: `clamp(2.5rem, 7vw, 5.5rem)` (Extreme scale, tight letter-spacing `-0.04em`, bold).
  - Post Headings (`h2`): `clamp(1.75rem, 3.5vw, 2.5rem)` (Tight, bold).
  - Body Text: `1.125rem` (18px) with `line-height: 1.75` for technical readability.

### Structural Philosophy (Negative Space / "Ma")

- Avoid generic box-shadows, rounded card borders, and unnecessary horizontal rules.
- Structural hierarchy must be defined by whitespace increments (`64px`, `96px`, `128px`).
- Interactive elements must not rely on color alone: link states require a solid geometric underline shift (`text-decoration-thickness: 2px`).

### List Styling

- **Left Alignment:** List items must align precisely with the left edge of the main body paragraphs, maintaining a strict vertical coordinate without floating outward into the negative space.
- **Indentation Shape:** Unordered bullets and ordered numbers sit within a controlled indent (`padding-left: 1.5rem`), pulling them slightly inward from the primary text margin while keeping the text block uniform.
- **Marker Color:** Bullets and numerical markers are rendered in muted text (`var(--text-muted)`) to subdue their visual weight, ensuring they do not introduce unnecessary chromatic clutter or pull focus from the typography.
- **Vertical Rhythm:** Individual items feature tight bottom spacing (`margin-bottom: 0.5rem`) to read as an organized cluster, while the entire list block concludes with a standard spacing break (`margin-bottom: 1.5rem`) to match the cadence of headings and code blocks.

---

## 3. Accessibility (WCAG 2.2 AA Compliance)

1. **Focus States:** Globally enforce visible focus indicators:

   ```css
   :focus-visible {
     outline: 2px solid var(--accent-action);
     outline-offset: 4px;
   }
   ```

2. **Semantic DOM:** Strict document outline:
   `<header role="banner">`, `<main id="main">`, `<article>`, `<nav role="navigation">`, `<footer role="contentinfo">`. Skip-to-content link required at the top of the DOM.

3. **Contrast Ratios:** Minimum 4.5:1 for body copy; 3:1 for large text; 4.5:1 for line numbers and secondary tags.

4. **Fluid Zoom:** Must scale up to 200% zoom without horizontal scrolling or text clipping.

## 4. Code Block Specification

- **Engine:** Shiki / Astro built-in syntax highlighter. The custom Shiki theme must be explicitly defined in astro.config.mjs using the markdown.shikiConfig object.

- **Theme:** Minimal dual-tone or monochromatic high-contrast theme (dark charcoal tokens with subtle red/cyan accents).

- **Architecture:** Embedded within #F0F0EE container, borderless, inset padding 1.5rem.

- **Metadata**: Accessible `aria-label` declaring the language; copy-to-clipboard functionality with explicit screen-reader status announcements.

- **Exception to zero-JS rule:** The CodeBlock.astro component must include a scoped vanilla `<script>` to handle the clipboard API and aria-live region announcements.

## 5. File & Directory Structure

```
├── public/
│   ├── favicon.svg
│   └── robots.txt
├── src/
│   ├── content/
│   │   ├── config.ts
│   │   └── blog/
│   │       ├── 2023-03-16-maven-r2-gradle.md
│   │       └── ...
│   ├── layouts/
│   │   ├── BaseLayout.astro
│   │   └── PostLayout.astro
│   ├── components/
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── PostPreview.astro
│   │   ├── CodeBlock.astro
│   │   └── SkipLink.astro
│   ├── pages/
│   │   ├── index.astro
│   │   ├── blog/[...slug].astro
│   │   ├── rss.xml.ts
│   │   └── 404.astro
│   └── styles/
│       └── global.css
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

## 6. CSS Baseline (src/styles/global.css)

The agent must generate the global stylesheet using exactly these foundational rules:

```css
:root {
  --bg-void: #fcfcfa;
  --text-primary: #1a1a1a;
  --text-muted: #595959;
  --accent-action: #e60012;
  --code-bg: #f0f0ee;
  --code-line-num: #767676;
  --font-sans: 'Inter', system-ui, -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', ui-monospace, monospace;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  background-color: var(--bg-void);
  color: var(--text-primary);
  font-family: var(--font-sans);
  font-size: 16px;
  line-height: 1.75;
  -webkit-font-smoothing: antialiased;
}

body {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

:focus-visible {
  outline: 2px solid var(--accent-action);
  outline-offset: 4px;
}

.skip-link {
  position: absolute;
  top: -100px;
  left: 1rem;
  background: var(--text-primary);
  color: var(--bg-void);
  padding: 0.5rem 1rem;
  z-index: 1000;
  text-decoration: none;
  font-weight: 600;
}

.skip-link:focus {
  top: 1rem;
}

h1.hero-title {
  font-size: clamp(2.5rem, 7vw, 5.5rem);
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 1.05;
  color: var(--text-primary);
}

h2 {
  font-size: clamp(1.75rem, 3.5vw, 2.5rem);
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.2;
}

pre {
  background-color: var(--code-bg) !important;
  padding: 1.5rem;
  overflow-x: auto;
  font-family: var(--font-mono);
  font-size: 0.95rem;
  line-height: 1.6;
  border-radius: 0;
}

ul,
ol {
  margin: 0 0 1.5rem 0;
  padding-left: 1.5rem;
}

li {
  margin-bottom: 0.5rem;
}

li::marker {
  color: var(--text-muted);
}
```

## 7. Project Governance & Tooling

The agent must install and configure the following infrastructure for repository governance:

- **Code Formatting:** Install `prettier` and `prettier-plugin-astro`. Create a `.prettierrc` enforcing single quotes, trailing commas, and a print width of 100.
- **Linting:** Install `eslint` and `eslint-plugin-astro`. Create a base configuration that catches unused variables and accessibility (a11y) violations.
- **Commit Standards:** Install `husky` and `@commitlint/config-conventional`.
  - Configure a `commit-msg` hook to strictly enforce Conventional Commits.
  - Configure a `pre-commit` hook to run Prettier and ESLint against staged files.
- **Node Engine:** Add an `.nvmrc` file specifying Node v20+ and define `engine` constraints in `package.json`.
- **Sitemap:** Add `@astrojs/sitemap` add the integration to `astro.config.mjs`.
