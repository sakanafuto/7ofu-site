---
name: verify
description: astro build を実行してサイト全体が壊れていないか一括確認し、結果を報告する。push 前・区切りの最終確認に使う。
---

# 一括検証（/verify）

pre-push フックと同等のチェック（`astro build`）を push せずに先取りする skill。
このサイトはテストを持たないため、**ビルド通過が事実上の回帰ゲート**
（壊れた import・frontmatter 不備・テンプレート崩れ・リンク生成の破綻を検出する）。

## 手順

### 1. ビルドを実行する

```sh
npm run build
```

- prettier を導入している場合は `node_modules/.bin/prettier --check .` も併せて実行する
  （未導入なら省略・依存は強制しない）。

### 2. 結果を報告する

| 項目 | 結果 |
|---|---|
| build（astro build） | ✅/❌（生成ページ数） |
| format（prettier があれば） | ✅/❌ |

- 失敗があれば該当エラーの要点を引用し、修正方針を 1 行添える。
- green なら「push 可能」と明言する。

## 注意

- ビルド出力（`dist/`）・`.astro/` は gitignore 済み。コミット対象に含めない。
- 本番反映はユーザーが `npx wrangler deploy` で実行する（/verify の範囲外）。
