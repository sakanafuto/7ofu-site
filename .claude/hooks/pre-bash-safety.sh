#!/bin/bash
# PreToolUse(Bash) hook: 危険コマンドをブロックする（exit 2 = ブロック、理由は stderr）。
# JSON パースは python3。
set -u

input=$(cat)
cmd=$(printf '%s' "$input" | python3 -c 'import sys, json
try:
    sys.stdout.write((json.load(sys.stdin).get("tool_input") or {}).get("command") or "")
except Exception:
    pass')
[ -z "$cmd" ] && exit 0

block() {
  echo "BLOCKED: $1" >&2
  exit 2
}

# 1) git push --force / -f（force push 禁止）
printf '%s' "$cmd" | grep -qE 'git[[:space:]]+push[^|;&]*([[:space:]]--force([[:space:]]|=|$)|[[:space:]]-f([[:space:]]|$))' &&
  block "git push --force は禁止。必要ならユーザーに依頼すること。"

# 2) rm -rf（ビルド成果物・一時ディレクトリ以外は禁止）
if printf '%s' "$cmd" | grep -qE 'rm[[:space:]]+(-[a-zA-Z]*r[a-zA-Z]*f|-[a-zA-Z]*f[a-zA-Z]*r)[a-zA-Z]*([[:space:]]|$)'; then
  printf '%s' "$cmd" | grep -qE '(dist|\.astro|\.wrangler|node_modules|/tmp/|\$TMPDIR|\$\{TMPDIR)' ||
    block "rm -rf は dist/.astro/.wrangler/node_modules と一時ディレクトリ以外に使わない。"
fi

# 3) 本番デプロイはユーザーが行う
printf '%s' "$cmd" | grep -qE 'wrangler[[:space:]][^|;&]*(deploy|publish)' &&
  block "wrangler deploy（本番反映）はユーザーが行う。"

exit 0
