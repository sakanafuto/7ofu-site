# 0009. Claude Code の hook でプロジェクト内のコードを実行しない

- 状態: Accepted
- 日付: 2026-10-21

## 背景

Claude Code の hook（`.claude/hooks/`）は Bash サンドボックスの**外**で、ユーザー権限のまま動く。
一方モデルはサンドボックス内から、プロジェクト内のほぼ全てのファイル（`src/`・`astro.config.mjs`・
`node_modules/`・プロジェクト直下）と `/tmp/claude` に書き込める。

claude-security のスキャン（2026-10-21）と、その修正パッチの検証で次の経路が見つかった。どれも
「サンドボックス内で書いたものを、hook がサンドボックス外で実行・利用する」という同じ型。

- PostToolUse hook が `node_modules/.bin/prettier --write` を実行する（prettier 本体や設定・plugin を差し替えられる）
- Stop hook が `npm run build` を実行する（`astro.config.mjs`・ソース・依存のコードが走る）
- 全 hook の `python3 -c 'import json'` が、cwd（プロジェクト直下）に置かれた `json.py` を import する
- センチネル `/tmp/claude/7ofu-touched-*` を symlink に差し替えると、hook が任意のファイルへ追記する

## 決定

hook はプロジェクト内のコードを実行せず、サンドボックスから書ける場所にも書かない。

- PostToolUse hook の prettier 整形を削除する（センチネル記録だけ残す）
- 全 hook の python を `python3 -I -c` にする（cwd・PYTHON* 環境変数を無視）
- センチネルを `${XDG_STATE_HOME:-~/.local/state}/claude-hooks/7ofu-site/` に置く（サンドボックスからは書けない）。
  session_id は英数字・`_`・`-` 以外を除去してからパスに使う
- Stop hook は build を実行しない。代わりに「最後に編集したファイルより `dist/index.html` が新しいか」で、
  編集後に build が成功したかを判定し、古ければ exit 2 で `/verify` の実行を求める。build はモデルが
  サンドボックス内の Bash で走らせる

`dist/index.html` を証跡にできる根拠: Astro 7 の `astro build` は開始時に `dist/` を空にし、コンパイル
エラーでもレンダリング時の例外でも `dist/index.html` を残さずに失敗する（2026-10-21 に実測）。

## 理由

- 問題は個々の hook ではなく「サンドボックス外の実行がサンドボックス内の書き込みに依存する」構造なので、
  hook 全体で同じ規則にそろえる。指摘ごとに直すと、別の hook に同じ穴が残る
- 判定（build が通ったか）は決定的なまま保てる（operating-model の「停止条件は決定的ゲート」を維持）。
  実行だけをサンドボックス内へ移す

## 代替案

- Stop hook で build を続け、`sandbox-exec` で閉じ込める: 書き込みは絞れるが、読み取りを絞らないと
  `.env` や `~/.claude` を build 出力（stderr の tail）経由で持ち出せる。読み取りを絞る許可リストは
  Node/Vite/Astro の依存先が広く保守が重い。macOS 専用でもある。却下
- Stop hook を廃止し `/verify` と pre-push に任せる: 最も単純だが、build し忘れをターン終了時に
  捕まえられなくなる。却下
- Stop hook は常に exit 2 で「build せよ」と促すだけにする: 判定がモデルの自己申告になり、決定的ゲートでなくなる。却下
- prettier を残し、実行前にハッシュ等で本体を検証する: 設定ファイルや plugin まで含めた検証が必要で割に合わない。
  整形は必要になったらモデルがサンドボックス内で `npx prettier` を走らせればよい。却下

## 影響

- 編集のたびの自動整形はなくなる（prettier は現状未導入なので実害なし）
- 編集の記録対象は build の入力（`src/` と `astro.config.mjs`）に絞る。`docs/`・`.claude/`・`worker/` まで
  記録すると、`/verify` の後に `/handoff` で HANDOFF を書くたびに build し直しを求められるため
- 判定は 1 ターン終了につき 1 回。差し戻し後の継続（`stop_hook_active`）では再判定しない（無限ループ防止）。
  センチネルは残るので、build しないまま終えても次のユーザーターンの終了時にまた差し戻す
- 証跡は「build 成功」そのものではない。`dist/index.html` を書いた後の処理で失敗した build、build 開始後で
  index.html 生成前の編集は見逃しうる。また「失敗時に index.html が残らない」は Astro 7 の挙動の実測で、
  Astro の更新で変わりうる。どれも pre-push と Workers Builds の build が最終的に捕まえる
- モデルは `dist/index.html` の mtime を `touch` で偽装できる。これは意図的な回避であり、hook の目的
  （build 忘れの検出）の範囲外とする。最終的な build 通過は pre-push と Workers Builds が担保する
- 残る経路: `git push` は TLS 検証の都合でサンドボックス無効で実行するため（KNOWLEDGE 参照）、pre-push の
  `npm run build` はサンドボックス外で走る。push は毎回権限確認を通る操作なので許容する
- 同じ hook 構成を使う他リポジトリ（tortoise_log 等）にも同じ修正が要る
