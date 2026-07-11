# HANDOFF（最終更新: 2026-07-11）

## 現在地
- ブランチ: main（PR #8 マージ済み・本番反映済み）／ リモート: `github.com/sakanafuto/7ofu-site`

## 直前に完了したこと
- カメコロのページ一式（PR #8）: `/kamekoro/`・`/en/kamekoro/` に index/terms/privacy/contact/thanks（ja/en 各5＝10枚）
- privacy はアプリ側 canonical 原稿を文面変更なしで移植。build 36 ページ green・code-reviewer APPROVE
- `npx wrangler deploy` で本番反映完了（`7ofu.dev/kamekoro/*`）

## 次のアクション
- 公開確認: `7ofu.dev/kamekoro/privacy`・`/kamekoro/contact` の実地表示 → App Store Connect 側の URL 参照を差し替え
- 残: Issue #1（Schemely 紹介文に QR生成・応援 機能を追記）

## ブロッカー・注意点
- gh / `.git` / push はサンドボックス無効で実行（TLS 検証が sandbox 内で失敗する）
- main 直コミットは hook でブロック → HANDOFF 更新も branch → PR 経由。PR 本文は `--body-file` で渡す
- 新ページは ja/en 両方作る。安全 hook は「wrangler deploy」「force push」文字列に反応
- 旧 PR #7（PR #6 用の HANDOFF 更新）は本更新で代替済みのためクローズ
