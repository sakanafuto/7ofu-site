#!/bin/bash
# PostToolUse(Edit|Write) hook: サイトのソース（.astro/.md/.mdx/.ts/.js/.css）を編集したら
# セッションのセンチネルに記録する（Stop hook が build 要否を判定する）。
# prettier があれば当該ファイルを整形する（無ければ何もしない＝依存を強制しない）。
set -u

ROOT="${CLAUDE_PROJECT_DIR:-$(pwd)}"
input=$(cat)

file_path=$(printf '%s' "$input" | python3 -c 'import sys, json
try:
    ti = json.load(sys.stdin).get("tool_input") or {}
    sys.stdout.write(ti.get("file_path") or "")
except Exception:
    pass')
session_id=$(printf '%s' "$input" | python3 -c 'import sys, json
try:
    sys.stdout.write(str(json.load(sys.stdin).get("session_id") or "unknown"))
except Exception:
    sys.stdout.write("unknown")')

[ -z "${file_path}" ] && exit 0
case "$file_path" in
  *.astro | *.md | *.mdx | *.ts | *.js | *.mjs | *.css) ;;
  *) exit 0 ;;
esac
[ -f "$file_path" ] || exit 0
# プロジェクト外（別リポ等）への編集は対象外
case "$file_path" in
  "$ROOT"/*) ;;
  *) exit 0 ;;
esac

# Stop hook 用センチネル（このセッションでソースを触ったことを記録）
mkdir -p /tmp/claude
printf '%s\n' "$file_path" >>"/tmp/claude/7ofu-touched-${session_id}"

cd "$ROOT" || exit 0
# prettier があれば整形（無ければ skip・失敗しても続行）
if [ -x node_modules/.bin/prettier ]; then
  node_modules/.bin/prettier --write "$file_path" >/dev/null 2>&1 || true
fi

exit 0
