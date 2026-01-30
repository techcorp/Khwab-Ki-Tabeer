export async function onRequest(context: any) {
  const { request, params } = context;
  const url = new URL(request.url);

  const path = Array.isArray(params.path) ? params.path.join("/") : params.path;
  const target = `https://ollama.aikafanda.com/${path || ""}`;

  // CORS preflight
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": url.origin,
        "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
        "Access-Control-Allow-Headers": request.headers.get("Access-Control-Request-Headers") || "*",
        "Access-Control-Allow-Credentials": "true",
        "Vary": "Origin",
      },
    });
  }

  const newReq = new Request(target, request);
  const resp = await fetch(newReq);

  const headers = new Headers(resp.headers);
  headers.set("Access-Control-Allow-Origin", url.origin);
  headers.set("Access-Control-Allow-Credentials", "true");
  headers.set("Vary", "Origin");

  return new Response(resp.body, {
    status: resp.status,
    headers,
  });
}