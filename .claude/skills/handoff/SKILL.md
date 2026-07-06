---
name: handoff
description: docs/HANDOFF.md（セッション跨ぎの現在地・25行以内）を現状から再生成する。セッション終盤や大きな区切りで使う。
---

# HANDOFF.md の更新（/handoff）

`docs/HANDOFF.md` を現状で書き直す skill。このファイルは UserPromptSubmit hook により
毎プロンプトの文脈に自動注入されるため、**必ず 25 行以内**に収める（超過分は注入されない）。

## 手順

### 1. 現状を収集する

```sh
git branch --show-current
git status --short
git log main..HEAD --oneline   # 作業ブランチなら
gh pr list --state open --json number,title --jq '.[] | "#\(.number) \(.title)"' 2>/dev/null
```

加えて、会話の文脈から「直前に完了したこと」「次のアクション」「ブロッカー」を拾う。

### 2. テンプレートに沿って全置換する（追記しない）

```markdown
# HANDOFF（最終更新: YYYY-MM-DD）

## 現在地
- ブランチ: xxx ／ リモート: github.com/sakanafuto/7ofu-site

## 直前に完了したこと
- …（1〜3 行）

## 次のアクション
- …（1〜3 行。具体的に）

## ブロッカー・注意点
- …（なければ「なし」）
```

### 3. 制約チェック

- `wc -l docs/HANDOFF.md` で **25 行以内**を確認する。超えたら要約して削る。
- 設計判断（なぜそうしたか）はここに書かず `docs/adr/` または `docs/KNOWLEDGE.md` へ。
- HANDOFF の更新はそのままコミットしてよい（`docs: HANDOFF を更新` 等）。
