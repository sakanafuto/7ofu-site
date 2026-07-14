---
title: 'Universal Link が開かない全パターンと切り分け方'
description: 'Universal Link がアプリで開かない原因を、アプリ側の Associated Domains からサーバの AASA、WKWebView の挙動まで、iOS 実機で切り分けた順に整理する。'
pubDate: 2026-07-14
tags: ['iOS', 'Universal Link', 'Deep Link', 'Swift']
app: 'schemely'
draft: false
---

Universal Link を設定したのに、アプリが開いたり開かなかったりする。iOS の Deep Link を触ると一度は必ず踏む沼です。

原因が一箇所に閉じていないのが厄介なところで、アプリ側のエンタイトルメント、サーバの `apple-app-site-association`（AASA）、Web ページ側のタップ経路と、別々のレイヤーに散っています。しかも同じ URL でも、どう開いたかで結果が変わります。

iOS 実機で一つずつ潰していった原因を、疑うべき順に並べます。検証用に作った iOS アプリ [Schemely](/schemely/) で得た知見がベースです。

## 前提：Universal Link とカスタムスキームは別物

- カスタムスキーム（`myapp://…`）は、アプリが URL Types に登録したスキーム。どのアプリが開くかは OS 任せで、衝突すると不定になります。
- Universal Link（`https://…`）は通常の https URL。対応アプリが入っていればアプリが、なければ Safari が開きます。ドメイン所有の証明（AASA）が要ります。

「開かない」の相談はほとんどが Universal Link 側なので、以下は UL を中心にします。

## パターン1：アプリ側の Associated Domains が抜けている

サーバの AASA を疑う前に、まずここです。実務で「UL が全く効かない」ときの最頻の原因は、**アプリ側の受け口の設定漏れ**でした。

Universal Link を受けるには、アプリの Associated Domains エンタイトルメントに対象ドメインを登録する必要があります。

```
com.apple.developer.associated-domains = [
  "applinks:example.com"
]
```

ここで詰まるのはだいたい次のどれかです。

- Xcode の Signing & Capabilities で Associated Domains を追加し忘れている
- App ID で Associated Domains が有効になっておらず、**プロビジョニングプロファイルにエンタイトルメントが入っていない**
- `applinks:` のドメイン綴りが違う、`https://` を付けてしまっている（スキームは書かない）

サーバの AASA がどれだけ完璧でも、アプリ側が受け取れなければ何も起きません。「AASA は正しいのに開かない」で止まっている人は、まずこの受け口を確認してください。

## パターン2：自アプリ宛の UL を `openURL` で開くと Safari に落ちる

次のワナ。アプリが自分自身宛ての Universal Link を `UIApplication.open` で開くと、アプリではなく Safari にフォールバックします。他アプリ宛なら普通に起動します。

アプリ内のボタンから `openURL` で自社 UL を叩いてテストすると、実際のユーザー体験と違う結果になります。ここで悩むのは典型的な回り道です。

`.universalLinksOnly` を付ければ「UL として開けたか」を厳密に判定できます。

```swift
UIApplication.shared.open(url, options: [.universalLinksOnly: true]) { opened in
    // opened == false なら、この URL は今の経路では UL として開けなかった
}
```

## パターン3：`canOpenURL` で判定しようとしている

「開く前に開けるか確認したい」と `canOpenURL(_:)` を使いたくなりますが、これは UL の可否判定には使えません。

- https の URL は、ブラウザ（Safari）が入っていれば `canOpenURL` は常に `true` を返します。「アプリが開けるか」は分かりません。
- カスタムスキームは、`Info.plist` の `LSApplicationQueriesSchemes` に列挙したスキームしか答えられません。任意スキームの事前判定はできない設計です。

どちらにせよ事前チェックは当てにならないので、実務では「開いてみて、失敗（ハンドラなし）を検出する」のが正解になります。

## パターン4：WKWebView の直リンクでは発火しない

Web からアプリを開くとき、`WKWebView` に URL をそのままメインフレームで読み込んでも Universal Link は起動しません。発火するのは、cross-domain のアンカーを実際にユーザーがタップしたときだけです。**同一ドメイン内の遷移でも発火しません。**

- `webView.load(URLRequest(url:))` のようなメインフレーム読み込み → 起動しない
- 同一ドメインの `<a>` をタップ → 起動しない
- 別ドメインの `<a href="https://…">` をユーザーがタップ → 起動する

Schemely の Web tap モードは、`loadHTMLString(_, baseURL: nil)`（origin を持たない状態）で実アンカーを描画し、そのタップで UL を再現しています。カスタムスキームのほうは `decidePolicyFor` で傍受して `openURL` に委譲します。

> メモアプリに貼った URL はアプリが開くのに、自作の画面だと開かない。この差はたいてい、プログラム経由か実際のタップか、の違いです。

## パターン5：AASA まわり

ここからがサーバ側 AASA の話。落とし穴が多いので分けます。

### 実機が見ているのは Apple の CDN

AASA の取得元は 2 つあります。

- ドメイン直: `https://<domain>/.well-known/apple-app-site-association`
- Apple CDN: `https://app-site-association.cdn-apple.com/a/v1/<domain>`

実機が実際に参照するのは後者の CDN です（`swcd` が取りに行く）。サーバに置いた AASA を直接 curl して正しくても、CDN がまだ古ければ UL は効きません。切り分けるときは CDN の URL を直接見にいきます。

### 反映が遅れる。開発中は mode=developer で回避する

AASA を更新しても、CDN と端末のキャッシュのせいですぐには反映されません。「直したのに変わらない」の多くはこれです。

開発中の回避策があります。エンタイトルメントを `applinks:example.com?mode=developer` にして、端末の 設定 > デベロッパ > Associated Domains Development をオンにすると、swcd が CDN を経由せずドメインから直接 AASA を取りに行きます。キャッシュ遅延を踏まずに検証できるので、詰まったらこれが一番速い答えです。

### リダイレクト禁止

AASA の取得はリダイレクトを追いません。`/.well-known/apple-app-site-association` が 301/302 で飛ぶ構成だと取得失敗になります。素の 200・`Content-Type: application/json` で返してください（拡張子や署名は現行では不要です）。

### `components` と `paths` は両方現役

いまの AASA には 2 つの書式があり、大手アプリは今も両方使っています。片方しか想定していないと誤診断します。

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

罠がもう一つ。`components` キーが存在すると、たとえ空配列でも `paths` は無視されます。「`paths` を書いたのに効かない」ときは、同じ `details` に空の `components` が残っていないか疑ってください。

### glob は正規表現ではない

パスのパターンはワイルドカードで、正規表現ではありません。

- `*` は 0 文字以上の任意
- `?` はちょうど 1 文字
- レガシー `paths` はパスだけを見ます（クエリ・フラグメントは対象外）。既定で case-sensitive です。

`/item/*` は `/item/123` にマッチしますが `/items/123` にはマッチしない、といった差でハマります。

## パターン6：そのほか

- 対象アプリが入っていない。UL は対応アプリが無ければ Web に落ちます。
- スキームの綴り間違い。`myapp://` のつもりが `myaap://`。カスタムスキームは静かに失敗します。
- シミュレータに対象アプリが無い。シミュレータで開かないなら、まず実機で試します。

## 端末で何が起きているかを見る

「CDN を見にいけ」の次に、端末側のログを直接見る手段もあります。

- macOS / シミュレータ: `swcutil dl -d example.com` で AASA の取得を手動でトリガーし、`swcutil show` で登録状態のダンプを見られます。
- 実機: Console.app で対象デバイスを選び、プロセス `swcd` のログを追うと、取得の成否や却下理由が出ます。

Schemely を使えば AASA インスペクタで CDN 版を取得してマッチを見られますが、素の手段も知っておくと切り分けが速くなります。

## 切り分けの順番

ここまでを踏まえると、UL のデバッグは「どの経路で・どう開いたか」を固定して観察するのが近道です。順番はこうなります。

1. アプリ側の Associated Domains（受け口）を最初に確認する
2. 実際のユーザータップ経路で開く。プログラム経由の `openURL` は挙動が違う
3. 開いた / ハンドラなし / Web に落ちた、の結果を明示的に見る
4. AASA は実機が見る CDN 版を、`components` / `paths` 両対応で確認する（開発中は `mode=developer`）

この 1〜4 を一台で試せるようにしたのが [Schemely](/schemely/) です。任意の URL からタップ可能なリンクを作って実際にタップし、結果を表示します。AASA インスペクタは CDN 版を取得して、入力 URL がどのルールにマッチするかを見せます。

## まとめ

- まず **アプリ側の Associated Domains の設定漏れ**を疑う。サーバ AASA より前。
- 自アプリ宛 UL の `openURL` は Safari に落ちる。テストは実タップ経路で。
- `canOpenURL` は UL の可否判定には使えない。開いて失敗を検出する。
- WKWebView は cross-domain の実タップでのみ発火。同一ドメイン遷移では発火しない。
- AASA は CDN 版が正。キャッシュは `mode=developer` で回避。リダイレクト禁止・`components` / `paths` 両対応・glob は正規表現ではない。

「たまに開かない」は、たいていこのどれかの組み合わせです。経路を固定して一つずつ潰していけば、必ず原因にたどり着けます。
