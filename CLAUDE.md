# 7ofu-site — プロジェクトルール

7ofu の個人サイト。作ったアプリ（こうら日記・Schemely）のランディング・ヘルプ・
規約ページと、問い合わせフォームを置く**静的サイト**。

- **Astro 7**（静的ビルド・アダプタなし）。`npm run build` → `dist/` を生成
- **Cloudflare Workers（Static Assets）** で `dist/` を配信（`wrangler.jsonc`）。
  デプロイは `npx wrangler deploy` = **本番反映。ユーザーが実行する**
- 独自ドメイン `https://7ofu.dev`（Cloudflare Registrar）。`site` は `astro.config.mjs`

## 開発の進め方（ループエンジニアリング）

セッションを跨いでも文脈が消えない状態ファイルを軸に、実装 → 品質ゲート → レビューを回す。

- **docs/HANDOFF.md** — セッション跨ぎの「現在地」を 25 行以内で持つ。UserPromptSubmit hook で
  毎プロンプト自動注入。大きな区切りで `/handoff` で再生成
- **docs/SPEC.md** — ページ／機能リスト（F1〜）・受入条件
- **docs/adr/** — 設計判断（なぜそうしたか）。追記のみ・不変
- **docs/KNOWLEDGE.md** — ハマりどころ・運用ナレッジ（Web3Forms 無料枠・trailingSlash・sandbox）
- **docs/operating-model.md** — Claude の動かし方（maker≠checker・自律ループ不採用）
- push / 区切り前の一括チェックは `/verify`

### プロジェクト skills

| Skill | 使いどき |
|---|---|
| `/verify` | push / 区切り前の一括チェック（`astro build` 一括） |
| `/handoff` | セッション終盤・大きな区切りで HANDOFF を再生成 |
| `/file-issue <内容>` | やりたいことを構造化した GitHub Issue にして起票 |
| `/do-issue <N>` | 指定 Issue をブランチ → 実装 → レビュー → /verify → PR まで |

## アーキテクチャ

```
src/
  layouts/
    BaseLayout.astro   全ページ共通の外枠（<head>・ヘッダー nav・フッター・デザイントークン）
    DocLayout.astro    .md 規約ページ用（frontmatter の app/hub でアプリ横断に再利用）
  pages/
    index.astro        Home（つくったもの一覧）
    koura-diary/       こうら日記のランディング・ヘルプ・規約・問い合わせ
    schemely/          Schemely のランディング・規約・問い合わせ
public/                favicon.svg / 各アプリのアイコン（そのまま配信）
```

- **アプリを増やす**ときは `src/pages/<app>/` にページを足し、`.md` 規約は
  `layout: ../../layouts/DocLayout.astro` + frontmatter `app` / `hub` を指定する（adr/0003）。
- Home カード（`index.astro`）とヘッダー nav（`BaseLayout.astro`）に導線を足す。

## 問い合わせフォーム（Web3Forms）

- サーバーレスで送信内容を**登録メールアドレスへ通知**（無料枠・月 250 件）。access key は
  クライアント埋め込み前提の公開キー（秘密情報ではない）。`redirect` で `/<app>/thanks` へ。
- スパム対策はハニーポット（`botcheck`）。Turnstile は無料枠が検証非対応のため不採用（adr/0002）。

## 品質ゲート（自動化）

- **hooks**（`.claude/`）: 危険コマンド遮断（force push / rm -rf / `wrangler deploy`）／
  Stop 時に `.astro`・`.md` を触ったターンのみ `npm run build`
- **pre-commit**（`.githooks/`）: gitleaks。**pre-push**: `npm run build`
- **CI は持たない**（課金回避）。有効化: `git config core.hooksPath .githooks`

## Git / GitHub

- リモート: `github.com/sakanafuto/7ofu-site`（origin）。**main への直コミットは hook でブロック**
- Conventional Commits、本文は日本語（例: `feat: Schemely ページを追加`）
- **PR 運用**: ブランチ → `code-reviewer` レビュー（maker≠checker）→ `/verify` → **PR 作成**。
  マージ・`wrangler deploy`（本番反映）は**ユーザーが実行**
- 自律発火ループ（cron / /loop / /schedule / ultrareview / GitHub Actions 自走）は使わない（課金ルール）
