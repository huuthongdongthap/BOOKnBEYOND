/**
 * Cloudflare Pages Function: /api/cache-bust
 * Clears the KV cache so next request fetches fresh Sheet data
 * Called by BĐH after updating Google Sheets
 */

export async function onRequestGet(context) {
  const { env } = context;
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  };

  try {
    if (env.BNB_CACHE) {
      await env.BNB_CACHE.delete('sheet-data-v2');
    }
    return new Response(JSON.stringify({
      ok: true,
      message: 'Cache cleared! Web sẽ load data mới từ Google Sheet.',
      timestamp: new Date().toISOString()
    }), { headers });
  } catch (error) {
    return new Response(JSON.stringify({ ok: false, error: error.message }), {
      status: 500, headers
    });
  }
}
