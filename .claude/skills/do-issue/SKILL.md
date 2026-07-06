---
name: do-issue
description: 指定した GitHub Issue をブランチ → 実装 → code-reviewer レビュー → /verify → PR 作成まで進める。引数は Issue 番号（例: 1）。
---

# 指定 Issue を対応（/do-issue <番号>）

このリポジトリは **PR 運用・main への直コミットは hook でブロック**。
1 件の Issue をブランチで仕上げて PR にするところまでを担う skill（マージはユーザー）。

## 手順

### 1. Issue を読む
```sh
gh issue view <N> --json number,title,body,labels,state
```
- 受入条件・スコープを把握する。**曖昧/情報不足なら着手前にユーザーへ確認**。
  すでに close 済みなら中断して報告。

### 2. 計画（必要なら）
- 3 ステップ以上・設計判断を伴うなら CLAUDE.md に従い**計画を提示して承認を得る**。単純なら不要。
- 設計判断をしたら `docs/adr/` に追記する。

### 3. ブランチ → 実装
- `git switch -c feat/<slug>` または `fix/<slug>`（ブランチ名に `main` を含めない）。
- 実装。ページ追加は `src/pages/<app>/`、規約 `.md` は DocLayout + frontmatter（app/hub）。
- 編集時 hook が働く（センチネル記録・prettier があれば整形）。

### 4. レビュー（maker≠checker）
- `code-reviewer` エージェントに skeptic 前提でレビューさせる（docs/operating-model.md）。
  必要に応じて `frontend-patterns` 等のスキルを参照。

### 5. /verify
- `/verify`（`npm run build`）で push 前に一括確認。green を確認する。

### 6. コミット（Conventional Commits・本文日本語）
- 本文に **`Closes #<N>`** を入れる（マージで GitHub が自動 close）。
- 末尾に `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`。

### 7. push → PR 作成
```sh
git push -u origin <branch>            # サンドボックスに弾かれたら無効で再実行
gh pr create --fill                    # または --title/--body を明示
```
- **マージ・本番反映（`npx wrangler deploy`）はユーザーが実行**。

### 8. 報告
- 実装内容・対象 Issue 番号・主要コミット・PR URL を簡潔に。

## 注意
- main へ直接コミット・push しない（hook がブロック）。必ずブランチ → PR。
