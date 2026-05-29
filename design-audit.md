# BÁO CÁO KIỂM THỬ GIAO DIỆN (UI/UX DESIGN AUDIT) — BOOKnBEYOND

**Dự án:** BOOKnBEYOND Web Hub & Slides / Posters System  
**Phiên bản:** v2.0  
**Tác giả:** Hệ thống Đánh giá Tự động (Project Orchestrator)  
**Ngày thực hiện:** 29/05/2026  

---

## 1. TỔNG QUAN HỆ THỐNG GIAO DIỆN
BOOKnBEYOND sở hữu một hệ thống giao diện tinh tế, đồng nhất và chuyên nghiệp dựa trên phong cách **"Luxury Sage"** kết hợp với trường phái thiết kế tối giản kiểu Thiền (**Zen Presentation**). 

Hệ thống được cấu thành bởi ba thành phần cốt lõi:
1. **Web Hub (Trang chủ chính):** Nơi tích hợp đầy đủ thông tin về lịch chia sẻ, đại sảnh vinh danh, quỹ nhóm, thư viện sách và góc đúc kết cảm nhận.
2. **Hệ thống Poster (Week 2 & Week 4):** Ảnh thông báo khổ dọc (1080x1920) định dạng độ phân giải cao phục vụ truyền thông Zalo/Facebook.
3. **Hệ thống Slide trình chiếu:** Các slide thuyết trình nội bộ được thiết kế riêng theo từng tuần hoặc dạng tổng hợp nguồn lực, nhấn mạnh vào khoảng trống và sự tập trung (Zen Presentation).

---

## 2. HỆ THỐNG THƯƠNG HIỆU & KIỂU DÁNG (DESIGN SYSTEM)

### 2.1. Bảng màu (Color Palette)
Hệ thống sử dụng các biến CSS (`:root`) được kế thừa chéo giữa `style.css` và `luxury.css` để kiến tạo cảm giác sang trọng, học thuật nhưng vô cùng gần gũi:
*   **Màu chủ đạo (Primary Sage Green):** `#cce0d0` (Sage nhẹ nhàng cho màu nền cơ bản của Luxury theme) và `#047857` (Xanh ngọc lục bảo sâu sắc làm điểm nhấn nút bấm, tiêu đề).
*   **Màu nhấn Gold (Bronze-Gold):** `#b87a1f` và `#d69e3a` mang lại cảm giác cổ điển, biểu trưng cho La bàn Chính Bắc (True North).
*   **Màu nền phụ (Creamy White/Green):** `#eef4ed` và `#faf8f5` (Zen bg) tạo độ tương phản dịu mắt đối với người đọc trong các buổi chia sẻ sáng sớm (05h15).
*   **Màu văn bản (Ink Black/Slate):** `#0f172a` (màu chính) và `#334155` (màu phụ) mang lại độ tương phản tuyệt vời đối với màu nền.

### 2.2. Font chữ (Typography)
*   **Font tiêu đề (Display Font):** Sử dụng `'Playfair Display', serif` kết hợp độ đậm (font-weight) từ 700 đến 900. Đây là lựa chọn hoàn hảo tạo cảm giác học thuật, văn thơ và uy tín cao.
*   **Font nội dung (Body Font):** Sử dụng `'Be Vietnam Pro', sans-serif` và `'Inter', sans-serif` đem lại sự sắc nét, dễ đọc trên mọi thiết bị di động cũng như màn hình lớn.

### 2.3. Các yếu tố đồ họa đặc trưng (Visual Micro-details)
*   **Họa tiết La bàn (Compass Rose):** Xuất hiện dưới dạng Watermark mờ hoặc icon xoay nhẹ tại trang chủ và poster, biểu trưng cho mục đích tìm kiếm "Hướng Chính Bắc" (True North).
*   **Họa tiết Dấu chiết tự (❧):** Dùng để chia tách các phân mục lớn (Section Divider), tăng nét cổ điển phương Tây cho giao diện.
*   **Nền hạt nhiễu mịn (Noise Overlay):** Sử dụng bộ lọc SVG noise làm hiệu ứng mờ nhẹ trên nền giúp giảm độ chói của màn hình LCD/OLED khi đọc chữ lâu.

---

## 3. ĐÁNH GIÁ CHI TIẾT TỪNG THÀNH PHẦN (COMPONENT AUDIT)

### 3.1. Trang chủ Web Hub (`index.html` & `script.js`)
*   **Ưu điểm:**
    *   Phân trang bằng hiệu ứng cuộn mượt mà (smooth scrolling) kết hợp đổi trạng thái thanh điều hướng (`scrolled` navbar).
    *   Bảng xếp hạng Vinh Danh hiển thị trực quan dạng bục tam cấp (#2, #1, #3) rất kích thích năng lượng thi đua.
    *   Thư viện sách thiết kế dạng "Kệ sách xương sống" (Spine View) kết hợp màu sắc ngẫu nhiên giả lập kệ gỗ thực tế, mang lại trải nghiệm tương tác cao.
    *   Bộ đếm ngược thời gian (Countdown Timer) tự động tính toán chính xác tới buổi sinh hoạt tiếp theo vào sáng Chủ Nhật.
*   **Nhược điểm thiết kế:**
    *   Hiệu ứng chuyển đổi thư viện dạng Spine và Grid có sự lệch nhẹ về vị trí nút bấm trên phiên bản di động.
    *   Bảng màu biểu đồ Donut cho Quỹ Nhóm có độ tương phản hơi yếu giữa phần thu/chi đối với người mù màu.

### 3.2. Hệ thống Poster (`poster-week4.html`, `poster-week2.html` & `generator.html`)
*   **Ưu điểm:**
    *   Khổ ảnh tiêu chuẩn 1080x1920 tỷ lệ 9:16 tối ưu cho màn hình điện thoại thông minh.
    *   Các góc trang trí bằng đường viền vàng cổ điển sang trọng.
    *   Thiết kế thẻ diễn giả (Speaker Card) tự động thu gọn tiêu đề dài để không bị tràn dòng.
    *   Tích hợp mã QR kết nối nhanh tới Google Meet tiện lợi cho việc chụp ảnh quét trực tiếp.
*   **Nhược điểm thiết kế:**
    *   Dữ liệu lịch trình chia sẻ trong `poster-week4.html` có 4 phần (bao gồm cả Phần 2 của Thông), nhưng trong file thông báo dạng text `announcement-week4.md` chỉ có 3 phần. Sự không nhất quán này dễ gây hiểu nhầm cho thành viên.

### 3.3. Các Slide thuyết trình (`slides-*.html`)
*   **Ưu điểm:**
    *   Thiết kế Zen tối giản với 1-2 ý tưởng cốt lõi trên mỗi trang chiếu, giúp người xem không bị quá tải thông tin.
    *   Thanh tiến trình (`progressBar`) dưới đáy màn hình hiển thị trực quan vị trí hiện tại.
    *   Hỗ trợ phím tắt điều hướng nhanh (`Arrow`, `Space`, `Enter`, `f` cho chế độ Toàn màn hình).
*   **Nhược điểm thiết kế:**
    *   Thiếu sự đồng bộ màu nền: Một số slide dùng nền be (`--bg: #faf8f5`), số khác dùng xanh nhạt của Luxury theme (`--bg-primary: #cce0d0`).
    *   Kích thước tiêu đề lớn (`font-size: 80px`) trên di động bị tràn viền nếu không có cấu hình `@media` chi tiết.

---

## 4. CÁC ĐIỂM BẤT CẬP UI/UX QUAN TRỌNG (CRITICAL DISCREPANCIES)

1.  **Sự không nhất quán về vai trò MC & Sharer tại Tuần 4:**
    *   Trong `config.json`, MC tuần 4 là **Thanh Lương** và danh sách chia sẻ gồm 3 người (Thanh, GiangLe, Bảo).
    *   Trong `announcement-week4.md` và `poster-week4.html`, MC lại hiển thị là **Bảo Bảo**.
    *   Trong `poster-week4.html`, danh sách chia sẻ có 4 phần (bổ sung thêm Phần 2 của **Thông** trình bày Nguồn lực 3 & 7), trong khi `announcement-week4.md` lại rút gọn chỉ còn 3 phần và gộp Nguồn lực 1 & 2 của Thanh.
    *   *Khắc phục:* Cần thống nhất thông tin nguồn dữ liệu trước khi xuất bản bản in hoặc bản thông báo text.
2.  **Lỗi trỏ chuột tùy biến (Custom SVG Cursor):**
    *   Trong `luxury.css` định nghĩa con trỏ chuột tùy biến bằng SVG data-uri.
    *   *Vấn đề:* Việc áp dụng thuộc tính `cursor: ... !important` lên toàn bộ thẻ `a`, `button`, `.btn` gây ghi đè lên các trạng thái trỏ chuột chuẩn của hệ điều hành, làm mất trải nghiệm tự nhiên (UX) và gây đơ/lag nhẹ đối với các thiết bị di động hoặc máy tính bảng hỗ trợ trackpad.
3.  **Lỗi căn lề dọc thẻ Diễn giả trên thiết bị di động:**
    *   Khi co màn hình dưới `768px`, danh sách thẻ diễn giả trên Poster tự động chuyển về dạng 1 cột dọc (Flex/Grid column). Tuy nhiên, khoảng cách lề (padding) và cỡ chữ tên diễn giả (`30px`) quá to làm thẻ bị phình to quá mức màn hình điện thoại tỷ lệ nhỏ.

---

## 5. KHUYẾN NGHỊ & ĐỀ XUẤT CẢI TIẾN
*   **Đề xuất 1 (Harmonization):** Chuẩn hóa một tệp biến CSS gốc duy nhất để toàn bộ slide và tệp HTML dùng chung. Tránh định nghĩa lại bảng màu riêng lẻ trong từng tệp slide.
*   **Đề xuất 2 (Mobile Optimization):** Giới hạn kích thước con trỏ chuột SVG tùy biến chỉ hoạt động trên màn hình máy tính (`@media (pointer: fine)`), tắt hoàn toàn trên màn hình cảm ứng để tăng độ nhạy và hiệu năng.
*   **Đề xuất 3 (Consistency):** Đồng bộ hóa quy trình cập nhật dữ liệu tự động từ Google Sheet thông qua `generator.html` để đảm bảo tệp thông báo text và tệp poster luôn hiển thị khớp 100% dữ liệu MC và Diễn giả.
