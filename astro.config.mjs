// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://amitport.github.io',
  trailingSlash: 'ignore',
  build: {
    format: 'directory',
  },
});
