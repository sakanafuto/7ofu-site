#!/bin/bash
# PostToolUse(Edit|Write) hook: サイトのソース（.astro/.md/.mdx/.ts/.js/.css）を編集したら
# セッションのセンチネルに記録する（Stop hook が build 済みかを判定する）。
#
# Why not prettier --write: hook はサンドボックス外で動く。node_modules/.bin/prettier も
# その設定ファイル（plugin を読む）もモデルがサンドボックス内から書き換えられるので、
# 実行するとサンドボックス外で任意コードを動かせてしまう（adr/0009）。
set -u

ROOT="${CLAUDE_PROJECT_DIR:-$(pwd)}"
# Why not /tmp/claude: サンドボックスから書ける。センチネルを symlink に差し替えられると
# この hook が任意のファイル（~/.zshrc 等）へ追記してしまう。
STATE_DIR="${XDG_STATE_HOME:-${HOME:-}/.local/state}/claude-hooks/7ofu-site"
input=$(cat)

# -I: cwd（プロジェクト直下）の json.py 等を import させない
file_path=$(printf '%s' "$input" | python3 -I -c 'import sys, json
try:
    ti = json.load(sys.stdin).get("tool_input") or {}
    sys.stdout.write(ti.get("file_path") or "")
except Exception:
    pass')
session_id=$(printf '%s' "$input" | python3 -I -c 'import sys, json
try:
    sys.stdout.write(str(json.load(sys.stdin).get("session_id") or "unknown"))
except Exception:
    sys.stdout.write("unknown")' | tr -cd 'A-Za-z0-9_-')
[ -z "$session_id" ] && session_id=unknown

[ -z "${file_path}" ] && exit 0
case "$file_path" in
  *.astro | *.md | *.mdx | *.ts | *.js | *.mjs | *.css) ;;
  *) exit 0 ;;
esac
[ -f "$file_path" ] || exit 0
# build の入力だけを記録する。docs/・.claude/・worker/ を含めると /handoff 等のたびに
# Stop hook が build し直しを求めてしまう（worker/ は astro build の対象外）
case "$file_path" in
  "$ROOT"/src/* | "$ROOT"/astro.config.mjs) ;;
  *) exit 0 ;;
esac
# センチネルは改行区切り。改行を含むパスは分割されて判定から漏れるので受け付けない
case "$file_path" in
  *$'\n'*)
    echo "post-web-quality: 改行を含むパスは記録できない" >&2
    exit 0
    ;;
esac

if ! mkdir -p -m 700 "$STATE_DIR"; then
  echo "post-web-quality: センチネル用ディレクトリを作れない: $STATE_DIR" >&2
  exit 0
fi
printf '%s\n' "$file_path" >>"$STATE_DIR/touched-${session_id}"

exit 0
