import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

// @astrojs/rss を足さず手書きで最小の RSS 2.0 を返す（依存を増やさない）。
const escapeXml = (s: string) =>
  s.replace(/[<>&'"]/g, (c) =>
    c === '<' ? '&lt;' : c === '>' ? '&gt;' : c === '&' ? '&amp;' : c === "'" ? '&apos;' : '&quot;'
  );

export const GET: APIRoute = async (context) => {
  const site = context.site?.href ?? 'https://7ofu.dev/';
  const posts = (await getCollection('blog'))
    .filter((p) => !p.data.draft)
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  const items = posts
    .map((p) => {
      const url = new URL(`/blog/${p.id}/`, site).href;
      return `    <item>
      <title>${escapeXml(p.data.title)}</title>
      <link>${url}</link>
      <guid>${url}</guid>
      <description>${escapeXml(p.data.description)}</description>
      <pubDate>${p.data.pubDate.toUTCString()}</pubDate>
    </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>7ofu blog</title>
    <link>${site}blog/</link>
    <description>7ofu の技術メモ・開発ログ</description>
    <language>ja</language>
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
