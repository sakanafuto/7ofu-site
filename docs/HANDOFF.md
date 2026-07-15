# HANDOFF（最終更新: 2026-07-15）

## 現在地
- ブランチ: main（228fbdd・PR #8〜#12 マージ済み・本番反映済み）／ リモート: `github.com/sakanafuto/7ofu-site`

## 直前に完了したこと
- こうら日記のアカウント削除ページ（PR #12・Google Play 対応）: `/koura-diary/account-deletion`・`/en/` 版。hub と privacy §6 から導線
- ブログ言語スイッチャの 404 修正（PR #10・`jaOnlyPrefixes` 導入・adr/0007）／カメコロ privacy の Google Play 言及除去（PR #11）
- build 40 ページ green。各 PR とも code-reviewer 通過

## 次のアクション
- Play Console の「データ削除」に `7ofu.dev/koura-diary/account-deletion` を登録
- App Store Connect 側のカメコロ URL 参照差し替え（未実施なら）
- 残: Issue #1（Schemely 紹介文に QR生成・応援 機能を追記）

## ブロッカー・注意点
- gh / `.git` / push はサンドボックス無効で実行（TLS 検証が sandbox 内で失敗する）
- main 直コミットは hook でブロック → HANDOFF も branch → PR 経由。PR 本文は `--body-file` で渡す
- 新ページは ja/en 両方作る。ja 専用は `jaOnlyPrefixes` に登録。安全 hook は「wrangler deploy」「force push」に反応
- 新ブランチは切る前に現在地を確認（未マージ feature ブランチ上で誤って派生しかけた）
