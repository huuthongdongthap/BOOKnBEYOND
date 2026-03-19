#!/bin/bash
# ==============================================
# CTO Brain 🎩 — Book & Beyond UI Enhancement
# ==============================================

PROJECT_DIR="/Users/mac/Documents/Sách/book-club"

cd "$PROJECT_DIR" || exit 1

claude --dangerously-skip-permissions -p "
Bạn là CTO 🎩 của Book & Beyond — một CLB đọc sách.

DỰ ÁN: $PROJECT_DIR
LIVE URL: https://book-and-beyond.pages.dev
GITHUB: https://github.com/huuthongdongthap/BOOKnBEYOND.git
TECH: Static site (HTML + CSS + JS + JSON) — KHÔNG dùng framework. Mobile-first dark theme.

FILES CHÍNH:
- index.html — Trang web chính
- style.css — Toàn bộ CSS (1066 dòng, dark theme navy + gold accent #f59e0b)
- script.js — Logic: countdown, đọc JSON, render sections
- data/config.json — Dữ liệu động (sách, lịch, thành viên, quỹ...)
- poster-week1.html — Poster kickoff tuần 1

NHIỆM VỤ: Deep UI Improvement — nâng cấp toàn diện giao diện web

1. ANIMATIONS & MICRO-INTERACTIONS:
   - Thêm scroll animations (fade-in, slide-up) cho các section khi scroll vào viewport
   - Hover effects trên cards (scale, glow, border highlight)
   - Smooth transitions trên navbar khi scroll
   - Countdown timer có hiệu ứng flip/slide khi số thay đổi
   - Loading skeleton khi fetch data

2. VISUAL POLISH:
   - Gradient backgrounds tinh tế hơn cho sections
   - Glass morphism cho cards (backdrop-filter: blur)
   - Subtle particle/star effect ở hero section
   - Progress bar cho sách có animation fill
   - Avatar/icon cho thành viên trong bảng xếp hạng
   - Section dividers có gradient lines đẹp hơn

3. TYPOGRAPHY & SPACING:
   - Review font sizes, line-heights cho optimal readability
   - Đảm bảo heading hierarchy nhất quán
   - Spacing/padding giữa các sections cân đối

4. MOBILE UX:
   - Pull-to-refresh cảm giác native
   - Bottom sheet menu thay vì sidebar
   - Touch-friendly button sizes (min 44px)
   - Swipe gestures cho schedule cards

5. SEO & PERFORMANCE:
   - Lazy loading cho images
   - Preload critical fonts
   - Add structured data (JSON-LD)
   - Optimize SVG inline icons

6. DEPLOY SAU KHI XON:
   - git add -A && git commit -m '🎨 UI Enhancement: animations, glass morphism, micro-interactions'
   - git push origin main
   - npx wrangler pages deploy . --project-name=book-and-beyond

LƯU Ý QUAN TRỌNG:
- GIỮ NGUYÊN dark theme (navy #0a0e17 + gold #f59e0b)
- GIỮ NGUYÊN data flow từ config.json
- KHÔNG thay đổi cấu trúc HTML sections
- KHÔNG dùng framework/library ngoài (vanilla JS only)
- CSS animations dùng @keyframes + IntersectionObserver
- Test trên cả desktop (1400px) và mobile (390px) trước khi deploy
- Mở python3 -m http.server 8090 để test local

Hãy bắt đầu từ style.css, rồi script.js, cuối cùng test + deploy.
"
