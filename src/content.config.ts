import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// ブログ（技術メモ・開発ログ）。本文は src/content/blog/*.md、一覧は /blog/。
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    // 下書きは一覧・RSS・ビルド対象から外す（公開はユーザーがフラグを外して deploy）
    draft: z.boolean().default(false),
    // 関連アプリの slug（例: schemely）。記事末尾の導線に使う
    app: z.string().optional(),
  }),
});

export const collections = { blog };
