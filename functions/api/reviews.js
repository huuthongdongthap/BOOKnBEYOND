export async function onRequestGet(context) {
  const { env } = context;
  try {
    const rawData = await env.BNB_CACHE.get('book_reviews');
    const reviews = rawData ? JSON.parse(rawData) : [];
    return new Response(JSON.stringify(reviews), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}

export async function onRequestPost(context) {
  const { request, env } = context;
  try {
    const newReview = await request.json();
    
    // Basic validation
    if (!newReview.name || !newReview.rating) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }
    
    // Add metadata
    newReview.id = Date.now().toString();
    newReview.date = new Date().toISOString();
    
    // Fetch existing reviews
    const rawData = await env.BNB_CACHE.get('book_reviews');
    let reviews = rawData ? JSON.parse(rawData) : [];
    
    // Prepend new review
    reviews.unshift(newReview);
    
    // Save back to KV
    await env.BNB_CACHE.put('book_reviews', JSON.stringify(reviews));
    
    return new Response(JSON.stringify({ success: true, review: newReview }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
