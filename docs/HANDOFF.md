# HANDOFF（最終更新: 2026-09-22）

## 現在地
- ブランチ: `feat/home-redesign-fieldnote`（bde15ff）→ **PR #26 レビュー待ち**／ main は ced9a63（PR #25 まで）
- リモート: `github.com/sakanafuto/7ofu-site`

## 直前に完了したこと
- **Home リデザイン（ADR-0008）**: 「観察ノート」モチーフ。表紙（罫線紙・大きな 7ofu）＋見開き `Spread.astro`
  （スクショの写真プリント＋ノート）×3 ＋巻末。ヘッダー直下にスクロールで歩くカメ（Home のみ）。
  3 アプリ LP（ja/en）の Hero も同じ Spread（standalone・h1）。`src/data/apps.ts` にコピー/URL/スクショを一元化
- レビュー反映: LP の h1 欠落・アクセント色の 4.5:1 未満を修正（ADR-0008 追記）。build 41 ページ green
- 前段: こうら日記のプライバシー・規約更新（PR #22〜#25）

## 次のアクション
- PR #26 をマージ → `npx wrangler deploy` → 実機で出現演出・カメ・フォント読込を確認
- こうら日記 v1.13 配信後: プライバシーポリシーに「ひとことの機械翻訳」「運営の Slack への通知」を一文ずつ追加（ja/en）
- 残: Issue #1（Schemely 紹介文の追記）— apps.ts の features に反映する形で

## ブロッカー・注意点
- この repo は tortoise_log セッションから触る場合サンドボックスの書き込み許可外 → git/npm/cwebp は sandbox 無効で実行
- gh / push はサンドボックス無効で実行（TLS 検証が sandbox 内で失敗する）
- main 直コミットは hook でブロック → HANDOFF も branch → PR 経由。PR 本文は `--body-file`
- 新ページは ja/en 両方作る。ja 専用は `jaOnlyPrefixes` に登録
- スクショ差し替え: 各アプリ repo の `screenshots/raw`（カメコロは `docs/store/screenshots`）から
  `cwebp -q 82 -resize 640 0` で `public/shots/<app>/<lang>-<name>.webp` へ。寸法を変えたら `Spread.astro` の `shotDims` も更新
- ヘッドレス Chrome（`--headless=new --virtual-time-budget=8000`）で出現演出込みの表示が撮れる。
  **見えないときは演出のバグを疑う**（`--force-prefers-reduced-motion` で回避すると c14899a の詳細度バグを見逃す）
