# 0005. アプリ改名に追従してサイトを LinkMint → Schemely に改名

- 状態: Accepted
- 日付: 2026-07-06

## 背景

iOS アプリ（別リポジトリ `deeptap`）で、アプリ名を **LinkMint → Schemely** に改名した
（bundle `com.togawa.schemely` / スキーム `schemely://`）。アプリ内の規約・プライバシー・
問い合わせリンクは `https://7ofu.dev/schemely/...` を指すよう変更済み。7ofu-site 側の slug と
ブランド表記が LinkMint のままだと、In-App リンクが 404 になる。

## 決定

- ページ slug を rename: `src/pages/linkmint` → `src/pages/schemely`、
  `src/pages/en/linkmint` → `src/pages/en/schemely`（ja/en 両方）。
- アイコン asset を rename: `public/linkmint.svg` → `public/schemely.svg`。
- ブランド表記・パス・辞書キー・フォーム hidden（subject / from_name / redirect）を
  全面 `LinkMint`→`Schemely` / `linkmint`→`schemely` に一括置換。
- 旧 URL は `public/_redirects` で新 slug へ 301 リダイレクト（`/linkmint/*` と `/en/linkmint/*`）。
- **koura-diary は据え置き**（改名対象外）。

## 理由

- In-App リンク（`https://7ofu.dev/schemely/...`）を成立させるのが必須要件。
- 既に配布・被リンクされ得る旧 `/linkmint/...` を 301 で寄せ、リンク切れと SEO 毀損を防ぐ。
- 過去 ADR（0001/0003/0004）中のアプリ名参照も現行名 Schemely に揃えた。**製品は同一で
  名称のみ変更**のため履歴の意味は損なわれず、改名の事実は本 ADR に記録する（append-only の趣旨）。

## 代替案

- **旧 slug も残して二重提供**: 実体が増え保守が煩雑。301 リダイレクトで十分。却下。
- **リダイレクトを Worker のルーティングで実装**: Static Assets の `_redirects` で足りる。
  もし将来 `_redirects` が honor されない構成になったら Worker 側に移す。

## 影響

- `git grep 'LinkMint\|linkmint'` の残留は、意図的な 2 箇所のみ:
  本 ADR（旧名の記録）と `public/_redirects`（旧パスの FROM 指定）。
- 新規ページ追加時の slug は `schemely`。今後アプリ改名があれば同様に slug + brand + redirect を更新する。
