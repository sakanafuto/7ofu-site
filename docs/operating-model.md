# 運用モデル（Claude の動かし方）

tortoise_log / deeptap の運用モデルを Astro 静的サイト向けに移植したもの。
**狙い**: 独立した機械的作業は素早く回しつつ、理解（comprehension）は厚いまま保つ。
**自律発火ループは使わない**（2026/6 以降のプログラム実行課金を避ける）。

## 体制: 対話オーケストレータ＋オンデマンド役割エージェント

会話は 1 本（メインの Claude）。必要時に役割サブエージェントを起動する。

| 役割 | エージェント / Skill | いつ |
|---|---|---|
| 実装 | オーケストレータ本体 | 既定 |
| レビュー（maker≠checker） | `code-reviewer` + 必要に応じ `frontend-patterns` 等 | PR 前に必ず 1 回。skeptic 前提（壊れている前提で NG 探し） |
| 探索 / 設計 | `Explore` / `Plan` | 広い探索・実装計画 |
| ビルド修正 | `build-error-resolver` | astro build 失敗時のみ |

## フロー（1 Issue / 機能）

```
計画 → branch → 実装 → code-reviewer レビュー → /verify（astro build）→ PR 作成
  → ユーザーがマージ → ユーザーが `npx wrangler deploy`（本番反映）
```

- 停止条件は決定的ゲート（/verify・Stop hook・pre-push）。モデルの自己判定に委ねない。
- main への直コミットは hook でブロック。必ずブランチを切る。

## 品質ゲート

| ゲート | タイミング | 内容 |
|---|---|---|
| PreToolUse hook | Bash 実行前 | 危険コマンド遮断（force push / rm -rf / wrangler deploy） |
| PostToolUse hook | Edit/Write 時 | `.astro`・`.md` 等の編集を記録（＋prettier があれば整形） |
| Stop hook | ターン終了時 | `.astro`・`.md` を触ったターンのみ `npm run build` |
| pre-commit | commit | gitleaks（シークレットスキャン） |
| pre-push | push | `npm run build`（ビルド通過ゲート） |
| /verify | push / 区切り前 | 上記ビルドを push せず先取り |

- テストは持たない（コンテンツ静的サイト）。**ビルド通過**を主ゲートにする。
  リンク切れ・テンプレート崩れ・frontmatter 不備は astro build が検出する。

## やらないこと

- 自律発火ループ（cron / /schedule / /loop / ultrareview / GitHub Actions 自走）— 課金ルール
- CI での品質チェック（ローカル hooks で担保）
- 依存を増やすためだけの依存追加（フォーマッタ等は必要になってから）

## 人間が最後の砦

レビューエージェントを入れても、最終確認・理解はユーザーの責務。
本番デプロイ（`wrangler deploy`）・PR マージ・問い合わせフォームの実送信確認は人間が行う。
