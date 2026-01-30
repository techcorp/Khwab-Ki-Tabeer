export async function onRequest(context: any): Promise<Response> {
  const { request, env, params } = context;

  const corsHeaders: Record<string, string> = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
    "Access-Control-Max-Age": "86400",
  };

  // Handle preflight
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  const upstreamBase = (env.OLLAMA_UPSTREAM_URL || "").trim();
  if (!upstreamBase) {
    return new Response("Missing env OLLAMA_UPSTREAM_URL", { status: 500, headers: corsHeaders });
  }

  // params.path will be like "api/generate" or "api/tags"
  const path = (params?.path as string | undefined) || "";
  const incomingUrl = new URL(request.url);

  // Build upstream URL (preserve query)
  const upstreamUrl = new URL(upstreamBase);
  const targetUrl = new URL(upstreamUrl.toString());
  targetUrl.pathname = `/${path}`;        // IMPORTANT: forward exact path
  targetUrl.search = incomingUrl.search;  // preserve query

  // Clone headers
  const headers = new Headers(request.headers);

  // IMPORTANT: do NOT forward browser Origin (can confuse some upstream setups)
  headers.delete("origin");

  // Set Cloudflare Access on server-side ONLY (safe)
  if (env.CF_ACCESS_CLIENT_ID && env.CF_ACCESS_CLIENT_SECRET) {
    headers.set("CF-Access-Client-Id", env.CF_ACCESS_CLIENT_ID);
    headers.set("CF-Access-Client-Secret", env.CF_ACCESS_CLIENT_SECRET);
  }

  // Forward body only for non-GET/HEAD
  const method = request.method.toUpperCase();
  const body =
    method === "GET" || method === "HEAD" ? undefined : await request.arrayBuffer();

  const upstreamResp = await fetch(targetUrl.toString(), {
    method,
    headers,
    body,
  });

  // Copy response headers + add CORS
  const respHeaders = new Headers(upstreamResp.headers);
  for (const [k, v] of Object.entries(corsHeaders)) respHeaders.set(k, v);

  return new Response(upstreamResp.body, {
    status: upstreamResp.status,
    headers: respHeaders,
  });
}
