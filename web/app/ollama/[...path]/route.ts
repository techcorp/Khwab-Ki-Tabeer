export const runtime = "edge";

function corsHeaders(origin: string) {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "*",
    "Vary": "Origin",
  };
}

async function handler(req: Request, ctx: { params: { path: string[] } }) {
  const origin = new URL(req.url).origin;

  // /ollama/api/tags -> forward to https://ollama.aikafanda.com/api/tags
  const forwardPath = (ctx.params.path || []).join("/");
  const targetUrl = `https://ollama.aikafanda.com/${forwardPath}`;

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders(origin) });
  }

  const upstream = await fetch(targetUrl, {
    method: req.method,
    headers: req.headers,
    body: ["GET", "HEAD"].includes(req.method) ? undefined : req.body,
  });

  const headers = new Headers(upstream.headers);
  Object.entries(corsHeaders(origin)).forEach(([k, v]) => headers.set(k, v));

  return new Response(upstream.body, { status: upstream.status, headers });
}

export async function GET(req: Request, ctx: any) { return handler(req, ctx); }
export async function POST(req: Request, ctx: any) { return handler(req, ctx); }
export async function PUT(req: Request, ctx: any) { return handler(req, ctx); }
export async function PATCH(req: Request, ctx: any) { return handler(req, ctx); }
export async function DELETE(req: Request, ctx: any) { return handler(req, ctx); }
export async function OPTIONS(req: Request, ctx: any) { return handler(req, ctx); }