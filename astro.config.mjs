// @ts-check
import { defineConfig } from 'astro/config';

// 独自ドメイン（Cloudflare Registrar・#75）。sitemap 等の絶対 URL に使われる。
export default defineConfig({
  site: 'https://7ofu.dev',
});
