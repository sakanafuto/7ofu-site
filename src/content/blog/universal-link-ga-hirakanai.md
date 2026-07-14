---
title: 'Universal Link が「開かない」全パターン（iOS 実機で確かめた）'
description: 'Universal Link がアプリで開かないとき、原因は openURL・WKWebView・AASA など複数レイヤーにまたがる。iOS 実機で切り分けた全パターンと確認手順を整理する。'
pubDate: 2026-07-14
tags: ['iOS', 'Universal Link', 'Deep Link', 'Swift']
app: 'schemely'
draft: false
---

「Universal Link を設定したのに、アプリが開いたり開かなかったりする」——iOS の Deep Link を触ったことがある人なら一度は踏む沼です。

やっかいなのは、**原因が一箇所ではない**こと。`openURL` の呼び方、Web ページ側のタップ経路、`apple-app-site-association`（AASA）の書き方とキャッシュ……と、複数のレイヤーにまたがります。しかも「同じ URL」でも**どう開いたか**で結果が変わる。

この記事では、iOS 実機で一つずつ切り分けた「開かないパターン」を、確認手順つきで整理します。検証用に作った iOS アプリ [Schemely](/schemely/) の実装で得た知見がベースです。

## まず前提：Universal Link とカスタムスキームは別物

- **カスタムスキーム**（`myapp://…`）: アプリが URL Types に登録したスキーム。どのアプリが開くかは OS 任せで、衝突すると不定。
- **Universal Link**（`https://…`）: 通常の https URL。対応アプリが入っていればアプリが、なければ Safari が開く。ドメイン所有の証明（AASA）が要る。

「開かない」の相談はほとんどが Universal Link 側です。以下、UL を中心に見ていきます。

## パターン① 自アプリ宛の UL を `openURL` で開くと Safari に落ちる

最初のワナがこれです。**アプリが自分自身宛ての Universal Link を `UIApplication.open` で開くと、アプリではなく Safari にフォールバック**します（他アプリ宛なら普通に起動します）。

つまり「アプリ内のボタンから `openURL` で自社 UL を叩く」テストをすると、実際のユーザー体験と違う結果になる。ここで「開かないぞ？」と悩むのは典型的な回り道です。

`.universalLinksOnly` を付けると「UL として開けたか」を厳密に判定できます:

```swift
UIApplication.shared.open(url, options: [.universalLinksOnly: true]) { opened in
    // opened == false なら「この URL は（今の経路では）UL として開けなかった」
}
```

## パターン② `canOpenURL` は当てにならない

「開く前に開けるか確認したい」と `canOpenURL(_:)` を使いたくなりますが、これは **`Info.plist` の `LSApplicationQueriesSchemes` に列挙したスキームしか答えられません**。任意のスキームを事前判定する用途には使えない設計です。

なので実務では「**開いてみて、失敗（ハンドラなし）を検出する**」のが正解になります。`open(url:options:completionHandler:)` の `completion` が `false` を返したら「開けなかった」。事前チェックに頼らない、が鉄則です。

## パターン③ WKWebView の「直リンク」では UL は発火しない

Web からアプリを開くとき、`WKWebView` に URL をそのままメインフレームで読み込んでも **Universal Link は起動しません**。UL が発火するのは、**cross-domain のアンカーを実際にユーザーがタップした**ときだけ、という iOS の仕様です。

- `webView.load(URLRequest(url: ...))` のようなメインフレーム読み込み → 起動しない
- Web ページ内の `<a href="https://…">` を**ユーザーがタップ** → 起動する（cross-domain のとき）

Schemely の「Web tap」モードは、`loadHTMLString(_, baseURL: nil)`（origin を持たない状態）で実アンカーを描画し、そのタップで UL を再現しています。カスタムスキームのほうは `decidePolicyFor` で傍受して `openURL` に委譲します。

> 「メモアプリに URL を貼るとアプリが開くのに、自作の画面だと開かない」——この差はたいてい、**プログラム経由 vs 実際のタップ**の違いです。

## パターン④ AASA が原因のとき（ここが一番深い）

ドメイン側の `apple-app-site-association` が正しく効いていないパターン。落とし穴が多いので分けて書きます。

### 実機が見ているのは「Apple の CDN」

AASA の取得元は 2 つあります。

- ドメイン直: `https://<domain>/.well-known/apple-app-site-association`
- Apple CDN: `https://app-site-association.cdn-apple.com/a/v1/<domain>`

**実機が実際に参照するのは後者の CDN 版**です（`swcd` が取りに行く）。だから「サーバに置いた AASA を直接 curl したら正しい」でも、CDN 側がまだ古い／未取得なら UL は効きません。切り分けるときは CDN の URL を直接見にいくのが確実です。

### 反映が遅れる（キャッシュ）

AASA を更新しても、CDN と端末側のキャッシュのせいで**すぐには反映されません**。デバッグ中に「直したのに変わらない」の多くはこれ。アプリの再インストールや時間を置いての再確認が要ります。

### リダイレクト禁止

AASA の取得はリダイレクトを追いません。`/.well-known/apple-app-site-association` が 301/302 で飛ぶ構成だと**取得失敗**になります。素の 200 で返すこと。

### `components`（モダン）と `paths`（レガシー）は両方現役

いまの AASA には 2 つの書式があり、**大手アプリは今も両方使っています**。片方しか想定していないと誤診断します。

モダンな `components` 形式（apple.com・github.com など）:

```json
{
  "applinks": {
    "details": [
      {
        "appIDs": ["ABCDE12345.com.example.app"],
        "components": [
          { "/": "/ru/*", "exclude": true },
          { "/": "/*" }
        ]
      }
    ]
  }
}
```

レガシーな `paths` 形式（例: メルカリ）:

```json
{
  "applinks": {
    "apps": [],
    "details": [
      {
        "appID": "ABCDE12345.com.example.app",
        "paths": ["/item/*", "NOT /help/*"]
      }
    ]
  }
}
```

さらに罠。**`components` キーが存在すると（たとえ空配列でも）`paths` は無視されます**。「`paths` を書いたのに効かない」ときは、同じ `details` に空の `components` が残っていないか疑ってください。

### glob の意味を取り違えない

パスのパターンマッチはワイルドカードですが、正規表現ではありません。

- `*` … 0 文字以上の任意
- `?` … **ちょうど 1 文字**
- レガシー `paths` はパスだけを見る（クエリ・フラグメントは対象外）。既定で **case-sensitive**

`/item/*` は `/item/123` にマッチしますが `/items/123` にはマッチしない、といった細かい差でハマります。

## パターン⑤ そのほかの「開かない」

- **対象アプリが入っていない**: UL は対応アプリが無ければ Web に落ちます。当たり前ですが見落としがち。
- **スキームの綴り間違い**: `myapp://` のつもりが `myaap://`。カスタムスキームは静かに失敗します。
- **シミュレータには対象アプリが無い**: シミュレータで「開かない」なら、まず実機で試す。

## どう切り分けるか

ここまでを踏まえると、UL のデバッグは「**どの経路で・どう開いたか**」を固定して観察するのが近道だと分かります。

1. 実際の**ユーザータップ経路**で開く（プログラム経由の `openURL` は挙動が違う）
2. 開いた／ハンドラなし／Web に落ちた、の**結果を明示的に見る**
3. AASA は**実機が見る CDN 版**を、`components`/`paths` 両対応で確認する

この 3 つを一台で試せるようにしたのが [Schemely](/schemely/) です。任意の URL からタップ可能なリンクを作って実際にタップし、結果（開いた／ハンドラなし／UL ではなかった）を表示します。AASA インスペクタは CDN 版を取得して、入力 URL がどのルールにマッチするかを見せます。「なぜ開かないか」を製品側で切り分けられるようにした、という感じです。

## まとめ

- 自アプリ宛 UL の `openURL` は Safari に落ちる。テストは実タップ経路で。
- `canOpenURL` は列挙制で当てにならない。開いて失敗を検出する。
- WKWebView は cross-domain の**実タップ**でのみ UL 発火。
- AASA は **CDN 版が正**・キャッシュ遅延・リダイレクト禁止・`components`/`paths` 両対応・glob は正規表現ではない。

「たまに開かない」は、たいていこのどれかの組み合わせです。経路を固定して一つずつ潰していけば、必ず原因にたどり着けます。
