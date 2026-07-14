// Static Assets の前段に薄く乗る Worker。/api/like だけ自前で処理し、
// それ以外は静的アセット（dist）へ委譲する（adr/0006）。
// 型パッケージ（@cloudflare/workers-types）に依存しないよう最小の型だけ内包する。

interface KV {
  get(key: string): Promise<string | null>;
  put(key: string, value: string): Promise<void>;
}
interface Env {
  LIKES: KV;
  ASSETS: { fetch(request: Request): Promise<Response> };
}

// slug は英小文字・数字・ハイフンのみ（記事ファイル名に一致）。KV キーの汚染を防ぐ。
const SLUG_RE = /^[a-z0-9-]{1,80}$/;

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}

async function handleLike(request: Request, env: Env, url: URL): Promise<Response> {
  const slug = url.searchParams.get('slug') ?? '';
  if (!SLUG_RE.test(slug)) {
    return json({ error: 'invalid slug' }, 400);
  }
  const key = `like:${slug}`;

  if (request.method === 'GET') {
    const count = Number((await env.LIKES.get(key)) ?? '0');
    return json({ count });
  }

  if (request.method === 'POST') {
    // KV は read-modify-write が非原子的。個人規模なので稀な競合は許容（adr/0006）。
    const count = Number((await env.LIKES.get(key)) ?? '0') + 1;
    await env.LIKES.put(key, String(count));
    return json({ count });
  }

  return json({ error: 'method not allowed' }, 405);
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname === '/api/like') {
      return handleLike(request, env, url);
    }
    // 通常はアセットが先に返るのでここには来ないが、フォールバックとして委譲する
    return env.ASSETS.fetch(request);
  },
};
