#!/bin/bash
# UserPromptSubmit hook: docs/HANDOFF.md（25行以内のセッション跨ぎ現在地）を
# 毎プロンプトの文脈に注入する。stdout が context に追加される。
set -u

ROOT="${CLAUDE_PROJECT_DIR:-$(pwd)}"
HANDOFF="$ROOT/docs/HANDOFF.md"

if [ -f "$HANDOFF" ]; then
  echo "<handoff>"
  head -25 "$HANDOFF"
  echo "</handoff>"
fi

exit 0
