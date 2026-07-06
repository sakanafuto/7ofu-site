#!/bin/bash
# Stop hook（センチネル方式）: このセッションでサイトのソースを編集した場合のみ
# `npm run build`（astro build）を実行する。失敗時は exit 2 + stderr で差し戻す。
# テストは無いので、壊れた import・frontmatter 不備・テンプレート崩れを build で検出する。
set -u

ROOT="${CLAUDE_PROJECT_DIR:-$(pwd)}"
input=$(cat)

session_id=$(printf '%s' "$input" | python3 -c 'import sys, json
try:
    sys.stdout.write(str(json.load(sys.stdin).get("session_id") or "unknown"))
except Exception:
    sys.stdout.write("unknown")')
stop_active=$(printf '%s' "$input" | python3 -c 'import sys, json
try:
    sys.stdout.write(str(json.load(sys.stdin).get("stop_hook_active") or "false"))
except Exception:
    sys.stdout.write("false")')

# 無限ループ防止: 既に Stop hook 起因で継続中なら再ブロックしない
case "$stop_active" in
  True | true) exit 0 ;;
esac

SENTINEL="/tmp/claude/7ofu-touched-${session_id}"
[ -f "$SENTINEL" ] || exit 0

# 実在するファイルのみ・重複排除
touched=$(sort -u "$SENTINEL" | while IFS= read -r f; do [ -f "$f" ] && echo "$f"; done)
if [ -z "$touched" ]; then
  rm -f "$SENTINEL"
  exit 0
fi

cd "$ROOT" || exit 0
if ! out=$(npm run build 2>&1); then
  {
    echo "astro build に失敗。修正してから完了すること:"
    printf '%s\n' "$out" | tail -40
  } >&2
  exit 2
fi

rm -f "$SENTINEL"
exit 0
