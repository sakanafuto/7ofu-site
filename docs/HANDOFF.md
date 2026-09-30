# HANDOFF（最終更新: 2026-09-30）

## 現在地
- main は e3efc54（PR #26 Home リデザインまでマージ済み）。作業ブランチ: `docs/claude-md-sync`（CLAUDE.md を実装に同期）
- リモート: `github.com/sakanafuto/7ofu-site`

## 直前に完了したこと
- **CLAUDE.md を実装に同期**: 3 アプリ・`/api/like` Worker・`components/` `data/apps.ts` `i18n` `content/blog` を反映。
  恒久的な注意点（sandbox・`--body-file`・ja/en 両方作る・スクショ手順）を HANDOFF から CLAUDE.md へ移管
- **Home リデザイン（ADR-0008）** PR #26 マージ済み。「観察ノート」モチーフ・`Spread.astro`・カメ・`apps.ts` 一元化
- グローバル `~/.claude` の整理（skills 168→10・agents 38→5・CLAUDE.md 81→47 行）。理由と経緯は本 repo の外

## 次のアクション
- `npx wrangler deploy`（未実施なら）→ 実機で出現演出・カメ・フォント読込を確認
- こうら日記 v1.13 配信後: プライバシーポリシーに「ひとことの機械翻訳」「運営の Slack への通知」を一文ずつ追加（ja/en）
- 残: Issue #1（Schemely 紹介文の追記）— apps.ts の features に反映する形で

## ブロッカー・注意点
- ヘッドレス Chrome（`--headless=new --virtual-time-budget=8000`）で出現演出込みの表示が撮れる。
  **見えないときは演出のバグを疑う**（`--force-prefers-reduced-motion` で回避すると c14899a の詳細度バグを見逃す）
- モバイル幅の確認は `--window-size=360,...` では**不正確**（Chrome の最小ウィンドウ幅でビューポートが広がり右端が切れて見える）。
  幅 360px の `<iframe>` を並べたローカル HTML を撮る（scratchpad の frame.html 方式）
- スクショの元画像: 各アプリ repo の `screenshots/raw`（カメコロは `docs/store/screenshots`）
