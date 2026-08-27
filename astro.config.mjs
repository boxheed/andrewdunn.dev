import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://example.com',
  integrations: [sitemap()],
  server: {
    host: true,
  },
  markdown: {
    shikiConfig: {
      theme: {
        name: 'purity-void',
        type: 'light',
        colors: {
          'editor.background': '#F0F0EE',
          'editor.foreground': '#1A1A1A',
        },
        tokenColors: [
          {
            scope: ['comment', 'punctuation.definition.comment', 'string.comment'],
            settings: { foreground: '#767676', fontStyle: 'italic' },
          },
          {
            scope: [
              'keyword',
              'storage',
              'variable.language',
              'entity.name.function',
              'support.function',
            ],
            settings: { fontStyle: 'bold', foreground: '#1A1A1A' },
          },
          {
            scope: ['string', 'constant', 'entity.name.type'],
            settings: { foreground: '#595959' },
          },
        ],
      },
      wrap: true,
    },
  },
});
