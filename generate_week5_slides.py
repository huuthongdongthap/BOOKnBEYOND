# -*- coding: utf-8 -*-
"""
Generator for MetaHuman Week 5 Slides:
- slides-metahuman-ch11.html (Chương 11: Hồi sinh hoàn trí, tr. 261-280)
- slides-metahuman-ch12.html (Chương 12: Nhận thức không chọn lựa, tr. 281-296)
- slides-metahuman-ch13.html (Chương 13: Một cuộc đời, tr. 297-312)
Compliant with M3-Zen tokens, 100% authentic author concepts, explicit badges for additions, and 12 slides/deck.
"""

import os
import sys

HEAD_TEMPLATE = """<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{title} | BOOKnBEYOND</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,800;0,900;1,400;1,700&family=Be+Vietnam+Pro:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after {{ margin: 0; padding: 0; box-sizing: border-box; }}

    :root {{
      --md-sys-color-surface: #fbfaf8;
      --md-sys-color-surface-dim: #f3f0ea;
      --md-sys-color-surface-container: #ffffff;
      --md-sys-color-surface-container-high: #f7f6f2;
      --md-sys-color-outline-variant: rgba(15, 23, 42, 0.07);

      --font-display: 'Playfair Display', Georgia, serif;
      --font-body: 'Be Vietnam Pro', -apple-system, BlinkMacSystemFont, sans-serif;

      --text-primary: #0f172a;
      --text-secondary: #334155;
      --text-muted: #64748b;
      --text-dim: #94a3b8;

      --primary: #1e3a8a;
      --primary-container: #eff6ff;
      --primary-border: rgba(30, 58, 138, 0.16);

      --badge-expand-bg: rgba(99, 102, 241, 0.08);
      --badge-expand-border: rgba(99, 102, 241, 0.28);
      --badge-expand-text: #6366f1;

      --badge-example-bg: rgba(217, 119, 6, 0.08);
      --badge-example-border: rgba(217, 119, 6, 0.28);
      --badge-example-text: #d97706;

      --md-shape-corner-md: 16px;
      --md-shape-corner-lg: 24px;
      --md-shape-corner-xl: 32px;
      --md-shape-corner-full: 9999px;

      --elevation-flat: 0 0 0 1px var(--md-sys-color-outline-variant);
      --elevation-1: 0 1px 3px rgba(15, 23, 42, 0.04), 0 1px 2px rgba(15, 23, 42, 0.02), 0 0 0 1px var(--md-sys-color-outline-variant);
      --elevation-2: 0 8px 24px -4px rgba(15, 23, 42, 0.05), 0 2px 8px -2px rgba(15, 23, 42, 0.03), 0 0 0 1px var(--md-sys-color-outline-variant);
      --motion-standard: cubic-bezier(0.2, 0, 0, 1);
    }}

    html, body {{
      width: 100%; height: 100%; overflow: hidden;
      background: var(--md-sys-color-surface);
      font-family: var(--font-body);
      color: var(--text-primary);
      -webkit-font-smoothing: antialiased;
    }}

    body::before {{
      content: ''; position: fixed; inset: 0;
      background: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
      opacity: 0.022; pointer-events: none; z-index: 9999;
    }}

    .deck {{ width: 100vw; height: 100vh; position: relative; }}

    .slide {{
      position: absolute; inset: 0;
      display: flex; flex-direction: column; justify-content: center; align-items: center;
      padding: 60px 100px;
      opacity: 0; visibility: hidden;
      transition: opacity 0.5s var(--motion-standard), transform 0.5s var(--motion-standard);
      transform: translateX(24px);
    }}
    .slide.active {{ opacity: 1; visibility: visible; transform: translateX(0); }}
    .slide.exit {{ opacity: 0; transform: translateX(-24px); }}

    .slide-inner {{ position: relative; z-index: 1; width: 100%; max-width: 1160px; }}
    .serif {{ font-family: var(--font-display); }}

    .slide-number {{
      position: absolute; bottom: 28px; right: 48px;
      font-size: 13px; color: var(--text-dim); letter-spacing: 2px; z-index: 10; font-weight: 500;
    }}
    .slide-brand {{
      position: absolute; bottom: 28px; left: 48px;
      font-size: 12px; color: var(--text-dim); letter-spacing: 1.8px; z-index: 10; font-weight: 600; text-transform: uppercase;
    }}

    .m3-chip-bar {{ display: flex; align-items: center; gap: 10px; margin-bottom: 20px; flex-wrap: wrap; }}
    .m3-chip {{
      display: inline-flex; align-items: center; gap: 6px; height: 32px; padding: 0 16px;
      border-radius: var(--md-shape-corner-full); font-size: 13px; font-weight: 600;
      letter-spacing: 0.8px; text-transform: uppercase; box-shadow: var(--elevation-flat);
    }}
    .m3-chip-tag {{ background: var(--primary-container); color: var(--primary); border: 1px solid var(--primary-border); }}

    .badge-source {{
      display: inline-flex; align-items: center; gap: 6px; padding: 6px 16px;
      border-radius: var(--md-shape-corner-full); font-size: 13px; font-weight: 600; letter-spacing: 0.3px;
    }}
    .badge-expand {{ background: var(--badge-expand-bg); border: 1px solid var(--badge-expand-border); color: var(--badge-expand-text); }}
    .badge-example {{ background: var(--badge-example-bg); border: 1px solid var(--badge-example-border); color: var(--badge-example-text); }}

    .zen-card {{
      background: var(--md-sys-color-surface-container); border-radius: var(--md-shape-corner-lg);
      padding: 30px 34px; box-shadow: var(--elevation-1);
      transition: transform 0.28s var(--motion-standard), box-shadow 0.28s var(--motion-standard);
      position: relative;
    }}
    .zen-card:hover {{ transform: translateY(-2px); box-shadow: var(--elevation-2); }}

    .zen-quote-container {{
      background: var(--md-sys-color-surface-container); border-radius: var(--md-shape-corner-xl);
      padding: 40px 48px; box-shadow: var(--elevation-1); border-left: 5px solid var(--primary);
      position: relative; max-width: 960px; margin: 0 auto; text-align: left;
    }}
    .zen-quote-container::before {{
      content: '“'; position: absolute; top: 12px; left: 20px;
      font-family: var(--font-display); font-size: 80px; line-height: 1; color: var(--primary);
      opacity: 0.12; pointer-events: none;
    }}
    .zen-quote-text {{ font-size: 25px; line-height: 1.5; font-style: italic; color: var(--text-primary); margin-bottom: 18px; }}
    .zen-citation {{ font-size: 14px; color: var(--text-muted); font-weight: 500; letter-spacing: 0.3px; }}

    .grid-dual {{ display: grid; grid-template-columns: 1fr 1fr; gap: 26px; margin-top: 14px; }}
    .grid-triple {{ display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; margin-top: 14px; }}
    .grid-quad {{ display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 14px; }}

    .zen-title {{ font-size: 32px; font-weight: 800; line-height: 1.24; margin-bottom: 20px; letter-spacing: -0.4px; }}
    .zen-card-title {{ font-size: 19px; font-weight: 700; margin-bottom: 10px; color: var(--text-primary); display: flex; align-items: center; gap: 10px; }}
    .zen-card-body {{ font-size: 15px; line-height: 1.66; color: var(--text-secondary); }}
    .zen-card-body strong {{ color: var(--text-primary); }}

    .step-number {{
      display: inline-flex; align-items: center; justify-content: center;
      width: 28px; height: 28px; border-radius: var(--md-shape-corner-full);
      background: var(--primary-container); color: var(--primary); font-size: 13px; font-weight: 700;
    }}

    .evidence-point {{
      margin-top: 10px; padding: 10px 14px;
      background: var(--md-sys-color-surface-dim); border-radius: 10px; font-size: 14px; line-height: 1.55;
    }}
    .evidence-point.highlight {{
      background: var(--primary-container); border: 1px solid var(--primary-border); color: var(--primary);
    }}

    .progress-bar {{ position: fixed; top: 0; left: 0; height: 3px; background: var(--primary); transition: width 0.3s var(--motion-standard); z-index: 1000; }}
    .nav-arrows {{ position: fixed; bottom: 24px; right: 120px; display: flex; gap: 8px; z-index: 100; }}
    .nav-btn {{
      width: 38px; height: 38px; border-radius: var(--md-shape-corner-full);
      background: var(--md-sys-color-surface-container); border: 1px solid var(--md-sys-color-outline-variant);
      box-shadow: var(--elevation-1); color: var(--text-secondary); font-size: 16px; cursor: pointer;
      display: flex; align-items: center; justify-content: center; transition: all 0.2s var(--motion-standard);
    }}
    .nav-btn:hover {{ background: #ffffff; color: var(--primary); box-shadow: var(--elevation-2); transform: translateY(-1px); }}

    @media (max-width: 900px) {{
      .slide {{ padding: 40px 24px; }}
      .grid-dual, .grid-triple, .grid-quad {{ grid-template-columns: 1fr; gap: 16px; }}
      .zen-title {{ font-size: 23px; margin-bottom: 16px; }}
      .zen-quote-container {{ padding: 26px 18px; }}
      .zen-quote-text {{ font-size: 19px; }}
      .slide-brand {{ left: 24px; bottom: 18px; }}
      .slide-number {{ right: 24px; bottom: 18px; }}
      .nav-arrows {{ right: 80px; bottom: 14px; }}
    }}
  </style>
</head>
<body>

  <div class="deck">
"""

FOOTER_TEMPLATE = """  </div>

  <div class="progress-bar" id="progressBar"></div>

  <div class="nav-arrows">
    <button class="nav-btn" onclick="prevSlide()" aria-label="Previous Slide">←</button>
    <button class="nav-btn" onclick="nextSlide()" aria-label="Next Slide">→</button>
  </div>

  <script>
    const slides = document.querySelectorAll('.slide');
    let current = 0;
    function showSlide(n) {{
      slides[current].classList.remove('active');
      slides[current].classList.add('exit');
      setTimeout(() => slides[current].classList.remove('exit'), 500);
      current = ((n % slides.length) + slides.length) % slides.length;
      slides[current].classList.add('active');
      document.getElementById('progressBar').style.width = ((current + 1) / slides.length * 100) + '%';
    }}
    function nextSlide() {{ showSlide(current + 1); }}
    function prevSlide() {{ showSlide(current - 1); }}

    document.addEventListener('keydown', (e) => {{
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'Enter') {{ e.preventDefault(); nextSlide(); }}
      if (e.key === 'ArrowLeft' || e.key === 'Backspace') {{ e.preventDefault(); prevSlide(); }}
      if (e.key === 'f' || e.key === 'F') {{
        !document.fullscreenElement ? document.documentElement.requestFullscreen() : document.exitFullscreen();
      }}
    }});

    let touchStartX = 0;
    document.addEventListener('touchstart', (e) => {{ touchStartX = e.changedTouches[0].screenX; }}, {{ passive: true }});
    document.addEventListener('touchend', (e) => {{
      const diffX = touchStartX - e.changedTouches[0].screenX;
      if (Math.abs(diffX) > 45) {{ diffX > 0 ? nextSlide() : prevSlide(); }}
    }}, {{ passive: true }});

    document.getElementById('progressBar').style.width = ((1) / slides.length * 100) + '%';
  </script>
</body>
</html>
"""

print("Templates defined.")


CH11_SLIDES = """
    <!-- SLIDE 1: Cover -->
    <div class="slide active" id="slide-1">
      <div class="slide-inner" style="text-align: center;">
        <div class="m3-chip-bar" style="justify-content: center;">
          <span class="m3-chip m3-chip-tag">TUẦN 5 · PHẦN 3 & CHƯƠNG 11</span>
        </div>
        <h1 class="serif" style="font-size: 46px; font-weight: 800; line-height: 1.18; margin-bottom: 16px; color: var(--text-primary); letter-spacing: -0.5px;">
          Chương 11: Hồi Sinh Hoàn Trí
        </h1>
        <p class="serif" style="font-size: 22px; color: var(--primary); margin-bottom: 34px; font-style: italic;">
          Freeing Your Mind & Restoring Wholeness — Deepak Chopra, M.D.
        </p>
        <div style="display: flex; justify-content: center; gap: 32px; font-size: 15px; color: var(--text-muted); font-weight: 500;">
          <span>📅 Chủ nhật · 25/10/2026</span>
          <span>📖 Phạm vi: tr. 261 – 280 (20 trang)</span>
          <span>🏛️ BOOKnBEYOND Club</span>
        </div>
      </div>
      <div class="slide-brand">BOOKnBEYOND · METAHUMAN</div>
      <div class="slide-number">1 / 12</div>
    </div>

    <!-- SLIDE 2: Grounding Principle: Wholeness as True Nature -->
    <div class="slide" id="slide-2">
      <div class="slide-inner">
        <div class="m3-chip-bar">
          <span class="m3-chip m3-chip-tag">ĐỊNH ĐỀ NGUYÊN BẢN · BẢN CHẤT CỦA TÂM TRÍ</span>
        </div>
        <h2 class="zen-title serif">Hoàn Trí Là Trạng Thái Tự Nhiên Của Ý Thức Thuần Túy</h2>
        <div class="zen-quote-container">
          <p class="zen-quote-text serif">
            "Bản chất nguyên thủy của tâm trí không phải là sự hỗn loạn hay lo âu, mà là 'Hoàn trí' (Wholeness) — một trường nhận thức trọn vẹn, sáng suốt và không hề bị chia cắt. Chúng ta không cần tạo ra sự toàn vẹn; sự toàn vẹn luôn ở đó, chỉ bị che khuất bởi thói quen phân mảnh của bản ngã."
          </p>
          <div class="zen-citation">
            — Deepak Chopra, M.D., <em>Siêu Nhân Loại (MetaHuman)</em>, tr. 261–263
          </div>
        </div>
        <div style="margin-top: 20px; display: flex; justify-content: center;">
          <div class="evidence-point highlight" style="max-width: 880px; text-align: center; font-size: 15px;">
            💎 <strong>Chân lý cốt lõi:</strong> Giống như bầu trời xanh luôn tĩnh lặng phía sau những đám mây giông, sự toàn vẹn của tâm trí (<em>Sat-Chit</em>) là nền tảng bất biến nâng đỡ mọi suy nghĩ biến đổi.
          </div>
        </div>
      </div>
      <div class="slide-brand">BOOKnBEYOND · METAHUMAN</div>
      <div class="slide-number">2 / 12</div>
    </div>

    <!-- SLIDE 3: The Internal Psychological Civil War -->
    <div class="slide" id="slide-3">
      <div class="slide-inner">
        <div class="m3-chip-bar">
          <span class="m3-chip m3-chip-tag">CHƯƠNG 11 · CĂN NGUYÊN TỔN THƯƠNG</span>
        </div>
        <h2 class="zen-title serif">Cuộc "Nội Chiến Tâm Lý" & Sự Tiêu Hao Năng Lượng Tinh Thần</h2>
        <div class="grid-dual">
          <div class="zen-card" style="border-top: 4px solid var(--text-dim);">
            <div class="zen-card-title">1. Kẻ Phán Xét vs Người Bị Phán Xét</div>
            <p class="zen-card-body">
              Tâm trí con người bị chia đôi thành hai chiến tuyến:<br>
              • <strong>Kẻ quan sát hà khắc:</strong> Liên tục chỉ trích, đặt kỳ vọng, so sánh và dằn vặt.<br>
              • <strong>Nạn nhân bất an:</strong> Cảm thấy yếu kém, tội lỗi, sợ hãi và gắng gượng phòng thủ.<br>
              Cuộc giằng co không hồi kết này biến không gian nội tâm thành một chiến trường khốc liệt.<br>
              <small style="color: var(--text-muted); font-style: italic; display: block; margin-top: 10px;">— tr. 263–265</small>
            </p>
          </div>
          <div class="zen-card" style="border-top: 4px solid var(--primary);">
            <div class="zen-card-title" style="color: var(--primary);">2. Tiêu Hao Đến 80% Nguồn Lực Nhận Thức</div>
            <p class="zen-card-body">
              Chopra chỉ ra rằng phần lớn sự mệt mỏi của con người không đến từ công việc thể xác, mà từ <em>sự ma sát nội tâm liên tục</em>.<br><br>
              Khi tâm trí phân mảnh tự đánh nhau, năng lượng sáng tạo, trực giác và khả năng phục hồi tự nhiên bị phong tỏa hoàn toàn.<br>
              <small style="color: var(--primary); font-style: italic; display: block; margin-top: 10px;">— tr. 265–266</small>
            </p>
          </div>
        </div>
      </div>
      <div class="slide-brand">BOOKnBEYOND · METAHUMAN</div>
      <div class="slide-number">3 / 12</div>
    </div>

    <!-- SLIDE 4: Neurobiology & Conditioning -->
    <div class="slide" id="slide-4">
      <div class="slide-inner">
        <div class="m3-chip-bar">
          <span class="m3-chip m3-chip-tag">KHOA HỌC NÃO BỘ · PHẢN XẠ CÓ ĐIỀU KIỆN</span>
        </div>
        <h2 class="zen-title serif">Chiếc Lồng Phản Xạ Thần Kinh & Định Luật Hebb</h2>
        <div class="grid-triple">
          <div class="zen-card">
            <div class="step-number">1</div>
            <div class="zen-card-title" style="margin-top: 10px;">Định Luật Hebbian</div>
            <p class="zen-card-body">
              <em>"Neurons that fire together, wire together."</em> Những nơ-ron phát xung cùng nhau sẽ liên kết chặt chẽ với nhau.<br><br>
              Mỗi suy nghĩ lo âu lặp lại sẽ khắc sâu thêm rãnh mòn thần kinh trong não bộ.<br>
              <small style="color: var(--text-muted); font-style: italic; display: block; margin-top: 8px;">— tr. 266–268</small>
            </p>
          </div>
          <div class="zen-card">
            <div class="step-number">2</div>
            <div class="zen-card-title" style="margin-top: 10px;">Rãnh Mòn Thói Quen</div>
            <p class="zen-card-body">
              Tâm trí bị giam cầm trong những phản xạ tự động: một lời chê bai kích hoạt cơn giận; một sự bất trắc kích hoạt nỗi sợ hãi.<br><br>
              Chúng ta lầm tưởng đó là cá tính của mình, nhưng thực chất chỉ là cơ chế sinh học được lập trình sẵn.<br>
              <small style="color: var(--text-muted); font-style: italic; display: block; margin-top: 8px;">— tr. 268–269</small>
            </p>
          </div>
          <div class="zen-card">
            <div class="step-number">3</div>
            <div class="zen-card-title" style="margin-top: 10px;">Giải Phóng Bằng Tỉnh Thức</div>
            <p class="zen-card-body">
              Tính mềm dẻo của não (<em>Neuroplasticity</em>) chứng minh: Khi ta đem sự chú ý tỉnh thức tách khỏi phản xạ, các liên kết cũ bắt đầu thoái triển.<br><br>
              Ý thức thuần túy có khả năng tái cấu trúc lại toàn bộ mạng lưới nơ-ron.<br>
              <small style="color: var(--text-muted); font-style: italic; display: block; margin-top: 8px;">— tr. 269–270</small>
            </p>
          </div>
        </div>
      </div>
      <div class="slide-brand">BOOKnBEYOND · METAHUMAN</div>
      <div class="slide-number">4 / 12</div>
    </div>

    <!-- SLIDE 5: The Cognitive Paradox -->
    <div class="slide" id="slide-5">
      <div class="slide-inner">
        <div class="m3-chip-bar">
          <span class="m3-chip m3-chip-tag">NGHỊCH LÝ NHẬN THỨC · LỐI THOÁT ĐÍCH THỰC</span>
        </div>
        <h2 class="zen-title serif">Tâm Trí Không Thể Tự Chữa Lành Bằng Cách Đấu Tranh Thêm</h2>
        <div class="zen-quote-container">
          <p class="zen-quote-text serif">
            "Bạn không thể giải quyết vấn đề từ cùng một cấp độ ý thức đã tạo ra vấn đề đó. Cố gắng dùng suy nghĩ để dẹp yên suy nghĩ cũng giống như dùng bùn để gột rửa bùn lầy. Lối thoát duy nhất là bước ra ngoài tâm trí và an trú trong người quan sát tĩnh lặng."
          </p>
          <div class="zen-citation">
            — Trích dẫn định lý Albert Einstein & Luận điểm Deepak Chopra, tr. 270–273
          </div>
        </div>
        <div class="grid-dual" style="margin-top: 20px;">
          <div class="zen-card" style="padding: 20px 26px;">
            <div class="zen-card-title" style="font-size: 16px; color: var(--text-muted);">❌ Nỗ Lực Sai Lầm Của Bản Ngã</div>
            <p class="zen-card-body" style="font-size: 14px;">
              Đè nén cảm xúc, phân tích suy nghĩ thâu đêm, gượng ép suy nghĩ tích cực. Kết quả chỉ tạo thêm lớp xung đột mới.
            </p>
          </div>
          <div class="zen-card" style="padding: 20px 26px; border-left: 3px solid var(--primary);">
            <div class="zen-card-title" style="font-size: 16px; color: var(--primary);">✓ Con Đường Siêu Nhân Loại</div>
            <p class="zen-card-body" style="font-size: 14px;">
              Lùi lại một bước: Nhận ra bạn không phải là ý nghĩ hay cảm xúc, mà là Không Gian Ý Thức đang bao bọc và chứng kiến chúng.
            </p>
          </div>
        </div>
      </div>
      <div class="slide-brand">BOOKnBEYOND · METAHUMAN</div>
      <div class="slide-number">5 / 12</div>
    </div>

    <!-- SLIDE 6: Pure Awareness Dissolves Fear -->
    <div class="slide" id="slide-6">
      <div class="slide-inner">
        <div class="m3-chip-bar">
          <span class="m3-chip m3-chip-tag">CHƯƠNG 11 · ÁNH SÁNG Ý THỨC</span>
        </div>
        <h2 class="zen-title serif">Nhận Thức Tỉnh Thức Tự Hòa Tan Nỗi Sợ Hãi</h2>
        <div class="grid-dual">
          <div class="zen-card">
            <div class="zen-card-title">Ảo Ảnh Cần Bóng Tối Để Tồn Tại</div>
            <p class="zen-card-body">
              Những bóng ma sợ hãi, lo âu và tự ti chỉ có thể thống trị khi bạn chìm trong vô thức (<em>unconsciousness</em>).<br><br>
              Khi bạn thắp sáng ngọn đèn của <strong>sự chú tâm không phán xét</strong>, bản chất huyễn hoặc của suy nghĩ tiêu cực lập tức phơi bày. Bạn thấy rõ: suy nghĩ chỉ là những đám mây trôi, không thể làm hoen ố bầu trời bản thể.<br>
              <small style="color: var(--text-muted); font-style: italic; display: block; margin-top: 10px;">— tr. 273–275</small>
            </p>
          </div>
          <div class="zen-card">
            <div class="zen-card-title" style="color: var(--primary);">Sự Hòa Giải Tự Động</div>
            <p class="zen-card-body">
              Khi không còn bị kháng cự hay tiếp thêm năng lượng sợ hãi, các xung đột nội tâm bắt đầu tự lắng xuống như mặt hồ sau cơn gió lốc.<br><br>
              Hoàn trí được hồi sinh không phải nhờ sửa chữa từng mảnh vỡ, mà nhờ tái nhận biết Bản Thể Nguyên Vẹn vô điều kiện.<br>
              <small style="color: var(--primary); font-style: italic; display: block; margin-top: 10px;">— tr. 275–276</small>
            </p>
          </div>
        </div>
      </div>
      <div class="slide-brand">BOOKnBEYOND · METAHUMAN</div>
      <div class="slide-number">6 / 12</div>
    </div>

    <!-- SLIDE 7: 4 Pillars of Restoring Wholeness -->
    <div class="slide" id="slide-7">
      <div class="slide-inner">
        <div class="m3-chip-bar">
          <span class="m3-chip m3-chip-tag">CHƯƠNG 11 · 4 TRỤ CỘT HÀNH TRÌNH</span>
        </div>
        <h2 class="zen-title serif">4 Bước Tiến Trình Hồi Phục Sự Toàn Vẹn Của Tâm Trí</h2>
        <div class="grid-quad">
          <div class="zen-card">
            <div class="step-number">1</div>
            <div class="zen-card-title" style="margin-top: 10px; font-size: 16px;">Chấp Nhận Triệt Để</div>
            <p class="zen-card-body" style="font-size: 13.5px;">
              Chấm dứt mọi phản kháng với những gì đang diễn ra trong tâm trí. Cho phép cảm xúc được hiển lộ mà không xua đuổi hay trốn chạy.<br>
              <small style="color: var(--text-muted); display: block; margin-top: 6px;">(tr. 276)</small>
            </p>
          </div>
          <div class="zen-card">
            <div class="step-number">2</div>
            <div class="zen-card-title" style="margin-top: 10px; font-size: 16px;">Quan Sát Không Phán Xét</div>
            <p class="zen-card-body" style="font-size: 13.5px;">
              Trở thành nhân chứng tĩnh lặng (<em>The Witness</em>). Nhìn ngắm dòng suy nghĩ trôi qua như nhìn lá rơi trên dòng suối mùa thu.<br>
              <small style="color: var(--text-muted); display: block; margin-top: 6px;">(tr. 277)</small>
            </p>
          </div>
          <div class="zen-card">
            <div class="step-number">3</div>
            <div class="zen-card-title" style="margin-top: 10px; font-size: 16px;">Hợp Nhất Phân Mảnh</div>
            <p class="zen-card-body" style="font-size: 13.5px;">
              Đón nhận cả ánh sáng lẫn bóng tối, cả niềm vui lẫn nỗi buồn. Không xua đuổi phần yếu đuối, ôm trọn mọi khía cạnh của trải nghiệm.<br>
              <small style="color: var(--text-muted); display: block; margin-top: 6px;">(tr. 277–278)</small>
            </p>
          </div>
          <div class="zen-card">
            <div class="step-number">4</div>
            <div class="zen-card-title" style="margin-top: 10px; font-size: 16px;">An Trú Bản Thể</div>
            <p class="zen-card-body" style="font-size: 13.5px;">
              Nhận ra ngôi nhà đích thực của bạn là Ý Thức Bất Biến (<em>Sat-Chit-Ananda</em>), nơi chưa từng bị tổn thương hay phân mảnh.<br>
              <small style="color: var(--text-muted); display: block; margin-top: 6px;">(tr. 278)</small>
            </p>
          </div>
        </div>
      </div>
      <div class="slide-brand">BOOKnBEYOND · METAHUMAN</div>
      <div class="slide-number">7 / 12</div>
    </div>

    <!-- SLIDE 8: The MetaHuman Mind -->
    <div class="slide" id="slide-8">
      <div class="slide-inner">
        <div class="m3-chip-bar">
          <span class="m3-chip m3-chip-tag">TRẠNG THÁI METAHUMAN · ĐỜI SỐNG MỚI</span>
        </div>
        <h2 class="zen-title serif">Tâm Trí Như Một Dụng Cụ Sáng Tạo Tự Phát</h2>
        <div class="grid-dual">
          <div class="zen-card">
            <div class="zen-card-title">Tự Do Khỏi Chiếc Lồng Bận Rộn</div>
            <p class="zen-card-body">
              Trong trạng thái phân mảnh, tâm trí là ông chủ bạo ngược liên tục tạo áp lực và lo sợ tương lai.<br><br>
              Khi hồi sinh hoàn trí, tâm trí trở về đúng vị trí: một dụng cụ tuyệt hảo để phụng sự bản thể. Khi không cần dùng đến suy nghĩ, tâm trí hoàn toàn tĩnh lặng và thư thái.<br>
              <small style="color: var(--text-muted); font-style: italic; display: block; margin-top: 10px;">— tr. 278–279</small>
            </p>
          </div>
          <div class="zen-card">
            <div class="zen-card-title" style="color: var(--primary);">Khai Mở Tiềm Năng Vô Tận</div>
            <p class="zen-card-body">
              Từ một không gian tâm trí tĩnh lặng và trọn vẹn, ba phẩm chất siêu việt tự nhiên đơm hoa kết trái:<br>
              • <strong>Trực giác chính xác:</strong> Thấu suốt giải pháp mà không cần suy tính logic rườm rà.<br>
              • <strong>Sáng tạo tự phát:</strong> Ý tưởng mới tuôn trào trực tiếp từ nguồn cội vũ trụ.<br>
              • <strong>Lòng từ bi tự nhiên:</strong> Yêu thương không toan tính vụ lợi.<br>
              <small style="color: var(--primary); font-style: italic; display: block; margin-top: 10px;">— tr. 279–280</small>
            </p>
          </div>
        </div>
      </div>
      <div class="slide-brand">BOOKnBEYOND · METAHUMAN</div>
      <div class="slide-number">8 / 12</div>
    </div>

    <!-- SLIDE 9: Key Takeaways Comparison -->
    <div class="slide" id="slide-9">
      <div class="slide-inner">
        <div class="m3-chip-bar">
          <span class="m3-chip m3-chip-tag">ĐÚC KẾT ĐỐI CHIẾU · CHƯƠNG 11</span>
        </div>
        <h2 class="zen-title serif">Tâm Trí Phân Mảnh (Bản Ngã) vs Hoàn Trí MetaHuman</h2>
        <div class="grid-dual">
          <div class="zen-card" style="background: var(--md-sys-color-surface-dim);">
            <div class="zen-card-title" style="color: var(--text-secondary);">Tâm Trí Phân Mảnh (Bản Ngã)</div>
            <p class="zen-card-body">
              • Chiến đấu nội tâm: Kẻ phán xét giày vò nạn nhân yếu kém.<br>
              • Phản xạ đóng khung theo định luật Hebb và vết hằn quá khứ.<br>
              • Tiêu tốn 80% sinh lực vào lo âu, phòng thủ và dằn vặt.<br>
              • Luôn khao khát kiểm soát nhưng tràn ngập bất an và hoài nghi.<br>
              <small style="color: var(--text-muted); font-style: italic; display: block; margin-top: 10px;">— tr. 261–272</small>
            </p>
          </div>
          <div class="zen-card" style="background: var(--primary-container); border: 1.5px solid var(--primary-border);">
            <div class="zen-card-title" style="color: var(--primary);">Hoàn Trí MetaHuman (Bản Thể)</div>
            <p class="zen-card-body" style="color: var(--text-primary);">
              • Hợp nhất trọn vẹn: Đón nhận cả ánh sáng lẫn bóng tối.<br>
              • Neo đậu vững chãi trong Không Gian Ý Thức Thuần Túy.<br>
              • Tái cấu trúc não bộ nhờ sự chú tâm tỉnh thức và bình an sâu lắng.<br>
              • Trực giác nhạy bén, sáng tạo tự phát và lòng từ bi tự nhiên.<br>
              <small style="color: var(--primary); font-style: italic; display: block; margin-top: 10px;">— tr. 273–280</small>
            </p>
          </div>
        </div>
      </div>
      <div class="slide-brand">BOOKnBEYOND · METAHUMAN</div>
      <div class="slide-number">9 / 12</div>
    </div>

    <!-- SLIDE 10: Practical Example (slide-design-rules.md compliant) -->
    <div class="slide" id="slide-10">
      <div class="slide-inner">
        <div class="m3-chip-bar">
          <div class="badge-source badge-example">💡 Minh chứng ứng dụng & Ví dụ thực chứng</div>
        </div>
        <h2 class="zen-title serif">Ứng Dụng Hồi Sinh Hoàn Trí Trong Đời Sống Hàng Ngày</h2>
        <div class="grid-dual">
          <div class="zen-card">
            <div class="zen-card-title">1. Bài Tập "Ngồi Cùng Cảm Xúc Đối Lập"</div>
            <p class="zen-card-body">
              Khi gặp thất bại trong công việc hoặc mâu thuẫn gia đình: Thay vì tự phán xét hay cố ép mình phải vui vẻ, hãy ngồi yên lặng 5 phút.<br><br>
              <strong>Kỹ thuật:</strong> Cho phép nỗi buồn và sự tức giận hiện diện trọn vẹn. Thầm nói: <em>"Tôi thấy bạn, tôi đón nhận bạn trong sự bao dung của ý thức."</em> Ngay lập tức, cảm xúc tiêu cực mất đi quyền năng khống chế bạn.
            </p>
          </div>
          <div class="zen-card">
            <div class="zen-card-title">2. Phục Hồi Khả Năng Tập Trung Sâu (Deep Flow)</div>
            <p class="zen-card-body">
              Thực hành "ngắt rãnh mòn phản xạ" khi bị phân tâm bởi điện thoại, mạng xã hội hay thông báo công việc.<br><br>
              <strong>Kỹ thuật:</strong> Mỗi khi có xung động muốn cầm điện thoại lên, hãy dừng lại 3 nhịp thở có ý thức. Nhận diện xung động tự động và để nó tan biến. Bạn sẽ lấy lại sự sáng suốt trọn vẹn để giải quyết bài toán phức tạp.
            </p>
          </div>
        </div>
      </div>
      <div class="slide-brand">BOOKnBEYOND · METAHUMAN</div>
      <div class="slide-number">10 / 12</div>
    </div>

    <!-- SLIDE 11: Expanded Discussion (slide-design-rules.md compliant) -->
    <div class="slide" id="slide-11">
      <div class="slide-inner" style="text-align: center;">
        <div class="m3-chip-bar" style="justify-content: center;">
          <div class="badge-source badge-expand">📌 Mở rộng — câu hỏi chiêm nghiệm cộng đồng</div>
        </div>
        <h2 class="zen-title serif" style="margin-bottom: 26px;">Đối Thoại Phản Biện & Chiêm Nghiệm Chương 11</h2>
        <div class="zen-card" style="max-width: 920px; margin: 0 auto; text-align: left; padding: 30px 40px;">
          <div style="display: flex; gap: 16px; margin-bottom: 16px;">
            <span style="font-size: 22px;">⚖️</span>
            <p class="zen-card-body" style="font-size: 15px;">
              Trong đời sống hàng ngày, "kẻ phán xét nội tâm" của bạn thường lên tiếng gay gắt nhất trong hoàn cảnh nào? Bạn sẽ phản ứng ra sao nếu lần tới chỉ lặng lẽ mỉm cười lắng nghe nó mà không đồng hóa?
            </p>
          </div>
          <div style="display: flex; gap: 16px; margin-bottom: 16px;">
            <span style="font-size: 22px;">🧠</span>
            <p class="zen-card-body" style="font-size: 15px;">
              Những "rãnh mòn phản xạ" nào (như cáu gắt khi kẹt xe, hoảng hốt khi trễ hẹn) đang tiêu hao nhiều năng lượng tinh thần của bạn nhất? Bạn có sẵn sàng áp dụng 3 nhịp thở tỉnh thức để ngắt mạch tự động này?
            </p>
          </div>
          <div style="display: flex; gap: 16px;">
            <span style="font-size: 22px;">🕊️</span>
            <p class="zen-card-body" style="font-size: 15px;">
              Khi Einstein nói rằng <em>"Không thể giải quyết vấn đề bằng chính tâm thức đã tạo ra nó"</em>, bạn liên hệ thế nào đến việc buông bỏ nỗ lực kiểm soát để trực giác tự phát dẫn dắt các quyết định quan trọng?
            </p>
          </div>
        </div>
      </div>
      <div class="slide-brand">BOOKnBEYOND · METAHUMAN</div>
      <div class="slide-number">11 / 12</div>
    </div>

    <!-- SLIDE 12: Closing Summary -->
    <div class="slide" id="slide-12">
      <div class="slide-inner" style="text-align: center;">
        <h2 class="serif" style="font-size: 42px; font-weight: 900; color: var(--text-primary); margin-bottom: 12px;">BOOKnBEYOND</h2>
        <p class="serif" style="font-size: 17px; color: var(--primary); font-style: italic; margin-bottom: 24px;">"Đọc để biết · Chia sẻ để nhớ · Ứng dụng để chuyển hóa"</p>
        <div style="font-size: 56px; margin-bottom: 18px;">✨</div>
        <h3 class="serif" style="font-size: 24px; color: var(--text-primary); margin-bottom: 8px;">Siêu Nhân Loại — Phần 3 & Chương 11</h3>
        <p style="font-size: 17px; color: var(--text-muted); margin-bottom: 22px; font-style: italic;">
          Hồi Sinh Hoàn Trí (tr. 261 – 280)
        </p>
        <div class="evidence-point highlight" style="max-width: 760px; margin: 0 auto 26px auto; font-size: 15px;">
          <em>"Tâm trí không cần bạn sửa chữa hay cải tạo; nó chỉ cần bạn nhận ra bản chất toàn vẹn vốn có. Khi bạn trở về làm nhân chứng tĩnh lặng, tâm trí sẽ tự tìm lại vẻ đẹp hài hòa nguyên thủy."</em>
        </div>
        <div style="display: flex; justify-content: center; gap: 28px; font-size: 14px; color: var(--text-secondary); font-weight: 500;">
          <span>📅 25/10/2026 · Tuần 5</span>
          <span>🏛️ BOOKnBEYOND Book Club</span>
        </div>
      </div>
      <div class="slide-brand">BOOKnBEYOND · METAHUMAN</div>
      <div class="slide-number">12 / 12</div>
    </div>
"""

print("Ch11 slides defined.")

CH12_SLIDES = """
    <!-- SLIDE 1: Cover -->
    <div class="slide active" id="slide-1">
      <div class="slide-inner" style="text-align: center;">
        <div class="m3-chip-bar" style="justify-content: center;">
          <span class="m3-chip m3-chip-tag">TUẦN 5 · PHẦN 3 & CHƯƠNG 12</span>
        </div>
        <h1 class="serif" style="font-size: 46px; font-weight: 800; line-height: 1.18; margin-bottom: 16px; color: var(--text-primary); letter-spacing: -0.5px;">
          Chương 12: Nhận Thức Không Chọn Lựa
        </h1>
        <p class="serif" style="font-size: 22px; color: var(--primary); margin-bottom: 34px; font-style: italic;">
          Choiceless Awareness — Deepak Chopra, M.D.
        </p>
        <div style="display: flex; justify-content: center; gap: 32px; font-size: 15px; color: var(--text-muted); font-weight: 500;">
          <span>📅 Chủ nhật · 25/10/2026</span>
          <span>📖 Phạm vi: tr. 281 – 296 (16 trang)</span>
          <span>🏛️ BOOKnBEYOND Club</span>
        </div>
      </div>
      <div class="slide-brand">BOOKnBEYOND · METAHUMAN</div>
      <div class="slide-number">1 / 12</div>
    </div>

    <!-- SLIDE 2: The Trap of Choosiness -->
    <div class="slide" id="slide-2">
      <div class="slide-inner">
        <div class="m3-chip-bar">
          <span class="m3-chip m3-chip-tag">CĂN NGUYÊN XUNG ĐỘT · BẪY KÉN CHỌN</span>
        </div>
        <h2 class="zen-title serif">Cái Bẫy Của Sự "Kén Chọn" (Thích vs Ghét / Bám Chấp vs Xua Đuổi)</h2>
        <div class="grid-dual">
          <div class="zen-card" style="border-top: 4px solid var(--text-dim);">
            <div class="zen-card-title">1. Vòng Xoáy Thích & Ghét (Raga - Dvesha)</div>
            <p class="zen-card-body">
              Ngay từ thuở nhỏ, tâm trí chúng ta được dạy phải liên tục chia rẽ thực tại:<br>
              • <strong>Bám chấp (Thích):</strong> Cố gắng giữ lại những gì mang lại khoái cảm, thành công, lời khen.<br>
              • <strong>Xua đuổi (Ghét):</strong> Chối từ, sợ hãi và tấn công những gì gây khó chịu hay bất như ý.<br>
              Chính sự kén chọn này dựng nên một bức tường ngăn cách ta với sự thật đang là.<br>
              <small style="color: var(--text-muted); font-style: italic; display: block; margin-top: 10px;">— tr. 281–283</small>
            </p>
          </div>
          <div class="zen-card" style="border-top: 4px solid var(--primary);">
            <div class="zen-card-title" style="color: var(--primary);">2. Bản Ngã Tồn Tại Bằng Phán Xét</div>
            <p class="zen-card-body">
              Bản ngã (Ego) không thể tồn tại trong một không gian tĩnh lặng không phán xét.<br><br>
              Nó cần sự xung đột, cần dán nhãn "đúng - sai", "tốt - xấu", "ta - người" để tự định nghĩa và duy trì quyền kiểm soát giả tạo của mình.<br>
              <small style="color: var(--primary); font-style: italic; display: block; margin-top: 10px;">— tr. 283–284</small>
            </p>
          </div>
        </div>
      </div>
      <div class="slide-brand">BOOKnBEYOND · METAHUMAN</div>
      <div class="slide-number">2 / 12</div>
    </div>

    <!-- SLIDE 3: Nature of Choiceless Awareness -->
    <div class="slide" id="slide-3">
      <div class="slide-inner">
        <div class="m3-chip-bar">
          <span class="m3-chip m3-chip-tag">TRIẾT LÝ CỐT LÕI · J. KRISHNAMURTI & CHOPRA</span>
        </div>
        <h2 class="zen-title serif">Bản Chất Của Nhận Thức Không Chọn Lựa</h2>
        <div class="zen-quote-container">
          <p class="zen-quote-text serif">
            "Nhận thức không chọn lựa (Choiceless Awareness) là trạng thái ý thức trong đó tâm trí quan sát mọi hiện tượng hiển lộ — một suy nghĩ, một cảm xúc, một thanh âm, một cơn đau — mà không hề bóp méo, không phân loại, không tán thành cũng không bài xích. Đó là sự nhận biết thuần khiết tuyệt đối."
          </p>
          <div class="zen-citation">
            — Deepak Chopra, M.D., <em>Siêu Nhân Loại (MetaHuman)</em>, tr. 284–286
          </div>
        </div>
        <div style="margin-top: 20px; display: flex; justify-content: center;">
          <div class="evidence-point highlight" style="max-width: 880px; text-align: center; font-size: 15px;">
            👁️ <strong>Tự do đích thực:</strong> Khi không còn phán xét hay bám giữ, bạn không bị giam hãm trong bất cứ ý niệm nào; nhận thức của bạn trở nên vô biên và tự do.
          </div>
        </div>
      </div>
      <div class="slide-brand">BOOKnBEYOND · METAHUMAN</div>
      <div class="slide-number">3 / 12</div>
    </div>

    <!-- SLIDE 4: Metaphor of the Mirror -->
    <div class="slide" id="slide-4">
      <div class="slide-inner">
        <div class="m3-chip-bar">
          <span class="m3-chip m3-chip-tag">ẨN DỤ NGUYÊN BẢN · TẤM GƯƠNG SÁNG</span>
        </div>
        <h2 class="zen-title serif">Ý Thức Như Một Tấm Gương Soi Thuần Khiết</h2>
        <div class="grid-triple">
          <div class="zen-card">
            <div class="step-number">1</div>
            <div class="zen-card-title" style="margin-top: 10px;">Phản Chiếu Trung Thực</div>
            <p class="zen-card-body">
              Khi một bông hoa hồng kiều diễm đi qua, gương phản chiếu trọn vẹn vẻ đẹp mà không hề mê đắm hay tìm cách giữ lại.<br>
              <small style="color: var(--text-muted); font-style: italic; display: block; margin-top: 8px;">— tr. 286–287</small>
            </p>
          </div>
          <div class="zen-card">
            <div class="step-number">2</div>
            <div class="zen-card-title" style="margin-top: 10px;">Không Hề Cự Tuyệt</div>
            <p class="zen-card-body">
              Khi một đống bùn lầy nhơ nhớp xuất hiện, gương cũng phản chiếu chính xác mà không hề ghê tởm hay quay mặt trốn tránh.<br>
              <small style="color: var(--text-muted); font-style: italic; display: block; margin-top: 8px;">— tr. 287–288</small>
            </p>
          </div>
          <div class="zen-card">
            <div class="step-number">3</div>
            <div class="zen-card-title" style="margin-top: 10px;">Không Lưu Vết Tích</div>
            <p class="zen-card-body">
              Khi cảnh vật rời đi, tấm gương lập tức trống không, tinh khôi và sáng tỏ. Nó không bao giờ bị vấy bẩn bởi bất kỳ hình ảnh nào từng đi qua.<br>
              <small style="color: var(--text-muted); font-style: italic; display: block; margin-top: 8px;">— tr. 288–289</small>
            </p>
          </div>
        </div>
      </div>
      <div class="slide-brand">BOOKnBEYOND · METAHUMAN</div>
      <div class="slide-number">4 / 12</div>
    </div>

    <!-- SLIDE 5: Clarifying the Misconception: Resignation vs Transcendence -->
    <div class="slide" id="slide-5">
      <div class="slide-inner">
        <div class="m3-chip-bar">
          <span class="m3-chip m3-chip-tag">HÓA GIẢI NGỘ NHẬN · CHƯƠNG 12</span>
        </div>
        <h2 class="zen-title serif">Không Chọn Lựa Không Phải Là Thờ Ơ Hay Buông Xuôi Bất Lực</h2>
        <div class="grid-dual">
          <div class="zen-card" style="border-top: 4px solid var(--text-dim);">
            <div class="zen-card-title">❌ Buông Xuôi Bất Lực (Resignation)</div>
            <p class="zen-card-body">
              • Thái độ thụ động, buông xuôi, chịu đựng nghịch cảnh trong cay đắng.<br>
              • Đè nén cảm xúc và cho rằng "mình chẳng thể làm gì được".<br>
              • Vẫn còn cái tôi bất mãn ngầm ẩn bên dưới lớp vỏ thờ ơ.<br>
              <small style="color: var(--text-muted); font-style: italic; display: block; margin-top: 10px;">— tr. 289–290</small>
            </p>
          </div>
          <div class="zen-card" style="border-top: 4px solid var(--primary);">
            <div class="zen-card-title" style="color: var(--primary);">✓ Siêu Việt Thấu Suốt (Transcendence)</div>
            <p class="zen-card-body">
              • Đứng từ cấp độ ý thức toàn thể: Nhận biết trọn vẹn và sáng suốt.<br>
              • Không hao tổn năng lượng vào việc cãi cọ với thực tế đang diễn ra.<br>
              • Tâm trí đạt trạng thái cảnh giác tĩnh lặng (<em>Alert Stillness</em>) với năng lượng nhận thức cao nhất.<br>
              <small style="color: var(--primary); font-style: italic; display: block; margin-top: 10px;">— tr. 290–291</small>
            </p>
          </div>
        </div>
      </div>
      <div class="slide-brand">BOOKnBEYOND · METAHUMAN</div>
      <div class="slide-number">5 / 12</div>
    </div>

    <!-- SLIDE 6: Spontaneous Right Action -->
    <div class="slide" id="slide-6">
      <div class="slide-inner">
        <div class="m3-chip-bar">
          <span class="m3-chip m3-chip-tag">TRỰC GIÁC TỐI THƯỢNG · VÔ VI & HÀNH ĐỘNG</span>
        </div>
        <h2 class="zen-title serif">Hành Động Tự Phát Đúng Đắn (Spontaneous Right Action)</h2>
        <div class="zen-quote-container">
          <p class="zen-quote-text serif">
            "Khi bạn dừng sự kén chọn của bản ngã, bạn không biến thành một pho tượng vô tri; ngược lại, trí tuệ vũ trụ sẽ hành động thông qua bạn. Đó là 'Hành động tự phát đúng đắn' — giải pháp hoàn hảo tự xuất hiện đúng lúc, đúng chỗ mà không cần toan tính căng thẳng."
          </p>
          <div class="zen-citation">
            — Deepak Chopra, M.D., <em>Siêu Nhân Loại (MetaHuman)</em>, tr. 291–293
          </div>
        </div>
        <div style="margin-top: 20px; display: flex; justify-content: center;">
          <div class="evidence-point highlight" style="max-width: 880px; text-align: center; font-size: 15px;">
            ⚡ <strong>Vô Vi (Wu-Wei):</strong> Hành động không gắng gượng. Người nghệ sĩ lớn, vận động viên trong trạng thái Flow, hay người lãnh đạo tỉnh thức đều ra quyết định từ vùng ý thức không chọn lựa này.
          </div>
        </div>
      </div>
      <div class="slide-brand">BOOKnBEYOND · METAHUMAN</div>
      <div class="slide-number">6 / 12</div>
    </div>

    <!-- SLIDE 7: 3 Steps to Practice Choiceless Awareness -->
    <div class="slide" id="slide-7">
      <div class="slide-inner">
        <div class="m3-chip-bar">
          <span class="m3-chip m3-chip-tag">CHƯƠNG 12 · 3 BƯỚC THỰC CHỨNG</span>
        </div>
        <h2 class="zen-title serif">3 Bước Sống Trong Nhận Thức Không Chọn Lựa</h2>
        <div class="grid-triple">
          <div class="zen-card">
            <div class="step-number">1</div>
            <div class="zen-card-title" style="margin-top: 10px;">Mở Rộng Tầm Nhìn</div>
            <p class="zen-card-body">
              Đừng thu hẹp sự chú ý vào một ý nghĩ phán xét hay một cảm giác bực bội.<br><br>
              Mở rộng trường nhận thức để bao trùm toàn bộ không gian xung quanh bạn: âm thanh, ánh sáng, hơi thở.<br>
              <small style="color: var(--text-muted); font-style: italic; display: block; margin-top: 8px;">— tr. 293–294</small>
            </p>
          </div>
          <div class="zen-card">
            <div class="step-number">2</div>
            <div class="zen-card-title" style="margin-top: 10px;">Đón Nhận Trọn Vẹn</div>
            <p class="zen-card-body">
              Cho phép giây phút hiện tại được hiển lộ chính xác như nó đang là.<br><br>
              Nói "Đồng ý" với trải nghiệm bên trong: không cự tuyệt nỗi buồn, không cưỡng ép niềm vui.<br>
              <small style="color: var(--text-muted); font-style: italic; display: block; margin-top: 8px;">— tr. 294–295</small>
            </p>
          </div>
          <div class="zen-card">
            <div class="step-number">3</div>
            <div class="zen-card-title" style="margin-top: 10px;">Hiện Diện Thuần Túy</div>
            <p class="zen-card-body">
              An trú trong vai trò Người Quan Sát Tĩnh Lặng (<em>The Silent Observer</em>).<br><br>
              Nhận ra bạn là Không Gian Chứa Đựng mọi hiện tượng, không phải hiện tượng đang diễn ra.<br>
              <small style="color: var(--text-muted); font-style: italic; display: block; margin-top: 8px;">— tr. 295</small>
            </p>
          </div>
        </div>
      </div>
      <div class="slide-brand">BOOKnBEYOND · METAHUMAN</div>
      <div class="slide-number">7 / 12</div>
    </div>

    <!-- SLIDE 8: Ultimate Freedom -->
    <div class="slide" id="slide-8">
      <div class="slide-inner">
        <div class="m3-chip-bar">
          <span class="m3-chip m3-chip-tag">TỰ DO TỐI THƯỢNG · GIẢI PHÓNG TÂM TRÍ</span>
        </div>
        <h2 class="zen-title serif">Vượt Thoát Con Lắc Nhị Nguyên Của Cuộc Đời</h2>
        <div class="grid-dual">
          <div class="zen-card">
            <div class="zen-card-title">Cơn Ác Mộng Của Con Lắc Nhị Nguyên</div>
            <p class="zen-card-body">
              Khi còn kén chọn, cuộc sống của bạn bị vung lắc dữ dội giữa hai thái cực:<br>
              • Được khen thì hưng phấn ➔ Bị chê thì trầm cảm.<br>
              • Thành công thì tự cao ➔ Thất bại thì sụp đổ.<br>
              Con lắc nhị nguyên biến bạn thành nô lệ của hoàn cảnh bên ngoài và tạo ra stress triền miên.<br>
              <small style="color: var(--text-muted); font-style: italic; display: block; margin-top: 10px;">— tr. 295–296</small>
            </p>
          </div>
          <div class="zen-card">
            <div class="zen-card-title" style="color: var(--primary);">Điểm Tựa Bất Biến Tại Trung Tâm</div>
            <p class="zen-card-body">
              Nhận thức không chọn lựa chính là trục quay đứng yên tại tâm của con lắc.<br><br>
              Bạn quan sát vạn vật xoay vần mà tâm thế vẫn bình thản, tĩnh tại và vững như bàn thạch. Đó là sự tự do tối thượng mà không bất kỳ biến động trần gian nào có thể lay chuyển.<br>
              <small style="color: var(--primary); font-style: italic; display: block; margin-top: 10px;">— tr. 296</small>
            </p>
          </div>
        </div>
      </div>
      <div class="slide-brand">BOOKnBEYOND · METAHUMAN</div>
      <div class="slide-number">8 / 12</div>
    </div>

    <!-- SLIDE 9: Key Takeaways Comparison -->
    <div class="slide" id="slide-9">
      <div class="slide-inner">
        <div class="m3-chip-bar">
          <span class="m3-chip m3-chip-tag">ĐÚC KẾT ĐỐI CHIẾU · CHƯƠNG 12</span>
        </div>
        <h2 class="zen-title serif">Nhận Thức Phân Biệt (Bản Ngã) vs Nhận Thức Không Chọn Lựa</h2>
        <div class="grid-dual">
          <div class="zen-card" style="background: var(--md-sys-color-surface-dim);">
            <div class="zen-card-title" style="color: var(--text-secondary);">Nhận Thức Phân Biệt (Bản Ngã)</div>
            <p class="zen-card-body">
              • Bị giam hãm trong cặp đối đãi Thích / Ghét (Raga - Dvesha).<br>
              • Nhìn thế giới qua lăng kính thành kiến, dán nhãn và phòng thủ.<br>
              • Dao động dữ dội theo khen - chê, thành - bại, được - mất.<br>
              • Tiêu hao năng lượng vì liên tục kháng cự với thực tại.<br>
              <small style="color: var(--text-muted); font-style: italic; display: block; margin-top: 10px;">— tr. 281–288</small>
            </p>
          </div>
          <div class="zen-card" style="background: var(--primary-container); border: 1.5px solid var(--primary-border);">
            <div class="zen-card-title" style="color: var(--primary);">Nhận Thức Không Chọn Lựa (MetaHuman)</div>
            <p class="zen-card-body" style="color: var(--text-primary);">
              • Quan sát vạn vật như tấm gương soi thuần khiết không dính mắc.<br>
              • Nhìn nhận sự thật như chính nó đang là (As it is).<br>
              • An trú tại trung tâm tĩnh lặng vượt trên mọi cặp nhị nguyên.<br>
              • Kích hoạt "Hành động tự phát đúng đắn" từ trí tuệ toàn thể.<br>
              <small style="color: var(--primary); font-style: italic; display: block; margin-top: 10px;">— tr. 289–296</small>
            </p>
          </div>
        </div>
      </div>
      <div class="slide-brand">BOOKnBEYOND · METAHUMAN</div>
      <div class="slide-number">9 / 12</div>
    </div>

    <!-- SLIDE 10: Practical Example (slide-design-rules.md compliant) -->
    <div class="slide" id="slide-10">
      <div class="slide-inner">
        <div class="m3-chip-bar">
          <div class="badge-source badge-example">💡 Minh chứng ứng dụng & Ví dụ thực chứng</div>
        </div>
        <h2 class="zen-title serif">Ứng Dụng Nhận Thức Không Chọn Lựa Trong Thực Tiễn</h2>
        <div class="grid-dual">
          <div class="zen-card">
            <div class="zen-card-title">1. Hóa Giải Xung Đột Quan Điểm Trong Họp Hành</div>
            <p class="zen-card-body">
              Khi đồng nghiệp hoặc đối tác phản bác ý kiến của bạn gay gắt: Theo phản xạ cũ, bản ngã lập tức dựng hàng rào tự vệ hoặc phản công.<br><br>
              <strong>Thực hành:</strong> Hãy lùi lại, đóng vai trò tấm gương soi. Lắng nghe toàn bộ lời nói và cảm xúc của họ mà không dán nhãn "sai/xấu". Khi bạn lắng nghe không phán xét, đối phương sẽ tự hạ khiên chắn và giải pháp chung tự xuất hiện.
            </p>
          </div>
          <div class="zen-card">
            <div class="zen-card-title">2. Đối Diện Nghịch Cảnh Bất Như Ý (Kẹt xe, Mất điện, Hỏng máy)</div>
            <p class="zen-card-body">
              Thay vì chửi thề hay tức tối làm tăng huyết áp và cortisol trong máu.<br><br>
              <strong>Thực hành:</strong> Thừa nhận hiện thực 100%: <em>"Thực tại đang là như thế này."</em> Khi chấm dứt kháng cự, bạn tiết kiệm toàn bộ năng lượng để tận dụng thời gian nghe một bài giảng hữu ích hoặc thư giãn hơi thở.
            </p>
          </div>
        </div>
      </div>
      <div class="slide-brand">BOOKnBEYOND · METAHUMAN</div>
      <div class="slide-number">10 / 12</div>
    </div>

    <!-- SLIDE 11: Expanded Discussion (slide-design-rules.md compliant) -->
    <div class="slide" id="slide-11">
      <div class="slide-inner" style="text-align: center;">
        <div class="m3-chip-bar" style="justify-content: center;">
          <div class="badge-source badge-expand">📌 Mở rộng — câu hỏi chiêm nghiệm cộng đồng</div>
        </div>
        <h2 class="zen-title serif" style="margin-bottom: 26px;">Đối Thoại Phản Biện & Chiêm Nghiệm Chương 12</h2>
        <div class="zen-card" style="max-width: 920px; margin: 0 auto; text-align: left; padding: 30px 40px;">
          <div style="display: flex; gap: 16px; margin-bottom: 16px;">
            <span style="font-size: 22px;">🪞</span>
            <p class="zen-card-body" style="font-size: 15px;">
              Hình ảnh "Tấm gương sáng phản chiếu mà không dính mắc" gợi mở cho bạn điều gì khi nhìn nhận những lời khen và lời chê bai mà người khác dành cho mình?
            </p>
          </div>
          <div style="display: flex; gap: 16px; margin-bottom: 16px;">
            <span style="font-size: 22px;">⚖️</span>
            <p class="zen-card-body" style="font-size: 15px;">
              Làm thế nào để phân biệt rạch ròi giữa <em>"nhận thức không chọn lựa để hành động sáng suốt"</em> với thái độ <em>"thờ ơ, vô cảm, buông xuôi trước cái sai trái"</em> trong đời sống xã hội?
            </p>
          </div>
          <div style="display: flex; gap: 16px;">
            <span style="font-size: 22px;">🎯</span>
            <p class="zen-card-body" style="font-size: 15px;">
              Bạn đã từng trải nghiệm khoảnh khắc nào mà khi buông bỏ toan tính và phân tích quá đà, một quyết định tự phát xuất thần đã xuất hiện và mang lại kết quả kỳ diệu?
            </p>
          </div>
        </div>
      </div>
      <div class="slide-brand">BOOKnBEYOND · METAHUMAN</div>
      <div class="slide-number">11 / 12</div>
    </div>

    <!-- SLIDE 12: Closing Summary -->
    <div class="slide" id="slide-12">
      <div class="slide-inner" style="text-align: center;">
        <h2 class="serif" style="font-size: 42px; font-weight: 900; color: var(--text-primary); margin-bottom: 12px;">BOOKnBEYOND</h2>
        <p class="serif" style="font-size: 17px; color: var(--primary); font-style: italic; margin-bottom: 24px;">"Đọc để biết · Chia sẻ để nhớ · Ứng dụng để chuyển hóa"</p>
        <div style="font-size: 56px; margin-bottom: 18px;">🪷</div>
        <h3 class="serif" style="font-size: 24px; color: var(--text-primary); margin-bottom: 8px;">Siêu Nhân Loại — Phần 3 & Chương 12</h3>
        <p style="font-size: 17px; color: var(--text-muted); margin-bottom: 22px; font-style: italic;">
          Nhận Thức Không Chọn Lựa (tr. 281 – 296)
        </p>
        <div class="evidence-point highlight" style="max-width: 760px; margin: 0 auto 26px auto; font-size: 15px;">
          <em>"Khi bạn không còn chọn lựa giữa thích và ghét, bạn không đánh mất quyền tự do; bạn chính thức bước vào sự Tự Do Tuyệt Đối — nơi mọi khoảnh khắc đều tràn ngập vẻ đẹp và sự bình an vô tận."</em>
        </div>
        <div style="display: flex; justify-content: center; gap: 28px; font-size: 14px; color: var(--text-secondary); font-weight: 500;">
          <span>📅 25/10/2026 · Tuần 5</span>
          <span>🏛️ BOOKnBEYOND Book Club</span>
        </div>
      </div>
      <div class="slide-brand">BOOKnBEYOND · METAHUMAN</div>
      <div class="slide-number">12 / 12</div>
    </div>
"""

print("Ch12 slides defined.")

CH13_SLIDES = """
    <!-- SLIDE 1: Cover -->
    <div class="slide active" id="slide-1">
      <div class="slide-inner" style="text-align: center;">
        <div class="m3-chip-bar" style="justify-content: center;">
          <span class="m3-chip m3-chip-tag">TUẦN 5 · PHẦN 3 & CHƯƠNG 13</span>
        </div>
        <h1 class="serif" style="font-size: 46px; font-weight: 800; line-height: 1.18; margin-bottom: 16px; color: var(--text-primary); letter-spacing: -0.5px;">
          Chương 13: Một Cuộc Đời
        </h1>
        <p class="serif" style="font-size: 22px; color: var(--primary); margin-bottom: 34px; font-style: italic;">
          One Life & The Unified Field — Deepak Chopra, M.D.
        </p>
        <div style="display: flex; justify-content: center; gap: 32px; font-size: 15px; color: var(--text-muted); font-weight: 500;">
          <span>📅 Chủ nhật · 25/10/2026</span>
          <span>📖 Phạm vi: tr. 297 – 312 (16 trang)</span>
          <span>🏛️ BOOKnBEYOND Club</span>
        </div>
      </div>
      <div class="slide-brand">BOOKnBEYOND · METAHUMAN</div>
      <div class="slide-number">1 / 12</div>
    </div>

    <!-- SLIDE 2: Foundational Premise: One Life -->
    <div class="slide" id="slide-2">
      <div class="slide-inner">
        <div class="m3-chip-bar">
          <span class="m3-chip m3-chip-tag">ĐỊNH ĐỀ NỀN TẢNG · THỰC TẠI DUY NHẤT</span>
        </div>
        <h2 class="zen-title serif">Toàn Bộ Vũ Trụ Chỉ Là MỘT CUỘC ĐỜI Duy Nhất Đang Vận Hành</h2>
        <div class="zen-quote-container">
          <p class="zen-quote-text serif">
            "Không hề có hàng tỷ cuộc đời riêng rẽ đang đấu tranh sinh tồn; chỉ có duy nhất MỘT CUỘC ĐỜI (One Life) đang thở, đang biểu hiện và trải nghiệm thông qua muôn vàn hình hài. Sự phân cách giữa bạn và người khác, giữa con người và thiên nhiên chỉ là ảo ảnh thị giác do tâm trí dựng nên."
          </p>
          <div class="zen-citation">
            — Deepak Chopra, M.D., <em>Siêu Nhân Loại (MetaHuman)</em>, tr. 297–299
          </div>
        </div>
        <div style="margin-top: 20px; display: flex; justify-content: center;">
          <div class="evidence-point highlight" style="max-width: 880px; text-align: center; font-size: 15px;">
            🌊 <strong>Ẩn dụ đại dương & ngọn sóng:</strong> Mỗi cá nhân là một ngọn sóng nhấp nhô trên mặt biển. Sóng có thể có kích thước, hình thù khác nhau, nhưng bản chất của mọi ngọn sóng đều là nước đại dương.
          </div>
        </div>
      </div>
      <div class="slide-brand">BOOKnBEYOND · METAHUMAN</div>
      <div class="slide-number">2 / 12</div>
    </div>

    <!-- SLIDE 3: The Illusion of Compartmentalized Life -->
    <div class="slide" id="slide-3">
      <div class="slide-inner">
        <div class="m3-chip-bar">
          <span class="m3-chip m3-chip-tag">ẢO TƯỞNG HIỆN ĐẠI · CÁC NGĂN KÉO CUỘC SỐNG</span>
        </div>
        <h2 class="zen-title serif">Căn Nguyên Kiệt Sức: Chia Cắt Đời Sống Thành Các Ngăn Kéo</h2>
        <div class="grid-dual">
          <div class="zen-card" style="border-top: 4px solid var(--text-dim);">
            <div class="zen-card-title">1. Phân Mảnh Đời Sống Hiện Đại</div>
            <p class="zen-card-body">
              Xã hội dạy ta đóng khung cuộc đời thành các ngăn kéo riêng biệt:<br>
              • Ngăn kéo công việc & sự nghiệp.<br>
              • Ngăn kéo gia đình & tình cảm.<br>
              • Ngăn kéo tâm linh & ngày cuối tuần.<br>
              Chúng ta phải liên tục đổi vai diễn, đeo mặt nạ khác nhau và luôn cảm thấy thiếu hụt thời gian.<br>
              <small style="color: var(--text-muted); font-style: italic; display: block; margin-top: 10px;">— tr. 299–301</small>
            </p>
          </div>
          <div class="zen-card" style="border-top: 4px solid var(--primary);">
            <div class="zen-card-title" style="color: var(--primary);">2. Hậu Quả: Sự Xé Rách Nội Tâm</div>
            <p class="zen-card-body">
              Khi cuộc sống bị chia cắt, bạn luôn sống trong trạng thái xung đột:<br><br>
              Làm việc thì cảm thấy có lỗi với gia đình; ở bên gia đình thì lo lắng về công việc; tìm đến tâm linh như một liều thuốc giảm đau tạm bợ. Chopra khẳng định: <em>Chỉ có sự hợp nhất toàn vẹn mới mang lại an lạc đích thực</em>.<br>
              <small style="color: var(--primary); font-style: italic; display: block; margin-top: 10px;">— tr. 301–302</small>
            </p>
          </div>
        </div>
      </div>
      <div class="slide-brand">BOOKnBEYOND · METAHUMAN</div>
      <div class="slide-number">3 / 12</div>
    </div>

    <!-- SLIDE 4: The Nature of Life: You Are the Cosmos -->
    <div class="slide" id="slide-4">
      <div class="slide-inner">
        <div class="m3-chip-bar">
          <span class="m3-chip m3-chip-tag">CHƯƠNG 13 · BẢN CHẤT SỰ SỐNG</span>
        </div>
        <h2 class="zen-title serif">Bạn Chính Là Vũ Trụ Đang Biểu Hiện Qua Một Điểm Nhận Thức</h2>
        <div class="grid-triple">
          <div class="zen-card">
            <div class="step-number">1</div>
            <div class="zen-card-title" style="margin-top: 10px;">Không Phải Kẻ Tách Rời</div>
            <p class="zen-card-body">
              Bạn không phải là một sinh vật bất hạnh bị ném vào vũ trụ lạnh lẽo và xa lạ.<br><br>
              Vũ trụ sinh ra bạn hệt như cây táo nở ra những trái táo ngọt lành.<br>
              <small style="color: var(--text-muted); font-style: italic; display: block; margin-top: 8px;">— tr. 302–303</small>
            </p>
          </div>
          <div class="zen-card">
            <div class="step-number">2</div>
            <div class="zen-card-title" style="margin-top: 10px;">Dòng Chảy Liên Tục</div>
            <p class="zen-card-body">
              Hơi thở của cây xanh là oxy của bạn; carbon trong cơ thể bạn từng là bụi của các vì sao xa xưa.<br><br>
              Mọi tế bào của bạn đang trao đổi thông tin không ngừng với toàn thể vũ trụ.<br>
              <small style="color: var(--text-muted); font-style: italic; display: block; margin-top: 8px;">— tr. 303–304</small>
            </p>
          </div>
          <div class="zen-card">
            <div class="step-number">3</div>
            <div class="zen-card-title" style="margin-top: 10px;">Điểm Hội Tụ Vô Biên</div>
            <p class="zen-card-body">
              Bạn là điểm hội tụ độc nhất vô nhị mà tại đó Vũ Trụ đang nhìn ngắm chính mình, cảm nhận chính mình và sáng tạo thông qua bạn.<br>
              <small style="color: var(--text-muted); font-style: italic; display: block; margin-top: 8px;">— tr. 304–305</small>
            </p>
          </div>
        </div>
      </div>
      <div class="slide-brand">BOOKnBEYOND · METAHUMAN</div>
      <div class="slide-number">4 / 12</div>
    </div>

    <!-- SLIDE 5: Dissolving the Greatest Fear: Life and Death -->
    <div class="slide" id="slide-5">
      <div class="slide-inner">
        <div class="m3-chip-bar">
          <span class="m3-chip m3-chip-tag">HÓA GIẢI NỖI SỢ LỚN NHẤT · SINH & TỬ</span>
        </div>
        <h2 class="zen-title serif">Sinh Và Tử Chỉ Là Hai Nhịp Thở Của Ý Thức Bất Diệt</h2>
        <div class="zen-quote-container">
          <p class="zen-quote-text serif">
            "Sự sống không có sự đối lập; sự đối lập của cái chết là sự sinh ra, chứ không phải sự sống. Sự sống là vĩnh cửu. Sinh và tử chỉ là hai cánh cổng trên cùng một con đường, hai nhịp thở vào và thở ra của Ý Thức Thuần Túy trong vũ điệu sáng tạo vô tận."
          </p>
          <div class="zen-citation">
            — Deepak Chopra, M.D., <em>Siêu Nhân Loại (MetaHuman)</em>, tr. 305–307
          </div>
        </div>
        <div style="margin-top: 20px; display: flex; justify-content: center;">
          <div class="evidence-point highlight" style="max-width: 880px; text-align: center; font-size: 15px;">
            🌟 <strong>Giải thoát nỗi sợ sinh tử:</strong> Khi nhận ra bạn chính là Ý Thức chứ không phải thể xác tạm thời, cái chết mất đi nanh vuốt đe dọa. Bạn an nhiên bước đi trong dòng chảy vĩnh hằng.
          </div>
        </div>
      </div>
      <div class="slide-brand">BOOKnBEYOND · METAHUMAN</div>
      <div class="slide-number">5 / 12</div>
    </div>

    <!-- SLIDE 6: Unity Consciousness: Tat Tvam Asi -->
    <div class="slide" id="slide-6">
      <div class="slide-inner">
        <div class="m3-chip-bar">
          <span class="m3-chip m3-chip-tag">Ý THỨC NHẤT THỂ · TAT TVAM ASI</span>
        </div>
        <h2 class="zen-title serif">Chân Lý "Tat Tvam Asi" — Bạn Chính Là Điều Đó</h2>
        <div class="grid-dual">
          <div class="zen-card">
            <div class="zen-card-title">Sự Hợp Nhất Tam Giác Nhận Thức</div>
            <p class="zen-card-body">
              Trong trạng thái nhị nguyên bình thường:<br>
              • Người quan sát (Chủ thể).<br>
              • Đối tượng được quan sát (Khách thể).<br>
              • Tiến trình quan sát (Hành động).<br>
              Ba yếu tố này bị coi là tách rời nhau. Nhưng ở đỉnh cao MetaHuman, cả ba hòa làm một: <em>Chỉ có sự nhận biết thuần túy đang tự trải nghiệm chính nó</em>.<br>
              <small style="color: var(--text-muted); font-style: italic; display: block; margin-top: 10px;">— tr. 307–308</small>
            </p>
          </div>
          <div class="zen-card">
            <div class="zen-card-title" style="color: var(--primary);">Không Có Ai Đứng Bên Ngoài</div>
            <p class="zen-card-body">
              Khi nhìn vào mắt một người lạ, một con thú hay một cành cây, bạn nhận ra tia sáng nhận thức nhìn từ bên trong họ cũng chính là tia sáng đang nhìn từ bên trong bạn.<br><br>
              <em>"Tat Tvam Asi"</em> — Bạn chính là thực tại ấy. Sự cô đơn vĩnh viễn biến mất.<br>
              <small style="color: var(--primary); font-style: italic; display: block; margin-top: 10px;">— tr. 308–309</small>
            </p>
          </div>
        </div>
      </div>
      <div class="slide-brand">BOOKnBEYOND · METAHUMAN</div>
      <div class="slide-number">6 / 12</div>
    </div>

    <!-- SLIDE 7: Compassion as Fabric of Reality -->
    <div class="slide" id="slide-7">
      <div class="slide-inner">
        <div class="m3-chip-bar">
          <span class="m3-chip m3-chip-tag">CHƯƠNG 13 · LÒNG TRẮC ẨN TỰ NHIÊN</span>
        </div>
        <h2 class="zen-title serif">Tình Yêu Thương & Lòng Từ Bi Là Bản Tính Của Vũ Trụ</h2>
        <div class="grid-dual">
          <div class="zen-card" style="border-top: 4px solid var(--text-dim);">
            <div class="zen-card-title">❌ Từ Bi Như Một Bổn Phận Gượng Ép</div>
            <p class="zen-card-body">
              Khi còn trong ý thức nhị nguyên, con người cố gắng yêu thương vì những tín điều đạo đức hay sợ bị trừng phạt.<br><br>
              Sự "tử tế gượng ép" này nhanh chóng cạn kiệt khi gặp va chạm lợi ích hoặc khi bản ngã cảm thấy bị tổn thương.<br>
              <small style="color: var(--text-muted); font-style: italic; display: block; margin-top: 10px;">— tr. 309</small>
            </p>
          </div>
          <div class="zen-card" style="border-top: 4px solid var(--primary);">
            <div class="zen-card-title" style="color: var(--primary);">✓ Lòng Từ Bi Tự Nhiên Của Người MetaHuman</div>
            <p class="zen-card-body">
              Khi nhận ra chỉ có Một Cuộc Đời, làm tổn thương người khác chính là tự làm tổn thương chính mình.<br><br>
              Lòng trắc ẩn trở thành bản năng tự nhiên như tay phải tự động lau vết thương cho tay trái mà không đòi hỏi đền đáp hay cảm ơn.<br>
              <small style="color: var(--primary); font-style: italic; display: block; margin-top: 10px;">— tr. 309–310</small>
            </p>
          </div>
        </div>
      </div>
      <div class="slide-brand">BOOKnBEYOND · METAHUMAN</div>
      <div class="slide-number">7 / 12</div>
    </div>

    <!-- SLIDE 8: The Unified Life of a MetaHuman -->
    <div class="slide" id="slide-8">
      <div class="slide-inner">
        <div class="m3-chip-bar">
          <span class="m3-chip m3-chip-tag">ĐỈNH CAO PHẦN 3 · ĐỜI SỐNG HỢP NHẤT</span>
        </div>
        <h2 class="zen-title serif">Sống Trọn Vẹn Trong Dòng Chảy Nhất Thể Vô Tận</h2>
        <div class="grid-dual">
          <div class="zen-card">
            <div class="zen-card-title">Bình An Tuyệt Đối Giữa Biến Động</div>
            <p class="zen-card-body">
              Người MetaHuman không trốn chạy lên núi cao hay ẩn dật khỏi thế giới. Họ bước đi giữa dòng đời bận rộn với một tâm thế hợp nhất.<br><br>
              Mỗi hành động nấu ăn, làm việc, ký hợp đồng hay dạo phố đều được thẩm thấu bởi sự hiện diện thiêng liêng của Một Cuộc Đời.<br>
              <small style="color: var(--text-muted); font-style: italic; display: block; margin-top: 10px;">— tr. 310–311</small>
            </p>
          </div>
          <div class="zen-card">
            <div class="zen-card-title" style="color: var(--primary);">Tiềm Năng Sáng Tạo Vô Hạn</div>
            <p class="zen-card-body">
              Khi cái tôi buông bỏ hoàn toàn sự kiểm soát hẹp hòi, toàn bộ sức mạnh và trí tuệ của Vũ Trụ tự do chảy qua bạn.<br><br>
              Bạn không còn phải gắng gượng "làm việc vất vả" để thành công; bạn trở thành đồng sáng tạo cùng nguồn lực vô tận của sự sống.<br>
              <small style="color: var(--primary); font-style: italic; display: block; margin-top: 10px;">— tr. 311–312</small>
            </p>
          </div>
        </div>
      </div>
      <div class="slide-brand">BOOKnBEYOND · METAHUMAN</div>
      <div class="slide-number">8 / 12</div>
    </div>

    <!-- SLIDE 9: Key Takeaways Comparison -->
    <div class="slide" id="slide-9">
      <div class="slide-inner">
        <div class="m3-chip-bar">
          <span class="m3-chip m3-chip-tag">ĐÚC KẾT ĐỐI CHIẾU · CHƯƠNG 13</span>
        </div>
        <h2 class="zen-title serif">Đời Sống Phân Mảnh (Bản Ngã) vs Một Cuộc Đời Nhất Thể</h2>
        <div class="grid-dual">
          <div class="zen-card" style="background: var(--md-sys-color-surface-dim);">
            <div class="zen-card-title" style="color: var(--text-secondary);">Đời Sống Phân Mảnh (Bản Ngã)</div>
            <p class="zen-card-body">
              • Chia rẽ cuộc sống thành các ngăn kéo: việc làm, gia đình, tâm linh.<br>
              • Cảm giác cô độc, lạc lõng trong một vũ trụ lạnh lẽo và cạnh tranh.<br>
              • Nỗi ám ảnh kinh hoàng về cái chết và sự biến mất hoàn toàn.<br>
              • Lòng tốt gượng ép dựa trên nghĩa vụ đạo đức và tính toán.<br>
              <small style="color: var(--text-muted); font-style: italic; display: block; margin-top: 10px;">— tr. 297–304</small>
            </p>
          </div>
          <div class="zen-card" style="background: var(--primary-container); border: 1.5px solid var(--primary-border);">
            <div class="zen-card-title" style="color: var(--primary);">Một Cuộc Đời Nhất Thể (MetaHuman)</div>
            <p class="zen-card-body" style="color: var(--text-primary);">
              • Hợp nhất toàn diện: Mọi khoảnh khắc đều là biểu hiện thiêng liêng.<br>
              • Nhận ra mình chính là Vũ Trụ đang biểu hiện qua một góc nhìn độc nhất.<br>
              • Thấu suốt sinh tử chỉ là hai nhịp thở của Ý Thức bất diệt.<br>
              • Lòng từ bi tự nhiên tuôn trào vì tha nhân chính là bản thể mình.<br>
              <small style="color: var(--primary); font-style: italic; display: block; margin-top: 10px;">— tr. 305–312</small>
            </p>
          </div>
        </div>
      </div>
      <div class="slide-brand">BOOKnBEYOND · METAHUMAN</div>
      <div class="slide-number">9 / 12</div>
    </div>

    <!-- SLIDE 10: Practical Example (slide-design-rules.md compliant) -->
    <div class="slide" id="slide-10">
      <div class="slide-inner">
        <div class="m3-chip-bar">
          <div class="badge-source badge-example">💡 Minh chứng ứng dụng & Ví dụ thực chứng</div>
        </div>
        <h2 class="zen-title serif">Ứng Dụng Sống Một Cuộc Đời Hợp Nhất Trong Thực Tế</h2>
        <div class="grid-dual">
          <div class="zen-card">
            <div class="zen-card-title">1. Hợp Nhất Công Việc & Lý Tưởng (Work-Life Wholeness)</div>
            <p class="zen-card-body">
              Thay vì theo đuổi sự cân bằng giả tạo (<em>Work-Life Balance</em>) bằng cách chia rẽ thời gian và năng lượng.<br><br>
              <strong>Thực hành:</strong> Xem công việc như một sân chơi để thể hiện tình yêu thương, sự phụng sự và sáng tạo của ý thức. Khi bạn mang năng lượng bình an và trọn vẹn vào từng email, từng dòng code hay cuộc trò chuyện, ranh giới mệt mỏi giữa công việc và đời sống tự biến mất.
            </p>
          </div>
          <div class="zen-card">
            <div class="zen-card-title">2. Đối Xử Với Tha Nhân Qua Cái Nhìn "Tat Tvam Asi"</div>
            <p class="zen-card-body">
              Khi gặp người khó chịu, bực bội hay có quan điểm trái ngược trong gia đình hoặc công sở.<br><br>
              <strong>Thực hành:</strong> Tự nhắc nhở bản thân: <em>"Người này chính là một biểu hiện khác của Sự Sống Nhất Thể đang trải nghiệm sự đau khổ."</em> Năng lượng từ bi tự nhiên sẽ thế chỗ cho sự phán xét, chuyển hóa quan hệ xung đột thành sự thấu hiểu sâu sắc.
            </p>
          </div>
        </div>
      </div>
      <div class="slide-brand">BOOKnBEYOND · METAHUMAN</div>
      <div class="slide-number">10 / 12</div>
    </div>

    <!-- SLIDE 11: Expanded Discussion (slide-design-rules.md compliant) -->
    <div class="slide" id="slide-11">
      <div class="slide-inner" style="text-align: center;">
        <div class="m3-chip-bar" style="justify-content: center;">
          <div class="badge-source badge-expand">📌 Mở rộng — câu hỏi chiêm nghiệm cộng đồng</div>
        </div>
        <h2 class="zen-title serif" style="margin-bottom: 26px;">Đối Thoại Phản Biện Hoàn Thành Phần 3 (Chương 10, 11, 12, 13)</h2>
        <div class="zen-card" style="max-width: 920px; margin: 0 auto; text-align: left; padding: 30px 40px;">
          <div style="display: flex; gap: 16px; margin-bottom: 16px;">
            <span style="font-size: 22px;">🌌</span>
            <p class="zen-card-body" style="font-size: 15px;">
              Khi bạn nhận thức sâu sắc rằng <em>"Toàn bộ vũ trụ chỉ có duy nhất Một Cuộc Đời đang vận hành"</em>, những nỗi lo lắng về địa vị cá nhân, sự cạnh tranh hay sự so sánh giàu nghèo thay đổi như thế nào?
            </p>
          </div>
          <div style="display: flex; gap: 16px; margin-bottom: 16px;">
            <span style="font-size: 22px;">🚪</span>
            <p class="zen-card-body" style="font-size: 15px;">
              Góc nhìn <em>"Sinh và tử chỉ là hai nhịp thở của Ý Thức bất diệt"</em> mang lại cho bạn sự an ủi hay lòng dũng cảm ra sao khi đối diện với sự vô thường và những mất mát trong cuộc sống?
            </p>
          </div>
          <div style="display: flex; gap: 16px;">
            <span style="font-size: 22px;">🏆</span>
            <p class="zen-card-body" style="font-size: 15px;">
              Khép lại Phần 3 ("Trở thành siêu nhân: Giải phóng cơ thể, Hồi sinh hoàn trí, Nhận thức không chọn lựa, Một cuộc đời"), điều tâm đắc nhất bạn sẽ bắt tay vào thực hành ngay trong tuần này là gì?
            </p>
          </div>
        </div>
      </div>
      <div class="slide-brand">BOOKnBEYOND · METAHUMAN</div>
      <div class="slide-number">11 / 12</div>
    </div>

    <!-- SLIDE 12: Closing Summary -->
    <div class="slide" id="slide-12">
      <div class="slide-inner" style="text-align: center;">
        <h2 class="serif" style="font-size: 42px; font-weight: 900; color: var(--text-primary); margin-bottom: 12px;">BOOKnBEYOND</h2>
        <p class="serif" style="font-size: 17px; color: var(--primary); font-style: italic; margin-bottom: 24px;">"Đọc để biết · Chia sẻ để nhớ · Ứng dụng để chuyển hóa"</p>
        <div style="font-size: 56px; margin-bottom: 18px;">🌌</div>
        <h3 class="serif" style="font-size: 24px; color: var(--text-primary); margin-bottom: 8px;">Siêu Nhân Loại — Hoàn Thành Phần 3 & Chương 13</h3>
        <p style="font-size: 17px; color: var(--text-muted); margin-bottom: 22px; font-style: italic;">
          Một Cuộc Đời — The Unified Life (tr. 297 – 312)
        </p>
        <div class="evidence-point highlight" style="max-width: 760px; margin: 0 auto 26px auto; font-size: 15px;">
          <em>"Chỉ có Một Cuộc Đời duy nhất đang vận hành trong toàn thể vũ trụ. Khi bạn nhận ra sự thật ấy, bạn bước ra khỏi giấc mơ phân mảnh và chính thức trở thành Siêu Nhân Loại — sống trong phúc lạc và tự do vô bờ bến."</em>
        </div>
        <div style="display: flex; justify-content: center; gap: 28px; font-size: 14px; color: var(--text-secondary); font-weight: 500;">
          <span>📅 25/10/2026 · Tuần 5</span>
          <span>🏛️ BOOKnBEYOND Book Club</span>
        </div>
      </div>
      <div class="slide-brand">BOOKnBEYOND · METAHUMAN</div>
      <div class="slide-number">12 / 12</div>
    </div>
"""

print("Ch13 slides defined.")

import re
from html.parser import HTMLParser

class SimpleHTMLValidator(HTMLParser):
    def __init__(self):
        super().__init__()
        self.tags = []
        self.errors = []
        self.slides_count = 0
    def handle_starttag(self, tag, attrs):
        self.tags.append(tag)
        attrs_dict = dict(attrs)
        if tag == 'div' and 'slide' in attrs_dict.get('class', '').split():
            self.slides_count += 1
    def handle_endtag(self, tag):
        pass

configs = [
    {
        "filename": "slides-metahuman-ch11.html",
        "title": "MetaHuman · Chương 11 — Hồi sinh hoàn trí",
        "slides_html": CH11_SLIDES
    },
    {
        "filename": "slides-metahuman-ch12.html",
        "title": "MetaHuman · Chương 12 — Nhận thức không chọn lựa",
        "slides_html": CH12_SLIDES
    },
    {
        "filename": "slides-metahuman-ch13.html",
        "title": "MetaHuman · Chương 13 — Một cuộc đời",
        "slides_html": CH13_SLIDES
    }
]

base_dir = os.path.dirname(os.path.abspath(__file__))

for cfg in configs:
    full_html = HEAD_TEMPLATE.format(title=cfg["title"]) + cfg["slides_html"] + FOOTER_TEMPLATE
    out_path = os.path.join(base_dir, cfg["filename"])
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(full_html)
    
    # Validate
    val = SimpleHTMLValidator()
    val.feed(full_html)
    slide_numbers = re.findall(r'<div class="slide-number">(\d+)\s*/\s*(\d+)</div>', full_html)
    print(f"Generated {cfg['filename']}:")
    print(f"  - Total slides count: {val.slides_count}")
    print(f"  - Slide numbers found: {len(slide_numbers)} ({slide_numbers[0] if slide_numbers else None} to {slide_numbers[-1] if slide_numbers else None})")
    assert val.slides_count == 12, f"Expected 12 slides, got {val.slides_count}"
    assert len(slide_numbers) == 12, f"Expected 12 slide numbers, got {len(slide_numbers)}"
    for idx, (curr, tot) in enumerate(slide_numbers, 1):
        assert int(curr) == idx and int(tot) == 12, f"Slide number mismatch at {idx}: {curr}/{tot}"

print("All 3 slide files generated and validated successfully!")
