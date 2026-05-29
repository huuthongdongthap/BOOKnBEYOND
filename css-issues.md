# BÁO CÁO CÁC LỖI CSS & KIỂM THỬ KỸ THUẬT (TECHNICAL CSS/JS ISSUES REPORT) — BOOKnBEYOND

**Dự án:** BOOKnBEYOND Web Hub & Slides System  
**Độ ưu tiên:** Cao (Critical & Major issues)  
**Tác giả:** Hệ thống Phân tích Kỹ thuật (Project Orchestrator)  
**Tệp tin kiểm thử:** `style.css`, `luxury.css`, `slides-*.html`, `poster-*.html`  

---

## 1. LỖI LOGIC TRANSITION SLIDE NGHIÊM TRỌNG (CRITICAL JS/CSS SCOPING BUG)

Qua phân tích mã nguồn của tệp script điều hành slide nằm trong hầu hết các tệp trình chiếu:
*   `slides-proposal.html` (Dòng 347)
*   `slides-week1-thong.html` (Dòng 914)
*   `slides-week3.html` (Dòng 876)
*   `slides-week4-nexus.html` (Dòng 989)
*   `slides-week5-nexus-ch3-4.html` (Dòng 847)

### 1.1. Chi tiết lỗi
Trong hàm `showSlide(n)`, lập trình viên đã viết đoạn mã chuyển đổi hiệu ứng slide như sau:
```javascript
function showSlide(n) {
  slides[current].classList.remove('active');
  slides[current].classList.add('exit');
  setTimeout(() => slides[current].classList.remove('exit'), 600); // <-- LỖI SCOPE BIẾN Asynchronous
  current = ((n % slides.length) + slides.length) % slides.length; // <-- Biến current bị thay đổi ngay lập tức
  slides[current].classList.add('active');
  document.getElementById('progressBar').style.width = ((current + 1) / slides.length * 100) + '%';
}
```

### 1.2. Hậu quả thực tế (Visual Bug)
Do biến toàn cục `current` bị cập nhật thành chỉ mục slide **mới** trước khi bộ hẹn giờ `setTimeout` (600ms) được thực thi, khi sự kiện trì hoãn kích hoạt, callback sẽ loại bỏ lớp `.exit` khỏi **slide mới** thay vì **slide cũ**. 
Hậu quả là:
1.  **Slide cũ không bao giờ bị xóa lớp `.exit`**, dẫn đến việc tích tụ class `.exit` trên các slide cũ, phá hỏng các lượt chuyển trang tiếp theo.
2.  **Slide mới bị giật chớp màn hình (visual flashing/glitch)** do bị xóa lớp `.exit` một cách không mong muốn ngay khi vừa hiển thị.
3.  Hiệu ứng dịch chuyển ngang `transform: translateX(-30px)` của slide thoát bị đơ hoàn toàn.

### 1.3. Phương án sửa đổi (Fix Code)
Sử dụng hằng số cục bộ `oldIndex` để khóa giá trị chỉ mục slide cũ trong phạm vi closure của hàm:
```javascript
function showSlide(n) {
  const oldIndex = current; // Khóa chỉ mục của slide cũ
  slides[oldIndex].classList.remove('active');
  slides[oldIndex].classList.add('exit');
  setTimeout(() => {
    slides[oldIndex].classList.remove('exit');
  }, 600); // Xóa lớp exit trên đúng slide cũ sau khi hiệu ứng hoàn tất
  
  current = ((n % slides.length) + slides.length) % slides.length;
  slides[current].classList.add('active');
  document.getElementById('progressBar').style.width = ((current + 1) / slides.length * 100) + '%';
}
```

---

## 2. XUNG ĐỘT KIỂU DÁNG & DƯ THỪA CÚ PHÁP (STYLE BLOAT & SPECIFICITY WAR)

### 2.1. Lạm dụng thuộc tính `!important`
Trong tệp `luxury.css`, thuộc tính `!important` được sử dụng tới hơn **40 lần** trên các selector cơ bản:
*   *Ví dụ:* `.btn-primary { background: ... !important; color: #fff !important; }`
*   *Ví dụ:* `.nav-logo span { color: var(--gold) !important; }`
*   *Hậu quả:* Việc này phá hỏng tính kế thừa tự nhiên của CSS (Cascade). Khi nhóm muốn phát triển giao diện tối (Dark Mode) hoặc tùy biến nút bấm riêng lẻ, việc đè lớp (override) sẽ cực kỳ khó khăn do độ ưu tiên (specificity) quá cao.

### 2.2. Trỏ chuột tùy biến (Custom SVG Cursor) gây lỗi tương tác
Trong `luxury.css` dòng 33 và 77 định nghĩa:
```css
body {
  cursor: url('data:image/svg+xml;...') 12 12, auto;
}
a, button, .btn {
  cursor: url('data:image/svg+xml;...') 12 12, pointer !important;
}
```
*   *Vấn đề 1 (Performance):* Bản vẽ SVG nhúng trực tiếp dạng data-uri không tối ưu hóa bộ nhớ đệm (cache), dẫn đến việc bộ dựng hình của trình duyệt (Renderer) phải tính toán lại vị trí vẽ trỏ chuột liên tục khi di chuyển, gây hiện tượng trễ khung hình (input lag) trên màn hình tần số quét cao (120Hz/144Hz) hoặc máy cấu hình yếu.
*   *Vấn đề 2 (UX/Accessibility):* Ép buộc trỏ chuột SVG lên `a` và `button` qua `!important` làm mất hiệu ứng trỏ chuột mặc định của hệ điều hành dành cho các thành phần đặc biệt (như thanh cuộn scrollbar, trình chọn thả dropdown `<select>`, hoặc vùng nhập văn bản `<textarea>`). Người dùng khó phân biệt được vùng nào thực sự có thể nhấp chuột.

---

## 3. LỖI TƯƠNG THÍCH TRÊN DI ĐỘNG (MOBILE RESPONSIVE DEFECTS)

### 3.1. Kệ sách Spine View thiếu khả năng cuộn mượt
Tại `index.html` dòng 210 và `style.css` định nghĩa tệp kệ sách `.library-shelf.spine-view`.
*   *Vấn đề:* Trên thiết bị di động (màn hình nhỏ hơn `480px`), các xương gáy sách nằm ngang (`book-spine`) xếp san sát nhau với chiều rộng ngẫu nhiên (`50px - 70px`). Do kệ sách không tự co giãn hoặc không được kích hoạt tính năng cuộn ngang cảm ứng mượt mà (`-webkit-overflow-scrolling: touch`), giao diện bị tràn viền phải (overflow-x), xuất hiện khoảng trắng thừa ở cạnh phải của toàn bộ trang web.
*   *Khắc phục:* Bổ sung thuộc tính `overflow-x: auto` và `scroll-snap-type: x mandatory` cho lớp `.library-shelf`.

### 3.2. Tiêu đề lớn tràn khung trình chiếu (Zen Title Overflow)
Trong các slide Zen (`slides-all-resources.html`, `slides-resources-3-7.html`), tiêu đề chính `h1.zen` hoặc `h2.zen` có cỡ chữ mặc định lên tới `80px` hoặc `56px`.
*   *Vấn đề:* Mặc dù có media query giảm cỡ chữ xuống `36px` trên màn hình dưới `768px`, đối với các dòng tiêu đề dài (ví dụ: *"Bổ Sung Thành Viên Mới Vào Nhóm"*), chữ bị ngắt dòng đơn lẻ từng từ một hoặc tràn hẳn ra ngoài lề trái/phải trên màn hình di động dọc (dưới `375px`).
*   *Khắc phục:* Nên sử dụng đơn vị tương đối thông minh như `clamp(2rem, 6vw, 5rem)` để cỡ chữ tự động thu giãn mượt mà theo chiều rộng của màn hình thiết bị.

---

## 4. DANH SÁCH KHẮC PHỤC LỖI CSS CHỦ CHỐT (TECHNICAL REPAIR CHECKLIST)

- [ ] **Sửa lỗi scope JS `showSlide`:** Cập nhật biến tạm `oldIndex` cho toàn bộ 5 tệp slide trình chiếu có sử dụng lớp `.exit`.
- [ ] **Tối ưu con trỏ chuột Custom Cursor:**
  - Loại bỏ thuộc tính `!important` khỏi quy tắc `cursor` của thẻ `a` và `button`.
  - Giới hạn hiệu ứng con trỏ chuột tùy biến chỉ chạy trên màn hình desktop bằng truy vấn truyền thông `@media (pointer: fine)`.
- [ ] **Cải thiện độ co giãn của biểu đồ Quỹ Nhóm:** Đảm bảo vòng tròn biểu đồ Donut (`#fundDonut`) tự căn giữa hoàn hảo khi chuyển đổi sang giao diện 1 cột trên điện thoại di động dưới `576px`.
- [ ] **Khắc phục tràn kệ sách (Spine shelf overflow):** Thêm cơ chế tự động ngắt dòng hoặc cuộn ngang thanh lịch cho danh mục sách đã đọc.
