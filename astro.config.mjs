import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://andrewdunn.dev',
  integrations: [sitemap(), mdx()],
  server: {
    host: true,
  },
  markdown: {
    shikiConfig: {
      theme: {
        name: 'purity-void',
        type: 'light',
        colors: {
          'editor.background': 'var(--code-bg)',
          'editor.foreground': 'var(--text-primary)',
        },
        tokenColors: [
          {
            scope: ['comment', 'punctuation.definition.comment', 'string.comment'],
            settings: { foreground: 'var(--code-line-num)', fontStyle: 'italic' },
          },
          {
            scope: [
              'keyword',
              'storage',
              'variable.language',
              'entity.name.function',
              'support.function',
            ],
            settings: { fontStyle: 'bold', foreground: 'var(--text-primary)' },
          },
          {
            scope: ['string', 'constant', 'entity.name.type'],
            settings: { foreground: 'var(--text-muted)' },
          },
        ],
      },
      wrap: true,
    },
  },
});
