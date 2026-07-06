# KNOWLEDGE — ハマりどころ・運用ナレッジ

## Web3Forms（問い合わせフォーム）

- **無料枠でも送信内容は「access key を発行したメールアドレス」へメール通知される**（これが標準動作・
  有料要素ではない）。届かない時はまず**迷惑メールフォルダ**を疑う（2026-07-06 実際にここだった）。
- 無料枠は**月 250 件**まで。超えると届かなくなる。
- access key はクライアント埋め込み前提の**公開キー**（秘密情報ではない・gitleaks 対象外でよい）。
  こうら日記と LinkMint は同一キーを共用 → 同じ受信箱に届く。`subject` / `from_name` で判別。
  宛先を分けたいときは Web3Forms でアプリ別キーを発行して差し替える。
- **Turnstile（CAPTCHA）は無料枠が検証非対応**のため不採用（commit 44c35af で撤去）。
  スパム対策はハニーポット `botcheck`（人には見えない checkbox）で代替。→ adr/0002

## Astro / ルーティング

- `.md` ページは `src/pages/<app>/terms.md` → `/<app>/terms/index.html` にビルドされる。
  リンクは末尾スラッシュなし（`/linkmint/terms`）で書いており、Astro 既定の `trailingSlash: 'ignore'`
  で解決される（koura-diary と同方式）。
- **DocLayout の再利用**: `.md` の frontmatter に `app` / `hub` を足すとパンくず・タイトル・戻り
  リンクが差し替わる。未指定はこうら日記（後方互換）。→ adr/0003
- ストアカードのグリッドは `repeat(auto-fit, minmax(...))`。カード 1 枚（iOS 単体）でも
  半分に寄らず安定幅で表示される（`repeat(2, 1fr)` だと 1 枚時に崩れる）。
- ビルドは速い（全 13 ページで ~1s）。**テストは無く、`astro build` が事実上の回帰ゲート**
  （壊れた import・frontmatter 不備・テンプレート崩れを検出）。

## Cloudflare Workers（Static Assets）

- `wrangler.jsonc` の `assets.directory = ./dist`。`npm run build` → `npx wrangler deploy` で本番反映。
- **deploy は本番反映＝ユーザーが実行**。hook で `wrangler deploy` を遮断している。
- 独自ドメイン `7ofu.dev` は Cloudflare Registrar。`astro.config.mjs` の `site` は sitemap 等の絶対 URL 用。

## Claude Code サンドボックス

- `.claude/hooks`・`.claude/skills`・`.claude/settings.json` はサンドボックスの**書き込み保護対象**
  （モデルの自己改変防止）。これらを編集するときは**サンドボックス無効**で実行する。
- `git push` / `gh`（api.github.com）は**キーチェーン証明書検証がサンドボックスに弾かれる**
  （`x509: OSStatus -26276`）→ サンドボックス無効で再実行する。
- `.githooks/` のスクリプトは git が直接実行するためサンドボックス制約を受けない。
- **シェルの cwd はターン間でリセットされうる**。カレント依存のコマンドは絶対パス基準で。

## Git 運用

- **main への直コミットは hook でブロック**。必ずブランチを切る（ブランチ名に `main` を含めない）。
- PR 運用。マージ・デプロイはユーザー。commit 本文で `Closes #N` を使い、マージで close。
