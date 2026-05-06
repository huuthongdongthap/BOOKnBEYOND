# 📚 Nexus — Dữ Liệu Chương Cho Google Sheet

## Hướng dẫn nhập vào Google Sheet

### Bước 1: Mở Google Sheet
Link: https://docs.google.com/spreadsheets/d/18JVy2EqdRsJDf_tzDfsqX-jE5I6gos8sWBVzcK06tRU

### Bước 2: Tạo tab "CONFIG" mới
Click dấu `+` ở góc trái dưới → đặt tên `CONFIG` → nhập:

| A (Key) | B (Value) |
|---|---|
| `currentBook` | `Nexus` |
| `meetLink` | `https://meet.google.com/onb-gepu-owa` |
| `zaloGroup` | `https://zalo.me/g/ukcaaq228` |

### Bước 3: Nhập metadata vào tab "Nexus"
Thêm 6 hàng đầu tiên (trước header hiện tại):

| A | B |
|---|---|
| `_title` | `Nexus: Lược sử của những mạng lưới thông tin` |
| `_author` | `Yuval Noah Harari` |
| `_originalTitle` | `Nexus: A Brief History of Information Networks from the Stone Age to AI` |
| `_cover` | `https://covers.openlibrary.org/b/isbn/9786043651973-L.jpg` |
| `_startDate` | `2026-05-10` |
| `_endDate` | `2026-06-14` |

### Bước 4: Copy danh sách chương bên dưới vào Sheet (sau header "Nexus | Từ trang | Số trang | Tên | Tên nhận chương")

---

## Danh sách chương — Nexus (Bản tiếng Việt, Omega Plus, ~552 trang)

> **Lưu ý:** Số trang ước lượng dựa trên bản tiếng Việt Omega Plus 2024. Chương 9 bắt đầu trang 368 (confirmed). Các trang khác ước tính tỷ lệ từ bản gốc 384 trang EN → 552 trang VN (hệ số ~1.44).

### Copy-paste vào Google Sheet (tab-separated):

```
Dẫn nhập	7	~35 trang		Tuần 1 - 10/05 MC: 
Chương 1: Thông tin là gì?	43	~50 trang		
Chương 2: Những câu chuyện kể — Kết nối không giới hạn	93	~50 trang		Tuần 2 - 17/05 MC: 
Chương 3: Tài liệu — Nanh vuốt của hổ giấy	143	~45 trang		
Chương 4: Sai lầm — Ảo tưởng về sự không thể sai lầm	188	~50 trang		Tuần 3 - 24/05 MC: 
Chương 5: Quyết định — Lược sử về dân chủ và toàn trị	238	~50 trang		
Chương 6: Những thành viên mới — Máy tính khác với máy in như thế nào	288	~30 trang		Tuần 4 - 31/05 MC: 
Chương 7: Không ngừng nghỉ — Mạng lưới luôn vận hành	318	~25 trang		
Chương 8: Có thể sai lầm — Mạng lưới thường sai	343	~25 trang		Tuần 5 - 07/06 MC: 
Chương 9: Dân chủ — Chúng ta còn nói chuyện được với nhau?	368	~45 trang		
Chương 10: Chuyên chế — Thuật toán toàn năng?	413	~45 trang		Tuần 6 - 14/06 MC: 
Chương 11: Bức màn Silicon — Đế chế toàn cầu hay sự chia rẽ toàn cầu?	458	~45 trang		
Lời kết	503	~30 trang		
REVIEW & TỔNG KẾT				
```

### Gợi ý phân tuần (6 tuần × ~85 trang/tuần):

| Tuần | Ngày | Nội dung | ~Trang |
|---|---|---|---|
| 1 | 10/05/2026 | Dẫn nhập + Chương 1 | ~85 trang |
| 2 | 17/05/2026 | Chương 2 + Chương 3 | ~95 trang |
| 3 | 24/05/2026 | Chương 4 + Chương 5 | ~100 trang |
| 4 | 31/05/2026 | Chương 6 + Chương 7 + Chương 8 | ~80 trang |
| 5 | 07/06/2026 | Chương 9 + Chương 10 | ~90 trang |
| 6 | 14/06/2026 | Chương 11 + Lời kết + REVIEW | ~75 trang |

### Ảnh bìa sách
- URL Open Library: `https://covers.openlibrary.org/b/isbn/9786043651973-L.jpg`
- Nếu URL trên không hoạt động, search Google Images: "Nexus Yuval Noah Harari bìa tiếng Việt" → copy URL ảnh

---

## Workflow sau khi nhập

1. ✅ Nhập xong Sheet → chờ tối đa 5 phút (hoặc truy cập `/api/cache-bust` để clear cache)
2. ✅ Mở web → sách Nexus tự hiển thị
3. ✅ Mở Generator → poster + thông báo Zalo tự có data Nexus
4. ✅ Members tự vào Sheet → ghi tên vào cột "Tên" → đăng ký chương
5. ✅ BĐH gán MC vào cột "Tên nhận chương" → web auto-update
