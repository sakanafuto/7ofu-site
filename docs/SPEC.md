# SPEC — ページ／機能リスト

7ofu の個人サイト。作ったアプリのランディング・規約・問い合わせを置く静的サイト。
機能 ID（F1〜）で Issue / commit / ADR から参照する。

## 全体像

| ID | ページ / 機能 | パス | 状態 |
|---|---|---|---|
| F1 | Home（つくったもの一覧） | `/` | ✅ |
| F2 | 共通レイアウト（BaseLayout / DocLayout） | `src/layouts/` | ✅ |
| F3 | こうら日記 ランディング＋規約一式 | `/koura-diary/*` | ✅（iOS 公開済み） |
| F4 | Schemely ランディング＋規約一式 | `/schemely/*` | 🚧（iOS 準備中） |
| F5 | 問い合わせフォーム（Web3Forms） | `/<app>/contact` | ✅ |
| F6 | 英語対応（i18n・ja ルート + /en/） | `/en/**` | ✅ |

## F1 Home
- 「つくったもの」をカードで一覧。各アプリの `/<app>/` へリンク。
- 受入: 公開済みアプリと準備中アプリが判別できる（準備中バッジ）。

## F2 共通レイアウト
- `BaseLayout.astro`: `<head>`・ヘッダー nav・フッター・デザイントークン（`--brand` 等）。
- `DocLayout.astro`: `.md` 規約ページ用。frontmatter `app` / `hub` でパンくず・タイトル・
  戻りリンクをアプリごとに差し替え（既定はこうら日記）。→ adr/0003
- 受入: 新規アプリの規約ページが frontmatter 指定だけで正しいパンくず／タイトルになる。

## F3 こうら日記（リクガメ飼育記録アプリ・tortoise_log）
- ランディング（App Store 導線・Android テスター募集）／使い方／利用規約／
  プライバシー／免責事項／問い合わせ／サンクス。
- 受入: App Store リンクが有効。規約 3 種が DocLayout で表示される。

## F4 Schemely（Deep Link 検証ツール・deeptap）
- ランディング（iOS 準備中表記）／利用規約／プライバシー／問い合わせ／サンクス。
- 規約・プライバシーは実アプリ機能（QR 生成・写真保存・Buy Me a Coffee 応援）と整合。
- 受入: iOS 公開時に「準備中」→ App Store 導線へ差し替えられる構成。
- 残: 紹介文への機能追記（Issue #1）。

## F5 問い合わせフォーム（Web3Forms）
- `action=https://api.web3forms.com/submit` に POST。hidden で access key・subject・
  from_name・redirect（`https://7ofu.dev/<app>/thanks`）。種別 select ＋ 名前 / メール / 本文。
- スパム対策: ハニーポット（`botcheck`）。→ adr/0002
- 受入: 送信で登録メールに届き、`/<app>/thanks` に遷移する。

## F6 英語対応（i18n）
- Astro ネイティブ i18n。ja をルート維持、en を `/en/` 配下（`prefixDefaultLocale:false`）。→ adr/0004
- `src/i18n/ui.ts`（UI 辞書）＋ 言語スイッチャ ＋ `<html lang>` ＋ hreflang（ja/en/x-default）。
- 全ページに en 版（Home / 各アプリ ランディング・contact・thanks・規約類）。
- 規約類の英訳は「日本語版優先（Japanese version prevails）」注記付きの参考訳。
- 受入: `/` は日本語・`/en/` は英語で全ページ到達可、相互に言語スイッチャで遷移、astro build 通過。
- **新ページは ja と en の両方を用意する**（片方だけだとスイッチャがリンク切れ）。

## スコープ外（現時点）
- ブログ / 記事機能、英語以外の言語、アクセス解析、認証。
