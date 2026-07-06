# 0001. 技術スタック（Astro 静的 + Cloudflare Workers）

- 状態: Accepted
- 日付: 2026-07-06（既存構成の追認記録）

## 背景

作ったアプリ（こうら日記・LinkMint）のランディング・ヘルプ・規約と問い合わせを置く、
小規模な個人サイトが必要。動的機能はほぼ無く、規約ページと数枚の紹介ページが中心。

## 決定

- **Astro 7** を静的ビルド（アダプタなし）で使う。`npm run build` → `dist/`。
- **Cloudflare Workers（Static Assets）** で `dist/` を配信（`wrangler.jsonc` の `assets.directory`）。
  デプロイは `npx wrangler deploy`。
- 独自ドメイン `7ofu.dev` は Cloudflare Registrar。`astro.config.mjs` の `site` に設定。

## 理由

- 規約・紹介中心のコンテンツサイトに SSR/サーバは不要。静的配信が最も速く・安く・堅牢。
- Astro は `.astro` と `.md` を同居でき、規約は Markdown、レイアウトはコンポーネントで書ける。
- ドメインを Cloudflare で管理しているため、同一プラットフォームの Workers 配信が運用上シンプル。
- ビルドが速く（全ページ ~1s）、テスト無しでも `astro build` が回帰ゲートとして機能する。

## 代替案

- **Next.js / SSR**: 動的要件が無いためオーバースペック。
- **GitHub Pages**: 選択肢だが、ドメイン・CDN・将来的な Workers 機能との親和性で Cloudflare を採用。
- **素の HTML**: レイアウト共通化・Markdown 規約の取り回しで Astro が有利。

## 影響

- 問い合わせのような動的処理は外部サービス（Web3Forms）に委ねる。→ adr/0002
- 本番反映は `wrangler deploy`＝ユーザー実行。CI は持たずローカル hooks で品質担保（課金回避）。
