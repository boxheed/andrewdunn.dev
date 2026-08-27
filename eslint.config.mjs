import eslintPluginAstro from 'eslint-plugin-astro';

export default [
  ...eslintPluginAstro.configs.recommended,
  {
    rules: {
      'no-unused-vars': 'off',
      'astro/no-unused-css-selector': 'error',
    },
  },
];
