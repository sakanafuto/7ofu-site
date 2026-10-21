# HANDOFF（最終更新: 2026-10-20）

## 現在地
- main は 0c7f500（PR #32 まで・本番反映済み）。作業ブランチ: `docs/workers-builds-auto-deploy`
- リモート: `github.com/sakanafuto/7ofu-site`。**main へのマージ = 本番反映**（Workers Builds が自動デプロイ）

## 直前に完了したこと
- **こうら日記の規約・ポリシー**: 今日のこうらのひとこと 第 1 版（PR #30）→ 第 2 版（#31）→ 掲示板の第 3 版（#32）。
  ja/en の terms・privacy・account-deletion を 2026-10-20 版で公開済み（本番の文言を curl で確認）
- Workers Builds による自動デプロイが判明し、CLAUDE.md・KNOWLEDGE・skills の deploy 手順を実態に合わせた

## 次のアクション
- 実機で Home の出現演出・カメ・フォント読込を確認（未確認のまま）
- 残: Issue #1（Schemely 紹介文の追記）— apps.ts の features に反映する形で
- 残: PR #23（ブログ記事「ジャクソン比とは」）が 7 月から open のまま

## ブロッカー・注意点
- ヘッドレス Chrome（`--headless=new --virtual-time-budget=8000`）で出現演出込みの表示が撮れる。
  **見えないときは演出のバグを疑う**（`--force-prefers-reduced-motion` で回避すると c14899a の詳細度バグを見逃す）
- モバイル幅の確認は `--window-size=360,...` では**不正確**（Chrome の最小ウィンドウ幅でビューポートが広がり右端が切れて見える）。
  幅 360px の `<iframe>` を並べたローカル HTML を撮る（scratchpad の frame.html 方式）
- スクショの元画像: 各アプリ repo の `screenshots/raw`（カメコロは `docs/store/screenshots`）
