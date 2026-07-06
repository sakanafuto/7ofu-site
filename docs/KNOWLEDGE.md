# KNOWLEDGE — ハマりどころ・運用ナレッジ

## Web3Forms（問い合わせフォーム）

- **無料枠でも送信内容は「access key を発行したメールアドレス」へメール通知される**（これが標準動作・
  有料要素ではない）。届かない時はまず**迷惑メールフォルダ**を疑う（2026-07-06 実際にここだった）。
- 無料枠は**月 250 件**まで。超えると届かなくなる。
- access key はクライアント埋め込み前提の**公開キー**（秘密情報ではない・gitleaks 対象外でよい）。
  こうら日記と Schemely は同一キーを共用 → 同じ受信箱に届く。`subject` / `from_name` で判別。
  宛先を分けたいときは Web3Forms でアプリ別キーを発行して差し替える。
- **Turnstile（CAPTCHA）は無料枠が検証非対応**のため不採用（commit 44c35af で撤去）。
  スパム対策はハニーポット `botcheck`（人には見えない checkbox）で代替。→ adr/0002

## Astro / ルーティング

- `.md` ページは `src/pages/<app>/terms.md` → `/<app>/terms/index.html` にビルドされる。
  リンクは末尾スラッシュなし（`/schemely/terms`）で書いており、Astro 既定の `trailingSlash: 'ignore'`
  で解決される（koura-diary と同方式）。
- **DocLayout の再利用**: `.md` の frontmatter に `app` / `hub` を足すとパンくず・タイトル・戻り
  リンクが差し替わる。未指定はこうら日記（後方互換）。→ adr/0003
- ストアカードのグリッドは `repeat(auto-fit, minmax(...))`。カード 1 枚（iOS 単体）でも
  半分に寄らず安定幅で表示される（`repeat(2, 1fr)` だと 1 枚時に崩れる）。
- ビルドは速い（ja+en 全 26 ページで ~1s）。**テストは無く、`astro build` が事実上の回帰ゲート**
  （壊れた import・frontmatter 不備・テンプレート崩れを検出）。

## 多言語化（i18n・adr/0004）

- Astro ネイティブ i18n。ja がルート（`/schemely/terms`）、en が `/en/` 配下（`/en/schemely/terms`）。
  `astro.config.mjs` の `i18n.routing.prefixDefaultLocale:false`。
- locale 判定は `src/i18n/ui.ts` の `getLangFromUrl(Astro.url)`（`/en/*` → en、他 → ja）。
  `Astro.currentLocale` でも取れるが URL 基準で明示している。
- **共有レイアウト（BaseLayout / DocLayout）だけが両 locale を 1 ファイルで描画**し、辞書 `ui` で
  nav・doc 定型文を切替。ランディング・規約の本文は locale 別ページ（`src/pages/en/**`）に持つ。
- 言語スイッチャ／hreflang は `alternatePath(pathname, lang)` で対になる URL を生成（`/en` 接頭辞の
  付け外し・末尾スラッシュ込みで解決）。**新ページは ja/en 両方作る**（片方欠けるとスイッチャが 404）。
- 問い合わせフォームは共通化せず en を新規作成（稼働中 ja フォームを触らない）。en は件名に `(EN)`、
  redirect を `/en/<app>/thanks`。option の value は英語だが `name="種別"` は ja と揃えて通知を統一。
- ビルド HTML の `<!-- Lism CSS（デザイン…） -->` 開発コメントは全 locale に残る（不可視・無害）。
  かな検出で引っかかるのはこれで、本文の翻訳漏れではない。

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
