# 0002. 問い合わせ基盤（Web3Forms・Turnstile 不採用）

- 状態: Accepted
- 日付: 2026-07-06（commit 2d45c6a / 44c35af の判断を記録）

## 背景

問い合わせ手段が必要。当初は Notion フォームを使っていたが、静的サイトに自前フォームを
置きたい。ただしサーバ（Workers Functions 等）は増やしたくない（静的配信のまま保ちたい）。

## 決定

- **Web3Forms** を使う。`<form action="https://api.web3forms.com/submit" method="POST">` に
  hidden で access key・subject・from_name・redirect（`https://7ofu.dev/<app>/thanks`）を載せる。
- スパム対策は**ハニーポット**（`botcheck` の不可視 checkbox）。
- **Turnstile（CAPTCHA）は採用しない**。

## 理由

- Web3Forms は静的サイトから直接 POST でき、送信内容を登録メールへ通知する（無料枠・月 250 件）。
  サーバを持たずに問い合わせを成立させられる。
- access key はクライアント埋め込み前提の公開キーで、漏洩リスクの性質が異なる（秘密情報ではない）。
- Turnstile を一度追加（8961ee2）したが、**Web3Forms の無料枠はサーバ側 Turnstile 検証に非対応**で
  実効性が無いと判明し撤去（44c35af）。無料枠で効くハニーポットに一本化した。

## 代替案

- **Notion フォーム**（旧構成）: サイト外導線でデザイン不統一。自前フォームへ移行（2d45c6a）。
- **Cloudflare Workers で自前受信**: サーバを持つことになり静的構成の利点を失う。
- **Formspree 等の他サービス**: 機能は同等。既に導入済みの Web3Forms を継続。

## 影響

- 迷惑メール振り分けに注意（KNOWLEDGE 参照）。宛先分離が必要ならアプリ別 access key を発行。
- 高度なスパムが問題化したら、有料枠 + Turnstile 検証、または Workers 受信を再検討する。
