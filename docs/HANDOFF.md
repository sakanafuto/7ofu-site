# HANDOFF（最終更新: 2026-07-07）

## 現在地
- ブランチ: main（同期済み）／ リモート: `github.com/sakanafuto/7ofu-site`
- PR #5（i18n＋Schemely 改名）・PR #6（モバイルヘッダー修正）ともにマージ済み・本番デプロイ済み

## 直前に完了したこと
- PR #6: スマホでヘッダーが崩れる問題を修正。ロゴ折り返し防止、モバイルは2段化
  （1段目=ロゴ+言語トグル / 2段目=nav センタリング）、言語スイッチャを地球アイコン＋言語コードに
- 本番反映済み（ユーザーが `wrangler` で実行）

## 次のアクション
- 実地確認: スマホで `7ofu.dev/koura-diary/help` 等のヘッダー、旧 `/linkmint/*` の 301
- 残: Issue #1（Schemely 紹介文にアプリ機能=QR生成・応援 を追記。ja/en 両方）

## ブロッカー・注意点
- `git grep 'LinkMint|linkmint'` の残留は意図的な 2 箇所のみ: adr/0005（旧名の記録）と `public/_redirects`
- Web3Forms 公開キーは `.gitleaks.toml` で許可済（contact ページ編集時も pre-commit が通る）
- 新ページは ja/en 両方作る。main 直コミットは hook でブロック。`.git`/`gh`/push はサンドボックス無効で
- 安全 hook は「wrangler deploy」文字列に反応 → PR 本文は `--body-file` で渡す
