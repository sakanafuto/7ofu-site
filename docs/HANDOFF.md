# HANDOFF（最終更新: 2026-07-06）

## 現在地
- ブランチ: chore/harness-setup ／ リモート: `github.com/sakanafuto/7ofu-site`
- ハーネス（状態ファイル + hooks + Skills）を tortoise_log / deeptap から移植・導入中

## 直前に完了したこと
- LinkMint ページ一式を追加（`feat/linkmint-pages` で PR 済み）: 規約・プライバシー・問い合わせ・
  サンクス＋ Home カード／ヘッダー nav 導線／DocLayout を app/hub でアプリ横断化
- 未対応は Issue #1（LinkMint 紹介文に QR・応援を追記）へ切り出し

## 次のアクション
- ハーネス導入 PR を作成 → ユーザーがマージ
- `git config core.hooksPath .githooks` を有効化（gitleaks / build ゲート）
- LinkMint iOS 公開に合わせて `index.astro` の「準備中」バッジと導線を更新

## ブロッカー・注意点
- main への直コミットは hook でブロック。作業はブランチ → PR、マージはユーザー
- `.claude/hooks`・`.claude/skills`・`.claude/settings.json` はサンドボックス保護 → 編集はサンドボックス無効で
- `git push` / `gh` はキーチェーン検証でサンドボックスに弾かれる → サンドボックス無効で実行
- `wrangler deploy`（本番反映）はユーザーが実行する
