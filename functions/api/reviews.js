export async function onRequestGet(context) {
  const { env } = context;
  try {
    const rawData = await env.BNB_CACHE.get('book_reviews');
    let reviews = rawData ? JSON.parse(rawData) : [];
    
    // Fallback to mock data if empty, to demonstrate the UI
    if (reviews.length === 0) {
      reviews = [
        {
          id: "1",
          name: "Thông",
          bookTitle: "Flow — Dòng Chảy",
          rating: 5,
          text: "Một cuốn sách làm thay đổi hoàn toàn cách mình nhìn nhận về hạnh phúc và công việc. Trạng thái Flow thực sự là cảnh giới cao nhất của sự tập trung. Những ngày qua áp dụng thử, thấy hiệu suất tăng rõ rệt mà không hề bị mệt mỏi.",
          date: new Date().toISOString()
        },
        {
          id: "2",
          name: "Giang",
          bookTitle: "Trò Chơi Vô Cực",
          rating: 4,
          text: "Tư duy vô cực giúp mình bớt lo lắng về những cạnh tranh ngắn hạn. Kinh doanh không phải là thắng thua, mà là làm sao để tiếp tục được chơi. Simon Sinek chưa bao giờ làm mình thất vọng.",
          date: new Date().toISOString()
        },
        {
          id: "3",
          name: "Lương",
          bookTitle: "Nhóm Chính Bắc",
          rating: 5,
          text: "Đọc xong mới thấy giá trị của một nhóm hỗ trợ nhau thực sự. Cuốn sách rất thực tế về việc xây dựng True North Group. Chắc chắn CLB mình nên áp dụng triệt để những nguyên tắc kỷ luật trong này.",
          date: new Date().toISOString()
        },
        {
          id: "4",
          name: "Thanh",
          bookTitle: "Quản Lý Nghiệp",
          rating: 4,
          text: "Gieo nhân nào gặt quả nấy, triết lý kinh điển nhưng được diễn giải lại dưới góc nhìn cực kỳ thực tiễn. Cách tốt nhất để thành công là giúp người khác thành công.",
          date: new Date().toISOString()
        }
      ];
    }

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
