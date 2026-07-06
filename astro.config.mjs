// @ts-check
import { defineConfig } from 'astro/config';

// 独自ドメイン（Cloudflare Registrar・#75）。sitemap 等の絶対 URL に使われる。
export default defineConfig({
  site: 'https://7ofu.dev',
  // 多言語化（adr/0004）。日本語を主（ルート維持）、英語を /en/ 配下に置く。
  // prefixDefaultLocale:false ＝ ja は /schemely/terms のまま、en は /en/schemely/terms。
  i18n: {
    defaultLocale: 'ja',
    locales: ['ja', 'en'],
    routing: { prefixDefaultLocale: false },
  },
});
