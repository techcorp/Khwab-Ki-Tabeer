export const runtime = "edge";

function cors(origin: string) {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "*",
    "Vary": "Origin",
  };
}

async function proxy(req: Request, ctx: { params: { path?: string[] } }) {
  const origin = new URL(req.url).origin;

  // When calling /ollama/api/tags -> path should be ["api","tags"]
  const parts = ctx?.params?.path ?? [];
  const forwardPath = parts.join("/");

  // If no path provided, forward to /api/tags by default (prevents "ollama is running")
  const finalPath = forwardPath.length ? forwardPath : "api/tags";

  const target = `https://ollama.aikafanda.com/${finalPath}`;

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: cors(origin) });
  }

  const upstream = await fetch(target, {
    method: req.method,
    headers: req.headers,
    body: ["GET", "HEAD"].includes(req.method) ? undefined : req.body,
  });

  const headers = new Headers(upstream.headers);
  Object.entries(cors(origin)).forEach(([k, v]) => headers.set(k, v));

  return new Response(upstream.body, { status: upstream.status, headers });
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
export const OPTIONS = proxy;