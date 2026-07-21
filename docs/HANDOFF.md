# HANDOFF（最終更新: 2026-07-21）

## 現在地
- ブランチ: main（d02712b・PR #21 までマージ済み）／ リモート: `github.com/sakanafuto/7ofu-site`

## 直前に完了したこと
- Home フッターに公式X（@KouraDiary・こうら日記/カメコロ共用垢）を控えめに追加・カメコロを App Store 公開対応（準備中→入手リンク `id6789081791`）（PR #21）
- 前段: こうら日記アカウント削除ページ（PR #12・Google Play）・ブログ言語スイッチャ 404 修正（PR #10・adr/0007）
- build 41 ページ green。各 PR とも検証済み

## 次のアクション
- `npx wrangler deploy` で PR #21 を本番反映（未実施なら）→ フッター X・カメコロ入手リンクを実地確認
- 残: Issue #1（Schemely 紹介文に QR生成・応援 機能を追記）

## ブロッカー・注意点
- gh / `.git` / push はサンドボックス無効で実行（TLS 検証が sandbox 内で失敗する）
- main 直コミットは hook でブロック → HANDOFF も branch → PR 経由。PR 本文は `--body-file` で渡す
- 新ページは ja/en 両方作る。ja 専用は `jaOnlyPrefixes` に登録。安全 hook は「wrangler deploy」「force push」に反応
- 新ブランチは切る前に現在地を確認（未マージ feature ブランチが多く誤ベースになりやすい）
