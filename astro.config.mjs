// @ts-check
import { defineConfig } from 'astro/config';

// site は公開後に独自ドメインへ差し替え可（sitemap 等に使われる）。
export default defineConfig({
  site: 'https://7ofu-site.pages.dev',
});
