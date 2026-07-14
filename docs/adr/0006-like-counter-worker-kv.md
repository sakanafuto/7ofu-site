# 0006. ブログ記事のいいねボタン（Cloudflare Worker + KV）

- 状態: Accepted
- 日付: 2026-07-14

## 背景

ブログ記事に「いいね」ボタンを付けたい。全訪問者の合計を出す共有カウントには、カウントを保存する場所が要る。
adr/0002 では「サーバ（Workers Functions 等）は増やしたくない・静的配信のまま保ちたい」としていた。

## 決定

Cloudflare Workers の Static Assets の前段に薄い Worker を置き、`/api/like` だけを自前で処理する。
カウントは Workers KV に `like:<slug>` で保存する。静的アセット（dist）は従来どおり assets が先に返し、
非アセットの `/api/like` のみ Worker が扱う。

- `GET /api/like?slug=<slug>` → 現在数
- `POST /api/like?slug=<slug>` → +1 して現在数
- 二重いいね防止はクライアントの localStorage（個人ブログ規模の割り切り）

## 理由

- すでに Cloudflare Workers で配信しているので、追加基盤ゼロで API を 1 本足せる。
- Astro は静的のまま（アダプタ不要）。Worker は assets の前段に薄く乗るだけ。
- adr/0005（アプリ改名）でも触れた 7ofu の方針＝実験台・執筆ネタに沿う。開発ログ記事の題材にもなる。

## 代替案

- localStorage だけ: バックエンド不要だが共有カウントにならない（自分だけ）。却下。
- Astro Cloudflare アダプタで SSR 化: API 1 本のためにサイト全体を動的化するのは過剰。却下。
- 外部いいねウィジェット: 外部依存・プライバシー方針（収集なし）と相性が悪い。却下。
- Durable Object で原子的インクリメント: 個人規模では過剰。KV の read-modify-write は非原子的だが、
  稀な競合で数がわずかにずれる程度は許容する。

## 影響

- `wrangler.jsonc` に `main`（Worker）・`assets.binding`・`kv_namespaces` を追加。
  KV 名前空間はユーザーが `wrangler kv namespace create LIKES` で作成し id を差し替える。
- adr/0002 の「静的配信のまま」は、いいね機能に限り Worker を 1 本許容する形にゆるめる。
  以降も原則は静的維持とし、サーバ機能はケースごとに ADR で判断する。
- `npm run dev` / `preview` では `/api/like` が無いためカウントは 0 表示・押しても増えない
  （デプロイ後にのみ機能する）。
