#!/bin/bash
# Stop hook（センチネル方式）: このセッションでサイトのソースを編集した場合、
# 最後の編集より後に astro build が成功しているか（dist/index.html の方が新しいか）を確かめる。
# 古ければ exit 2 + stderr で差し戻し、/verify（npm run build）の実行を求める。
#
# Why not ここで npm run build: hook はサンドボックス外で動く。build は astro.config.mjs・
# node_modules・ソースなど、モデルがサンドボックス内から書き換えられるコードを実行するので、
# サンドボックス外での任意コード実行になる。build はモデルにサンドボックス内の Bash で
# 走らせ、hook は「走ったか」だけを決定的に判定する（adr/0009）。
set -u

ROOT="${CLAUDE_PROJECT_DIR:-$(pwd)}"
STATE_DIR="${XDG_STATE_HOME:-${HOME:-}/.local/state}/claude-hooks/7ofu-site"
input=$(cat)

# -I: cwd（プロジェクト直下）の json.py 等を import させない
session_id=$(printf '%s' "$input" | python3 -I -c 'import sys, json
try:
    sys.stdout.write(str(json.load(sys.stdin).get("session_id") or "unknown"))
except Exception:
    sys.stdout.write("unknown")' | tr -cd 'A-Za-z0-9_-')
[ -z "$session_id" ] && session_id=unknown
stop_active=$(printf '%s' "$input" | python3 -I -c 'import sys, json
try:
    sys.stdout.write(str(json.load(sys.stdin).get("stop_hook_active") or "false"))
except Exception:
    sys.stdout.write("false")')

# 無限ループ防止: 既に Stop hook 起因で継続中なら再ブロックしない。
# センチネルは残すので、build しないまま終えても次のターン終了時にまた判定する。
case "$stop_active" in
  True | true) exit 0 ;;
esac

SENTINEL="$STATE_DIR/touched-${session_id}"
[ -f "$SENTINEL" ] || exit 0

# 実在するファイルのみ・重複排除
touched=$(sort -u "$SENTINEL" | while IFS= read -r f; do [ -f "$f" ] && echo "$f"; done)
if [ -z "$touched" ]; then
  rm -f "$SENTINEL"
  exit 0
fi

# build 失敗時の astro は dist を更新しない（古い index.html が残る）ので、
# 「最終編集より新しい index.html」を build 成功の証跡にできる。
EVIDENCE="$ROOT/dist/index.html"
stale=""
if [ ! -f "$EVIDENCE" ]; then
  stale="dist/index.html が無い"
else
  while IFS= read -r f; do
    if [ "$f" -nt "$EVIDENCE" ]; then
      stale="${f#"$ROOT"/} が最後の build より新しい"
      break
    fi
  done <<EOF
$touched
EOF
fi

if [ -n "$stale" ]; then
  {
    echo "ソースを編集した後の astro build が確認できない（${stale}）。"
    echo "/verify（Bash で npm run build）を実行し、通ってから完了すること。"
  } >&2
  exit 2
fi

rm -f "$SENTINEL"
exit 0
