# 📚 Book & Beyond — Brand Guidelines
> Đọc để biết · Chia sẻ để nhớ · Ứng dụng để chuyển hóa

---

## 1. Brand Identity

### Mission
Tạo dựng cộng đồng học tập qua sách, nơi mỗi thành viên không chỉ đọc mà còn chia sẻ, ứng dụng và chuyển hóa kiến thức vào cuộc sống.

### Brand Personality
- **Trí tuệ** — Kiến thức sâu sắc, tư duy phản biện
- **Ấm áp** — Cộng đồng thân thiện, hỗ trợ lẫn nhau
- **Kỷ luật** — Cam kết, trách nhiệm, phát triển liên tục
- **Hiện đại** — Giao diện tinh tế, trải nghiệm mượt mà

### Tone of Voice
- Chuyên nghiệp nhưng gần gũi
- Ngắn gọn, rõ ràng
- Tích cực, truyền cảm hứng
- Tôn trọng, không phán xét

---

## 2. Logomark

Logo kết hợp **sách mở** (biểu tượng tri thức) với **ngôi sao phương Bắc** (la bàn dẫn hướng — "Chính Bắc" / True North), tượng trưng cho hành trình đọc sách dẫn tới sự phát triển.

### Quy tắc sử dụng
- Luôn giữ khoảng trống xung quanh logo tối thiểu = chiều cao chữ "B"
- Không biến dạng, xoay nghiêng hoặc thay đổi tỷ lệ
- Trên nền tối: logo màu amber (#F59E0B)
- Trên nền sáng: logo màu navy (#0A0E17)

---

## 3. Color Palette

### Primary Colors

| Tên | Hex | Dùng cho |
|---|---|---|
| **Deep Navy** | `#0A0E17` | Background chính |
| **Charcoal** | `#111827` | Background phụ, section alt |
| **Card Dark** | `#1A2234` | Card, container |

### Accent Colors

| Tên | Hex | Dùng cho |
|---|---|---|
| **Warm Amber** | `#F59E0B` | CTA, highlights, branding |
| **Amber Light** | `#FBBF24` | Hover states, gradient end |
| **Amber Glow** | `rgba(245,158,11,0.15)` | Background glow effects |

### Semantic Colors

| Tên | Hex | Dùng cho |
|---|---|---|
| **Emerald** | `#10B981` | Thu nhập, thành công, tích cực |
| **Rose** | `#EF4444` | Chi tiêu, cảnh báo, lỗi |
| **Sky Blue** | `#3B82F6` | Link, thông tin phụ |
| **Violet** | `#8B5CF6` | Decorative accent |

### Text Colors

| Tên | Hex | Dùng cho |
|---|---|---|
| **Primary** | `#F1F5F9` | Tiêu đề, nội dung chính |
| **Secondary** | `#94A3B8` | Mô tả, nội dung phụ |
| **Muted** | `#64748B` | Label, timestamp, hint |

---

## 4. Typography

### Font Family
**Be Vietnam Pro** — Google Fonts
- Thiết kế cho tiếng Việt, hỗ trợ dấu hoàn hảo
- Geometric sans-serif, hiện đại, dễ đọc
- Fallback: `-apple-system, BlinkMacSystemFont, sans-serif`

### Type Scale

| Element | Size | Weight | Tracking |
|---|---|---|---|
| **Hero Title** | `clamp(2.2rem, 6vw, 3.5rem)` | 800 | -0.02em |
| **Section Title** | `1.75rem` | 700 | -0.01em |
| **Card Title** | `1.4rem` | 700 | 0 |
| **Body** | `1rem` | 400 | 0 |
| **Small / Label** | `0.85rem` | 500–600 | 0.08em uppercase |
| **Caption** | `0.75rem` | 600 | 0.1em uppercase |

### Hiệu ứng đặc biệt
- **Shimmer gradient** trên hero title: `linear-gradient(135deg, #f1f5f9, #f59e0b, #f1f5f9)`
- **Gradient text** cho logo: `linear-gradient(135deg, #f59e0b, #d97706)`

---

## 5. Spacing & Layout

### Spacing Scale (8px base)
```
4px  · 8px  · 12px · 16px · 20px · 24px · 28px · 32px · 40px · 48px · 64px · 80px
```

### Layout
- **Max container width:** 960px
- **Section padding:** 80px vertical
- **Card padding:** 24–28px
- **Border radius:** 16px (card) · 10px (button) · 6px (tag)
- **Mobile padding:** 20px horizontal

### Grid
- **Mobile:** Single column
- **Tablet (640px+):** 2 columns
- **Desktop (768px+):** Full navigation, side-by-side layouts

---

## 6. Components

### Cards
```css
background: #1A2234;
border: 1px solid rgba(255, 255, 255, 0.1);
border-radius: 16px;
backdrop-filter: blur(20px);    /* khi cần glassmorphism */
transition: border-color 0.3s;
```
- Hover: `border-color` chuyển sang `#F59E0B`
- Active/Current: `border: 1px solid #F59E0B` + glow shadow

### Buttons
| Loại | Style |
|---|---|
| **Primary** | Gradient amber, text dark, shadow glow |
| **Secondary** | Card dark bg, border light, text primary |
| **Outline** | Transparent, amber border, amber text |

### Navigation
- **Mobile:** Hamburger → slide-in panel từ phải
- **Desktop:** Horizontal links, CTA button nổi bật
- **Backdrop blur** khi scroll: `rgba(10, 14, 23, 0.8)`

---

## 7. Animations & Motion

### Nguyên tắc
- Mượt mà, không gây xao nhãng
- Transition: `cubic-bezier(0.4, 0, 0.2, 1)` — 300ms
- Sử dụng `will-change` cho performance

### Hiệu ứng chuẩn
| Effect | Duration | Dùng khi |
|---|---|---|
| `fadeInUp` | 600ms | Sections xuất hiện |
| `shimmer` | 3s loop | Hero title |
| `hover: scale(1.03)` | 300ms | Book cover |
| `hover: translateY(-2px)` | 250ms | Buttons |

---

## 8. Iconography

- **Style:** Emoji-based (tương thích cross-platform)
- **Size:** 2rem cho section icon, inline cho UI
- **Bộ icon chính:**
  - 📚 Sách/Thư viện
  - 🗓️ Lịch/Schedule
  - 🏆 Bảng xếp hạng
  - 💰 Quỹ nhóm
  - 📋 Nội quy
  - 🔗 Quick Links
  - 🎙️ MC
  - 🔥 Streak

---

## 9. Quick Reference

### CSS Variables (copy-paste)
```css
:root {
  --bg-primary: #0a0e17;
  --bg-secondary: #111827;
  --bg-card: #1a2234;
  --accent: #f59e0b;
  --accent-light: #fbbf24;
  --green: #10b981;
  --red: #ef4444;
  --text-primary: #f1f5f9;
  --text-secondary: #94a3b8;
  --text-muted: #64748b;
  --radius: 16px;
  --ease: cubic-bezier(0.4, 0, 0.2, 1);
}
```
