#!/bin/bash
# ==============================================
# CTO Brain 🎩 — BooknBeyond Rebrand + Schedule Update
# Tuần 2 — 22/03/2026
# ==============================================

PROJECT_DIR="/Users/mac/Documents/Sách/book-club"
cd "$PROJECT_DIR" || exit 1

claude --dangerously-skip-permissions -p "
Bạn là CTO 🎩 của BooknBeyond — CLB đọc sách.

DỰ ÁN: $PROJECT_DIR
LIVE URL: https://book-and-beyond.pages.dev
GITHUB: https://github.com/huuthongdongthap/BOOKnBEYOND.git

=== NHIỆM VỤ (theo thứ tự) ===

## 1. REBRAND: Book & Beyond → BooknBeyond

Đổi tên thương hiệu trên TOÀN BỘ project:

### index.html:
- Dòng 6: <title>Book & Beyond — CLB Đọc Sách</title> → <title>BooknBeyond — CLB Đọc Sách</title>
- Dòng 9: og:title → BooknBeyond — CLB Đọc Sách
- Dòng 25: alt='Book & Beyond' → alt='BooknBeyond'
- Dòng 26: <span>Book & Beyond</span> → <span>BooknBeyond</span>
- Dòng 48: <h1>Book & Beyond</h1> → <h1>BooknBeyond</h1>
- Dòng 270: footer text → BooknBeyond
- Kiểm tra script.js nếu có reference đến clubName

### style.css:
- Dòng 1-2: Comment header → BooknBeyond

### poster-week1.html:
- Đã đổi thành 'Nhóm Chính Bắc' rồi, KHÔNG cần sửa

## 2. DATA ĐÃ CẬP NHẬT (config.json)

File data/config.json ĐÃ ĐƯỢC CẬP NHẬT SẴN với:
- clubName: 'BooknBeyond'
- meetLink: 'https://meet.google.com/onb-gepu-owa' (link mới tuần 2)
- Lịch tuần 2: MC GiangLe, sharers: Ms Giang (Ch3), Bảo (Ch4), Lương (NL4+5+6)
- Lịch tuần 4: Thanh (NL1, NL2), GiangLe (NL10), Bảo (NL11+12)
- Đã xóa tuần 5 (gộp vào tuần 4)

KHÔNG SỬA config.json — chỉ đọc để hiểu data.

## 3. KIỂM TRA script.js

Đảm bảo script.js render đúng data mới:
- clubName hiển thị 'BooknBeyond' 
- meetLink dùng link mới
- Schedule tuần 2 hiện đúng sharers mới
- Tuần 5 đã bị xóa, chỉ còn 4 tuần + Review

## 4. TEST LOCAL

python3 -m http.server 8090 &
Mở http://localhost:8090 và kiểm tra:
- Navbar logo: BooknBeyond ✓
- Hero title: BooknBeyond ✓
- Meet link: onb-gepu-owa ✓
- Lịch tuần 2: Ms Giang, Bảo, Lương ✓
- Footer: BooknBeyond ✓

## 5. DEPLOY

git add -A
git commit -m '🔄 Rebrand BooknBeyond + Schedule Week 2 + Meet link update'
git push origin main
npx wrangler pages deploy . --project-name=book-and-beyond --commit-dirty=true

LƯU Ý:
- KHÔNG sửa config.json
- KHÔNG thay layout/CSS structure
- CHỈ sửa brand name và verify
- Test trước khi deploy
"
