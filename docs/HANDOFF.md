# HANDOFF（最終更新: 2026-07-06）

## 現在地
- ブランチ: feat/i18n-en ／ リモート: `github.com/sakanafuto/7ofu-site`
- PR #5 = 「英語対応(i18n) ＋ Schemely 改名」。ユーザーレビュー（特に法務英訳）→ マージ待ち

## 直前に完了したこと
- 英語対応（i18n・ja ルート + /en/・全ページ en 版・言語スイッチャ・hreflang）
- アプリ改名追従: slug `/linkmint/`→`/schemely/`（ja/en）・`public/schemely.svg`・全ブランド置換・
  フォーム subject/from_name/redirect 更新・`public/_redirects`（旧 URL 301）。build 26 ページ green

## 次のアクション
- PR #5 レビュー（法務英訳）→ マージ → ユーザーが `npx wrangler deploy` で本番反映
- デプロイ後、In-App リンク（`7ofu.dev/schemely/...`）と旧 `/linkmint/*` の 301 を実地確認
- 残: Issue #1（Schemely 紹介文の機能追記）

## ブロッカー・注意点
- `git grep 'LinkMint|linkmint'` の残留は意図的な 2 箇所のみ: adr/0005（旧名の記録）と `public/_redirects`
- Web3Forms 公開キーは `.gitleaks.toml` で許可済（contact ページ編集時も pre-commit が通る）
- 新ページは ja/en 両方作る。main 直コミットは hook でブロック。`.git`/`gh`/push はサンドボックス無効で
- 安全 hook は「wrangler deploy」文字列に反応 → PR 本文は `--body-file` で渡す
