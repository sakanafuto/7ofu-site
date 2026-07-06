# ADR（Architecture Decision Records）

設計判断を「なぜそうしたか」とともに残す。**追記のみ・不変**（覆すときは新しい ADR を起こし、
旧 ADR に `Superseded by 000X` を追記する）。HANDOFF には設計判断を書かず、ここか KNOWLEDGE へ。

| # | タイトル | 状態 |
|---|---|---|
| [0001](0001-tech-stack.md) | 技術スタック（Astro 静的 + Cloudflare Workers） | Accepted |
| [0002](0002-contact-form.md) | 問い合わせ基盤（Web3Forms・Turnstile 不採用） | Accepted |
| [0003](0003-doclayout-multi-app.md) | DocLayout をアプリ横断で再利用（app/hub frontmatter） | Accepted |

## フォーマット

```markdown
# 000X. タイトル
- 状態: Proposed / Accepted / Superseded by 000Y
- 日付: YYYY-MM-DD

## 背景
## 決定
## 理由
## 代替案
## 影響
```
