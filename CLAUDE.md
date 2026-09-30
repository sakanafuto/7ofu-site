# 7ofu-site — プロジェクトルール

7ofu の個人サイト。作ったアプリ（こうら日記・カメコロ・Schemely）のランディング・ヘルプ・規約・
問い合わせと、ブログを置く。Astro 7 の静的ビルド（`npm run build` → `dist/`）を
Cloudflare Workers（Static Assets）で配信し、ブログのいいね API（`/api/like`）だけ薄い Worker が処理する（adr/0006）。

- 独自ドメイン `https://7ofu.dev`。`site` は `astro.config.mjs`
- デプロイは `npx wrangler deploy` = 本番反映。**ユーザーが実行する**（hook でも遮断）

## 開発の進め方（ループエンジニアリング）

- **docs/HANDOFF.md** — セッション跨ぎの現在地（25 行以内）。UserPromptSubmit hook で毎プロンプト注入。区切りで `/handoff`
- **docs/SPEC.md** — ページ／機能リスト（F1〜）と受入条件
- **docs/adr/** — 設計判断。追記のみ
- **docs/KNOWLEDGE.md** — ハマりどころ（Web3Forms・trailingSlash・i18n・sandbox）。詰まったらまず読む
- **docs/operating-model.md** — Claude の動かし方（maker≠checker・自律ループ不採用）

Skills: `/verify`（astro build 一括）・`/handoff`・`/file-issue <内容>`・`/do-issue <N>`（ブランチ → 実装 → レビュー → PR）

## アーキテクチャ

```
src/
  data/apps.ts        3 アプリのコピー・ストア URL・スクショを一元化（Home と各 LP の Hero が共有・adr/0008）
  i18n/ui.ts          UI 文言と ja/en 切替。ja 専用ページは jaOnlyPrefixes に登録（adr/0004, 0007）
  layouts/            BaseLayout（外枠・nav・デザイントークン）/ DocLayout（.md 規約ページ・frontmatter app/hub）
  components/         Spread（見開き）/ MarginNote / TortoiseWalk（Home のカメ）/ DocIndex
  pages/              ja ルート直下 + en/ に同じ構成。<app>/{index,contact,thanks}.astro + 規約 .md
  content/blog/       ブログ記事（ja のみ）
worker/index.ts       /api/like のみ処理（KV）。静的アセットは assets が先に返す
public/shots/         スクショ webp（<app>/<lang>-<name>.webp）
```

- **ページを足すときは ja / en の両方を作る**。ja 専用にするなら `jaOnlyPrefixes` に登録しないと en 側の言語切替が壊れる
- **アプリを増やす**: `apps.ts` にエントリ追加 → `pages/<app>/` と `pages/en/<app>/` → `.md` 規約は
  `layout: ../../layouts/DocLayout.astro` + frontmatter `app` / `hub`（adr/0003）→ nav（`BaseLayout`）
- スクショ差し替え: 各アプリ repo の元画像を `cwebp -q 82 -resize 640 0` で変換。寸法を変えたら `Spread.astro` の `shotDims` も更新

## 問い合わせフォーム（Web3Forms）

- サーバーレスで登録メールへ通知（無料枠・月 250 件）。access key はクライアント埋め込み前提の公開キー
- スパム対策はハニーポット（`botcheck`）。Turnstile は無料枠で検証できないため不採用（adr/0002）

## 品質ゲート（自動化）

- hooks（`.claude/hooks/`）: 危険コマンド遮断（force push / rm -rf / `wrangler deploy`）／
  ソース編集を記録し Stop 時に一度だけ `npm run build`（テストが無いので build が壊れ検出の要）
- pre-commit: gitleaks。pre-push: `npm run build`。有効化: `git config core.hooksPath .githooks`
- CI は持たない（課金回避）

## Git / GitHub

- リモート `github.com/sakanafuto/7ofu-site`。main への直コミットは hook でブロック → docs 更新も branch → PR
- Conventional Commits、本文は日本語。PR 本文は `--body-file` で渡す
- ブランチ → `code-reviewer` レビュー（maker≠checker）→ `/verify` → PR 作成。**マージと deploy はユーザー**
- gh / push は sandbox 内で TLS 検証に失敗する → sandbox 無効で実行
- 自律発火ループ（cron / /loop / /schedule / ultrareview / GitHub Actions）は使わない
