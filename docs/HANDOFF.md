# HANDOFF（最終更新: 2026-07-06）

## 現在地
- ブランチ: feat/i18n-en ／ リモート: `github.com/sakanafuto/7ofu-site`
- サイトの英語対応（i18n）実装完了。PR 作成 → ユーザーレビュー（特に法務英訳）待ち

## 直前に完了したこと
- ハーネス導入（PR #2 マージ済）・LinkMint ページ（PR #3 マージ済）
- 英語対応（Issue #4）: Astro i18n（ja ルート + /en/）・辞書 `src/i18n/ui.ts`・言語スイッチャ・
  hreflang・全ページ en 版（ランディング/contact/thanks/規約類）。build 26 ページ green

## 次のアクション
- PR 作成 → ユーザーが英訳（特に terms/privacy/disclaimer）をレビューしてマージ
- マージ後、ユーザーが `npx wrangler deploy` で本番反映
- 残: Issue #1（LinkMint 紹介文の機能追記）・LinkMint iOS 公開時の導線更新

## ブロッカー・注意点
- 規約英訳は「日本語版優先」注記付きの参考訳。内容変更は日本語版を正に追随
- 新ページは ja/en 両方を作る（片方欠けると言語スイッチャが 404）
- main 直コミットは hook でブロック。`.claude`/`.git` 書込・`gh`/push はサンドボックス無効で
- 安全 hook は「wrangler deploy」文字列に反応 → PR 本文は `--body-file` で渡す
