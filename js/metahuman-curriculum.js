// MetaHuman 31-Day Practice Curriculum Orchestrator ("A Month of Awakening" + Bonus Day 32)
// Source: Deepak Chopra, M.D., "Metahuman: Unleashing Your Infinite Potential"

import { DAYS_01_10 } from './metahuman-days-01-10.js';
import { DAYS_11_20 } from './metahuman-days-11-20.js';
import { DAYS_21_31 } from './metahuman-days-21-31.js';

export const PHASES = [
  {
    id: 1,
    title: 'Giai đoạn 1 · Giải cấu trúc giác quan & thực tại',
    subtitle: 'Từ giác quan nguyên bản đến cấu trúc tâm trí (Ngày 1–10)',
    range: 'Ngày 1–10',
    badge: 'Phase 1 · Sensations',
    summary: 'Khám phá thực tại thường ngày bắt đầu từ những lát cắt giác quan phù du được tâm trí định kiến xâu chuỗi thành bộ phim liên tục.'
  },
  {
    id: 2,
    title: 'Giai đoạn 2 · Tâm trí định kiến & Giấc mơ tỉnh thức',
    subtitle: 'Bước ra ngoài thực tại ảo và thời gian đồng hồ (Ngày 11–20)',
    range: 'Ngày 11–20',
    badge: 'Phase 2 · Lucid Now',
    summary: 'Nhận diện thân-tâm-thế giới là một hoạt động duy nhất của nhận biết và thức tỉnh như người mơ ngay trong hiện tại vượt thời gian.'
  },
  {
    id: 3,
    title: 'Giai đoạn 3 · Chấm dứt khổ đau & Sống Siêu Nhân',
    subtitle: 'Từ cái vô tướng đến tự do tuyệt đối (Ngày 21–31)',
    range: 'Ngày 21–31',
    badge: 'Phase 3 · Metahuman',
    summary: 'Tháo gỡ bám chấp vào ký ức và nỗi sợ vô thường, an trú nơi màn ảnh nhận biết bất biến để vừa thưởng thức vừa đồng sáng tạo bộ phim cuộc đời.'
  },
  {
    id: 4,
    title: 'Giai đoạn 4 · Cho Mọi Ngày (For Every Day)',
    subtitle: 'Thức tỉnh phi thời gian trong từng khoảnh khắc (Ngày 32 · Bonus)',
    range: 'Mọi ngày',
    badge: 'Bonus · Every Day',
    summary: 'Không có lịch trình thời gian nào cho việc nhận ra bạn là người mơ chứ không phải giấc mơ—chỉ cần dừng lại và biết "Tôi đang ở đây".'
  }
];

export const DIMENSIONS = [
  'Quan sát giác quan nguyên bản',
  'Nhận diện tâm trí định kiến',
  'Hiện diện ngoài thời gian đồng hồ',
  'Tháo gỡ bám chấp & khổ đau ảo ảnh',
  'Sống như người đồng sáng tạo tỉnh thức'
];

export const WEEK_THEMES = [
  {
    week: 1,
    title: 'Tuần 1 · Những lát cắt giác quan & Người đứng sau ống kính',
    daysRange: 'Ngày 1–7',
    focusPrompt: 'Tuần qua, khoảnh khắc nào giúp bạn thấy rõ nhất sự khác biệt giữa các cảm giác thoáng qua và sự nhận biết bất biến đang chứng kiến chúng?'
  },
  {
    week: 2,
    title: 'Tuần 2 · Cấu trúc tâm trí & Mạng lưới thực tại ảo',
    daysRange: 'Ngày 8–14',
    focusPrompt: 'Khi nhận ra cơ thể, tâm trí và thế giới là một hoạt động duy nhất không qua diễn giải, cách bạn tương tác với hoàn cảnh quanh mình đã dịch chuyển ra sao?'
  },
  {
    week: 3,
    title: 'Tuần 3 · Giấc mơ tỉnh thức & Hiện tại vượt thời gian',
    daysRange: 'Ngày 15–21',
    focusPrompt: 'Trải nghiệm bước ra khỏi "thời gian đồng hồ" và buông bỏ các nhãn mác định danh đã mở ra cảm giác tự do nào trước những giới hạn từng tưởng là bất khả thi?'
  },
  {
    week: 4,
    title: 'Tuần 4 · Màn ảnh bất biến & Sự buông xả tự nhiên',
    daysRange: 'Ngày 22–28',
    focusPrompt: 'Việc nhận diện mình là "màn ảnh nhận biết" thay vì những con hà ký ức bám trên thân tàu đã giúp bạn tháo gỡ nỗi sợ vô thường hay tổn thương cũ như thế nào?'
  },
  {
    week: 5,
    title: 'Tuần 5 · Trạng thái Siêu Nhân & Thực hành Cho Mọi Ngày',
    daysRange: 'Ngày 29–32',
    focusPrompt: 'Làm thế nào để bạn duy trì trạng thái vừa tận hưởng trọn vẹn bộ phim cuộc đời, vừa nhớ rằng "Tôi đang ở đây" như người sáng tạo tỉnh thức của bộ phim ấy?'
  }
];

export const DAYS = [...DAYS_01_10, ...DAYS_11_20, ...DAYS_21_31];

export function getDay(dayNumber) {
  const num = Number(dayNumber);
  return DAYS.find((item) => item.day === num) || DAYS[0];
}

export function getPhaseForDay(dayNumber) {
  const dayObj = getDay(dayNumber);
  return PHASES.find((phase) => phase.id === dayObj.phase) || PHASES[0];
}
