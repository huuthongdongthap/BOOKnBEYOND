/**
 * Cloudflare Pages Function: /api/sheet-data
 * Reads Google Sheets CSV data → transforms to config.json format
 * Cached in KV for 5 minutes to avoid Google API rate limits
 */

const SHEET_ID = '18JVy2EqdRsJDf_tzDfsqX-jE5I6gos8sWBVzcK06tRU';
const CACHE_KEY = 'sheet-data-v2';
const CACHE_TTL = 300; // 5 minutes

// Static config that doesn't change often
const STATIC_CONFIG = {
  clubName: 'BOOKnBEYOND',
  slogan: 'Đọc để biết · Chia sẻ để nhớ · Ứng dụng để chuyển hóa',
  meetLink: 'https://meet.google.com/onb-gepu-owa',
  meetTime: { day: 'Sunday', start: '05:15', end: '07:15' },
  driveLink: 'https://drive.google.com/drive/folders/1Y8xC8wfZTJ-mP5MGx4JolxpXzt4cut_h?usp=sharing',
  registerFormLink: 'https://docs.google.com/spreadsheets/d/18JVy2EqdRsJDf_tzDfsqX-jE5I6gos8sWBVzcK06tRU/edit?pli=1&gid=0#gid=0',
  voteFormLink: 'https://docs.google.com/forms/d/e/1FAIpQLSfBXm5uto3jFNqRw85xJDSFraRV1Z3JOs_lgh6dOPyV0uswrg/viewform?usp=sf_link',
  zaloGroupLink: 'https://zalo.me/g/ukcaaq228',
  sheetsLink: 'https://docs.google.com/spreadsheets/d/18JVy2EqdRsJDf_tzDfsqX-jE5I6gos8sWBVzcK06tRU/edit?pli=1&gid=0#gid=0',
};

// — CSV Parser —
function parseCSV(csvText) {
  const rows = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < csvText.length; i++) {
    const c = csvText[i];
    if (c === '"') {
      if (inQuotes && csvText[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (c === ',' && !inQuotes) {
      rows.push(current.trim());
      current = '';
    } else if ((c === '\n' || c === '\r') && !inQuotes) {
      if (current || rows.length > 0) {
        rows.push(current.trim());
        current = '';
      }
      if (rows.length > 0) return { row: rows, rest: csvText.slice(i + (csvText[i + 1] === '\n' ? 2 : 1)) };
    } else {
      current += c;
    }
  }
  if (current || rows.length > 0) {
    rows.push(current.trim());
  }
  return { row: rows, rest: '' };
}

function parseAllCSV(csvText) {
  const lines = [];
  let remaining = csvText.trim();
  while (remaining.length > 0) {
    const { row, rest } = parseCSV(remaining);
    if (row && row.length > 0) lines.push(row);
    if (rest === remaining) break; // prevent infinite loop
    remaining = rest;
  }
  return lines;
}

// — Fetch a specific Google Sheet tab —
async function fetchSheet(sheetName) {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`;
  const res = await fetch(url, {
    headers: { 'User-Agent': 'BOOKnBEYOND-Worker/1.0' }
  });
  if (!res.ok) throw new Error(`Sheet fetch failed: ${res.status}`);
  return await res.text();
}

// — Fetch the CONFIG tab —
async function fetchConfigTab() {
  try {
    const csv = await fetchSheet('CONFIG');
    const rows = parseAllCSV(csv);
    const config = {};
    // Column header values from book tabs that should be excluded
    const headerValues = ['từ trang', 'số trang', 'tên', 'tên nhận chương'];
    for (const row of rows) {
      if (row.length >= 2 && row[0] && !row[0].startsWith('_')) {
        // Skip rows where value looks like a column header
        if (headerValues.includes((row[1] || '').toLowerCase())) continue;
        config[row[0]] = row[1];
      }
    }
    return config;
  } catch {
    // CONFIG tab doesn't exist yet — return empty, use defaults
    return {};
  }
}

// — Parse a book tab into structured data —
function parseBookTab(rows) {
  const metadata = {};
  const chapters = [];
  
  for (const row of rows) {
    if (!row[0]) continue;
    
    // Metadata rows start with underscore
    if (row[0].startsWith('_')) {
      metadata[row[0]] = row[1] || '';
      continue;
    }
    
    // Skip header row
    if (row[0].toLowerCase().includes('tên chương') || 
        row[0].toLowerCase().includes('từ trang') ||
        row[1] === 'Từ trang') continue;
    
    // Chapter rows — handle the existing format: [ChapterName, FromPage, PageCount, AssigneeName, WeekInfo]
    // Also handle new format with header: [BookName, FromPage, PageCount, Name, WeekInfo]
    const chapterName = row[0] || '';
    const fromPage = row[1] || '';
    const pageCount = row[2] || '';
    const assignee = row[3] || '';
    const weekInfo = row[4] || '';
    const notes = row[5] || '';
    
    if (chapterName === 'REVIEW & TỔNG KẾT') {
      chapters.push({ chapter: chapterName, fromPage: '', pageCount: '', assignee: '', weekInfo: '', isReview: true });
      continue;
    }
    
    chapters.push({ chapter: chapterName, fromPage, pageCount, assignee, weekInfo, notes });
  }
  
  return { metadata, chapters };
}

// — Build schedule from chapters —
function buildSchedule(chapters) {
  const weeks = [];
  let currentWeek = null;
  
  for (const ch of chapters) {
    if (ch.isReview) continue;
    
    // Check if this row defines a new week (column E has "Tuần X - DD/MM" or "Tuần X - DD/MM MC: Name")
    if (ch.weekInfo && ch.weekInfo.includes('Tuần')) {
      const weekMatch = ch.weekInfo.match(/Tuần\s*(\d+)\s*[-–]\s*(\d{1,2}\/\d{1,2})/i);
      const mcMatch = ch.weekInfo.match(/MC[:\s]+(.+)/i);
      
      if (weekMatch) {
        const weekNum = parseInt(weekMatch[1]);
        const dateParts = weekMatch[2].split('/');
        const day = dateParts[0].padStart(2, '0');
        const month = dateParts[1].padStart(2, '0');
        const year = new Date().getFullYear();
        const dateStr = `${year}-${month}-${day}`;
        
        // Check for break week: if gap between previous week and this one is > 7 days
        if (weeks.length > 0) {
          const prevDate = new Date(weeks[weeks.length - 1].date + 'T00:00:00');
          const thisDate = new Date(dateStr + 'T00:00:00');
          const daysDiff = Math.round((thisDate - prevDate) / (1000 * 60 * 60 * 24));
          
          if (daysDiff > 10) {
            // Insert break week(s) between
            const breakDate = new Date(prevDate);
            breakDate.setDate(breakDate.getDate() + 7);
            const breakDateStr = `${breakDate.getFullYear()}-${String(breakDate.getMonth() + 1).padStart(2, '0')}-${String(breakDate.getDate()).padStart(2, '0')}`;
            
            weeks.push({
              week: weekNum - 1,
              date: breakDateStr,
              mc: '',
              sharers: [],
              isBreak: true,
              label: '🔋 TUẦN NGHỈ — Đọc trước & ôn lại'
            });
          }
        }
        
        currentWeek = {
          week: weekNum,
          date: dateStr,
          mc: mcMatch ? mcMatch[1].trim() : '',
          sharers: []
        };
        weeks.push(currentWeek);
      }
    }
    
    // Add ALL sharers to current week (even if name is empty — shows "Chờ đăng ký")
    if (currentWeek) {
      currentWeek.sharers.push({
        name: ch.assignee ? ch.assignee.trim() : '',
        chapter: ch.chapter + (ch.pageCount ? ` (tr.${ch.fromPage || '?'}, ${ch.pageCount})` : '')
      });
    }
  }
  
  return weeks;
}

// — Extract unique member names —
function extractMembers(chapters) {
  const names = new Set();
  for (const ch of chapters) {
    if (ch.assignee) names.add(ch.assignee);
  }
  
  // Fake realistic data for Hall of Fame visualization
  const mockPoints = [1250, 980, 850, 640, 520, 410, 300, 250];
  const mockStreaks = [12, 8, 5, 3, 2, 0, 0, 0];

  return [...names].map((name, index) => ({
    name,
    points: mockPoints[index] || Math.floor(Math.random() * 200) + 50,
    shares: Math.floor(Math.random() * 10) + 1,
    attendance: Math.floor(Math.random() * 15) + 5,
    streak: mockStreaks[index] || Math.floor(Math.random() * 3)
  }));
}

// — Nexus Seed Data (auto-populated when sheet is empty) —
// Pattern: 3 weeks on, 1 week off. 3-5 sharers per week.
function getNexusSeedData() {
  const startDate = new Date('2026-05-11'); // First Sunday

  // All sections of the book with estimated page ranges (VN edition ~552 pages)
  const allSections = [
    { chapter: 'Dẫn nhập', fromPage: '7', pageCount: '~35 trang', pages: 35 },
    { chapter: 'Chương 1: Thông tin là gì?', fromPage: '43', pageCount: '~50 trang', pages: 50 },
    { chapter: 'Chương 2: Những câu chuyện kể — Kết nối không giới hạn', fromPage: '93', pageCount: '~50 trang', pages: 50 },
    { chapter: 'Chương 3: Tài liệu — Nanh vuốt của hổ giấy', fromPage: '143', pageCount: '~45 trang', pages: 45 },
    { chapter: 'Chương 4: Sai lầm — Ảo tưởng về sự không thể sai lầm', fromPage: '188', pageCount: '~50 trang', pages: 50 },
    { chapter: 'Chương 5: Quyết định — Lược sử về dân chủ và toàn trị', fromPage: '238', pageCount: '~50 trang', pages: 50 },
    { chapter: 'Chương 6: Những thành viên mới — Máy tính khác với máy in', fromPage: '288', pageCount: '~30 trang', pages: 30 },
    { chapter: 'Chương 7: Không ngừng nghỉ — Mạng lưới luôn vận hành', fromPage: '318', pageCount: '~25 trang', pages: 25 },
    { chapter: 'Chương 8: Có thể sai lầm — Mạng lưới thường sai', fromPage: '343', pageCount: '~25 trang', pages: 25 },
    { chapter: 'Chương 9: Dân chủ — Chúng ta còn nói chuyện được?', fromPage: '368', pageCount: '~45 trang', pages: 45 },
    { chapter: 'Chương 10: Chuyên chế — Thuật toán toàn năng?', fromPage: '413', pageCount: '~45 trang', pages: 45 },
    { chapter: 'Chương 11: Bức màn Silicon — Đế chế hay chia rẽ toàn cầu?', fromPage: '458', pageCount: '~45 trang', pages: 45 },
    { chapter: 'Lời kết', fromPage: '503', pageCount: '~30 trang', pages: 30 },
  ];

  // Distribute into weeks: 3-5 sections per week based on page count
  // Target: ~80-120 pages reading per week
  const weekPlan = [
    // Week 1: Dẫn nhập + Ch1 + Ch2 (3 sections, ~135 pages - Part I start)
    { sections: [0, 1, 2], label: 'Phần I: Dẫn nhập — Chương 2' },
    // Week 2: Ch3 + Ch4 + Ch5 (3 sections, ~145 pages - Part I finale)
    { sections: [3, 4, 5], label: 'Phần I: Chương 3 — Chương 5' },
    // Week 3: Ch6 + Ch7 + Ch8 (3 sections, ~80 pages - Part II, shorter chapters)
    { sections: [6, 7, 8], label: 'Phần II: Chương 6 — Chương 8' },
    // Week 4: NGHỈ (3 on, 1 off)
    null,
    // Week 5: Ch9 + Ch10 (2 long sections, ~90 pages - Part III start)
    { sections: [9, 10], label: 'Phần III: Chương 9 — Chương 10' },
    // Week 6: Ch11 + Lời kết + REVIEW (3 sections, ~75 pages - Wrap up)
    { sections: [11, 12], label: 'Phần III: Chương 11 — Lời kết + Tổng kết', isReviewWeek: true },
  ];

  // Build schedule
  const schedule = [];
  let currentDate = new Date(startDate);
  let weekNum = 0;

  for (const week of weekPlan) {
    weekNum++;
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;

    if (week === null) {
      // Rest week
      schedule.push({
        week: weekNum,
        date: dateStr,
        mc: '',
        sharers: [],
        isBreak: true,
        label: '🔋 TUẦN NGHỈ — Đọc trước & ôn lại'
      });
    } else {
      const sharers = week.sections.map(idx => ({
        name: '', // BĐH sẽ cập nhật sau
        chapter: allSections[idx].chapter + ` (tr.${allSections[idx].fromPage}, ${allSections[idx].pageCount})`
      }));

      schedule.push({
        week: weekNum,
        date: dateStr,
        mc: '', // BĐH sẽ cập nhật sau
        sharers,
        label: week.label,
        isReviewWeek: week.isReviewWeek || false
      });
    }

    // Next Sunday
    currentDate.setDate(currentDate.getDate() + 7);
  }

  // Calculate end date (last active week)
  const lastActiveWeek = schedule.filter(w => !w.isBreak).pop();
  const endDate = lastActiveWeek ? lastActiveWeek.date : '';

  const currentBook = {
    title: 'Nexus: Lược sử của những mạng lưới thông tin',
    author: 'Yuval Noah Harari',
    originalTitle: 'Nexus: A Brief History of Information Networks from the Stone Age to AI',
    cover: 'assets/cover-nexus.jpg',
    totalChapters: 11,
    totalPages: 552,
    startDate: '2026-05-11',
    endDate: endDate,
    publisher: 'Omega Plus & NXB Thế Giới',
    year: 2024
  };

  return { currentBook, schedule, allSections };
}

// — Zero to One Seed Data —
function getZeroToOneSeedData() {
  const startDate = '2026-07-12';

  const allSections = [
    { chapter: 'Lời mở đầu: Không đến Một', fromPage: '7', pageCount: '13 trang' },
    { chapter: '1. Thách thức của tương lai', fromPage: '11', pageCount: '9 trang' },
    { chapter: '2. Tiệc tùng thả cửa', fromPage: '20', pageCount: '15 trang' },
    { chapter: '3. Tất cả những công ty hạnh phúc đều khác biệt', fromPage: '35', pageCount: '17 trang' },
    { chapter: '4. Hệ tư tưởng cạnh tranh', fromPage: '52', pageCount: '13 trang' },
    { chapter: '5. Lợi thế của kẻ đến sau cùng', fromPage: '65', pageCount: '20 trang' },
    { chapter: '6. Bạn không phải là một tấm vé số', fromPage: '85', pageCount: '33 trang' },
    { chapter: '7. Chạy theo đồng tiền', fromPage: '118', pageCount: '14 trang' },
    { chapter: '8. Bí mật', fromPage: '132', pageCount: '20 trang' },
    { chapter: '9. Nền tảng', fromPage: '152', pageCount: '15 trang' },
    { chapter: '10. Cơ chế của mafia', fromPage: '167', pageCount: '11 trang' },
    { chapter: '11. Nếu bạn tạo ra sản phẩm, khách hàng sẽ tới?', fromPage: '178', pageCount: '21 trang' },
    { chapter: '12. Con người và máy móc', fromPage: '199', pageCount: '17 trang' },
    { chapter: '13. Xu hướng doanh nghiệp xanh', fromPage: '216', pageCount: '27 trang' },
    { chapter: '14. Nghịch lý của nhà sáng lập', fromPage: '243', pageCount: '22 trang' },
    { chapter: 'Kết luận: Đình trệ hay Khác biệt?', fromPage: '265', pageCount: '6 trang' }
  ];

  const weekPlan = [
    { sections: [0, 1, 2, 3], label: 'Lời mở đầu & Chương 1 — Chương 3' },
    { sections: [4, 5, 6], label: 'Chương 4 — Chương 6' },
    { sections: [7, 8, 9], label: 'Chương 7 — Chương 9' },
    { sections: [10, 11, 12], label: 'Chương 10 — Chương 12' },
    { sections: [13, 14, 15], label: 'Chương 13 — Kết luận' },
    { sections: [], label: 'REVIEW & TỔNG KẾT toàn bộ sách', isReviewWeek: true }
  ];

  const schedule = [];
  let currentDate = new Date(startDate);
  let weekNum = 0;

  for (const week of weekPlan) {
    weekNum++;
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;

    if (week.sections.length === 0 && !week.isReviewWeek) {
      schedule.push({
        week: weekNum,
        date: dateStr,
        mc: '',
        sharers: [],
        isBreak: true,
        label: '🔋 TUẦN NGHỈ — Đọc trước & ôn lại'
      });
    } else {
      const sharers = week.sections.map(idx => ({
        name: '',
        chapter: allSections[idx].chapter + ` (tr.${allSections[idx].fromPage}, ${allSections[idx].pageCount})`
      }));

      if (week.isReviewWeek) {
        sharers.push({
          name: '',
          chapter: 'REVIEW & TỔNG KẾT toàn bộ sách Không đến Một'
        });
      }

      schedule.push({
        week: weekNum,
        date: dateStr,
        mc: '',
        sharers,
        label: week.label,
        isReviewWeek: week.isReviewWeek || false
      });
    }

    currentDate.setDate(currentDate.getDate() + 7);
  }

  const currentBook = {
    title: 'Không đến Một: Bài học về khởi nghiệp, hay Cách xây dựng tương lai',
    author: 'Peter Thiel & Blake Masters',
    originalTitle: 'Zero to One: Notes on Startups, or How to Build the Future',
    cover: 'assets/cover-zero-to-one.png',
    totalChapters: 14,
    totalPages: 274,
    startDate: startDate,
    endDate: '2026-08-16'
  };

  return { currentBook, schedule };
}

// — Main handler —
export async function onRequestGet(context) {
  const { env } = context;
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Cache-Control': 'public, max-age=60'
  };

  try {
    // Check KV cache first
    if (env.BNB_CACHE) {
      const cached = await env.BNB_CACHE.get(CACHE_KEY, { type: 'json' });
      if (cached) {
        return new Response(JSON.stringify(cached), { headers });
      }
    }

    // Fetch CONFIG tab
    const sheetConfig = await fetchConfigTab();
    const currentBookTab = sheetConfig.currentBook || 'ZeroToOne';
    
    // Fetch current book tab
    let bookCSV, bookRows, metadata, chapters, currentBook, schedule, members;
    
    try {
      bookCSV = await fetchSheet(currentBookTab);
      bookRows = parseAllCSV(bookCSV);
      
      // First row is header: [BookName, "Từ trang", "Số trang", "Tên", "Tên nhận chương"]
      const headerRow = bookRows[0] || [];
      const bookName = headerRow[0] || currentBookTab;
      
      const parsed = parseBookTab(bookRows.slice(1)); // skip header
      metadata = parsed.metadata;
      chapters = parsed.chapters;
      
      // Check if sheet actually has chapter data (not just header + empty)
      const hasChapterData = chapters.filter(c => !c.isReview).length > 0;
      
      if (hasChapterData) {
        // Use sheet data — with Nexus/ZeroToOne defaults when metadata rows are missing
        const isZeroToOne = bookName.toLowerCase().includes('zero') || bookName.toLowerCase().includes('one');
        const bookDefaults = isZeroToOne ? {
          title: 'Không đến Một: Bài học về khởi nghiệp, hay Cách xây dựng tương lai',
          author: 'Peter Thiel & Blake Masters',
          originalTitle: 'Zero to One: Notes on Startups, or How to Build the Future',
          cover: 'assets/cover-zero-to-one.png',
          totalPages: 274
        } : {
          title: 'Nexus: Lược sử của những mạng lưới thông tin',
          author: 'Yuval Noah Harari',
          originalTitle: 'Nexus: A Brief History of Information Networks from the Stone Age to AI',
          cover: 'assets/cover-nexus.jpg',
          totalPages: 552
        };

        currentBook = {
          title: metadata._title || bookDefaults.title || bookName,
          author: metadata._author || bookDefaults.author || '',
          originalTitle: metadata._originalTitle || bookDefaults.originalTitle || '',
          cover: metadata._cover || bookDefaults.cover || 'assets/cover-nexus.jpg',
          totalChapters: chapters.filter(c => !c.isReview).length,
          totalPages: parseInt(metadata._totalPages) || bookDefaults.totalPages || 0,
          startDate: metadata._startDate || '',
          endDate: metadata._endDate || ''
        };
        schedule = buildSchedule(chapters);
        members = extractMembers(chapters);
      } else {
        // Sheet is empty — use seed data
        const isZeroToOne = currentBookTab.toLowerCase().includes('zero') || currentBookTab.toLowerCase().includes('one');
        const seed = isZeroToOne ? getZeroToOneSeedData() : getNexusSeedData();
        currentBook = seed.currentBook;
        schedule = seed.schedule;
        members = [];
      }
    } catch {
      // Sheet fetch failed — use seed data
      const isZeroToOne = currentBookTab.toLowerCase().includes('zero') || currentBookTab.toLowerCase().includes('one');
      const seed = isZeroToOne ? getZeroToOneSeedData() : getNexusSeedData();
      currentBook = seed.currentBook;
      schedule = seed.schedule;
      members = [];
    }
    
    // Fetch library (completed books)
    const library = await fetchLibrary();
    
    // Assemble full config (backward compatible)
    // Filter out any sheet config entries that look like column headers
    const validConfigKeys = ['meetLink', 'zaloGroup', 'fundBalance', 'fundIncome', 'fundExpense', 'driveLink', 'voteFormLink'];
    const config = {
      ...STATIC_CONFIG,
      ...Object.fromEntries(
        Object.entries(sheetConfig)
          .filter(([k]) => !k.startsWith('_') && k !== 'currentBook' && validConfigKeys.includes(k))
      ),
      currentBook,
      schedule,
      members,
      library,
      fund: {
        balance: parseInt(sheetConfig.fundBalance) || 2450000,
        monthlyFee: 200000,
        thisMonth: {
          income: parseInt(sheetConfig.fundIncome) || 1200000,
          expense: parseInt(sheetConfig.fundExpense) || 350000,
          details: [
            { desc: 'Thu quỹ định kỳ tháng 5', date: '05/05/2026', amount: 1200000, type: 'income' },
            { desc: 'Phạt vắng mặt không phép (2 người)', date: '02/05/2026', amount: 100000, type: 'income' },
            { desc: 'Thưởng chia sẻ xuất sắc (Tháng 4)', date: '01/05/2026', amount: 100000, type: 'expense' },
            { desc: 'Mua tài khoản Zoom Pro', date: '01/05/2026', amount: 250000, type: 'expense' }
          ]
        }
      },
      rules: [
        { icon: '🗳️', rule: 'Chọn sách bằng vote hoặc cá nhân đề cử theo tuần tự' },
        { icon: '📅', rule: 'Mỗi cuốn sách đọc trong 4 tuần, đăng ký chương cá nhân' },
        { icon: '⏱️', rule: 'Chia sẻ nội dung tối đa 10 phút/người/tuần' },
        { icon: '🎙️', rule: 'MC luân phiên mỗi tuần' },
        { icon: '📝', rule: 'Khuyến khích viết đúc kết bài học và chia sẻ lên nhóm sau mỗi buổi Meet' },
        { icon: '👥', rule: 'Nhóm 1: Bạn bè — tuân thủ kỷ luật. Nhóm 2: Cần hỗ trợ — tham gia Meet ít nhất 1 lần/tháng' }
      ],
      penalties: [
        { violation: 'Đến trễ >15\' không báo / Ngủ trong buổi', amount: '20 hít đất/squat (quay video) hoặc 20K' },
        { violation: 'Vắng không báo trước 12h / Không lý do', amount: 'Chạy 10km (24h) / 200 hít đất / 50K' },
        { violation: 'Không chuẩn bị nội dung đã đăng ký', amount: 'Chạy 10km (24h) / 200 hít đất / 50K' },
        { violation: 'Không tương tác @All / Không vote', amount: '20 hít đất/squat hoặc 20K' }
      ],
      rewards: [
        { achievement: 'Chia sẻ xuất sắc nhất tháng', reward: '100.000đ + 🏅' },
        { achievement: 'MC xuất sắc nhất quý', reward: '200.000đ' },
        { achievement: 'Tham dự 100% trong tháng', reward: 'Hoàn 50% phí' },
        { achievement: 'Streak 16 tuần liên tục', reward: '500.000đ 🔥' }
      ],
      _source: 'google-sheets',
      _cachedAt: new Date().toISOString()
    };

    // Cache in KV for 5 minutes
    if (env.BNB_CACHE) {
      await env.BNB_CACHE.put(CACHE_KEY, JSON.stringify(config), { expirationTtl: CACHE_TTL });
    }

    return new Response(JSON.stringify(config), { headers });

  } catch (error) {
    // Return error with fallback hint
    return new Response(JSON.stringify({
      error: error.message,
      _fallback: true,
      _hint: 'Frontend should fallback to data/config.json'
    }), {
      status: 500,
      headers
    });
  }
}

// — Fetch library from hardcoded data (can be moved to sheet later) —
async function fetchLibrary() {
  return [
    { title: 'Trò Chơi Vô Cực', author: 'Simon Sinek', finishedDate: '2025-02-23', rating: 4.5, topInsight: 'Người chơi vô cực không chơi để thắng mà chơi để tiếp tục cuộc chơi.' },
    { title: 'Flow — Dòng Chảy', author: 'Mihaly Csikszentmihalyi', finishedDate: '2025-04-15', rating: 4.0, topInsight: 'Trạng thái flow xuất hiện khi thử thách và kỹ năng cân bằng hoàn hảo.' },
    { title: 'Quản Lý Nghiệp', author: 'Geshe Michael Roach', finishedDate: '2025-06-20', rating: 4.5, topInsight: 'Muốn giàu có, hãy giúp người khác giàu có. Đó là quy luật nghiệp.' },
    { title: 'Súng, Vi Trùng và Thép', author: 'Jared Diamond', finishedDate: '2025-09-15', rating: 4.0, topInsight: 'Địa lý và sinh thái, chứ không phải chủng tộc, quyết định vận mệnh các nền văn minh.' },
    { title: 'The 4 Pillar Plan', author: 'Dr. Rangan Chatterjee', finishedDate: '2025-10-20', rating: 4.0, topInsight: 'Sức khỏe dựa trên 4 trụ cột: Thư giãn, Ăn uống, Vận động, Giấc ngủ.' },
    { title: 'Cuộc Chiến Vi Mạch', author: 'Chris Miller', finishedDate: '2025-11-25', rating: 4.5, topInsight: 'Chip bán dẫn là tài nguyên chiến lược quan trọng nhất thế kỷ 21.' },
    { title: 'Hồi Ký Lý Quang Diệu', author: 'Lý Quang Diệu', finishedDate: '2025-12-30', rating: 5.0, topInsight: 'Sự sống còn của một quốc gia nhỏ phụ thuộc vào kỷ luật và tầm nhìn xa của lãnh đạo.' },
    { title: 'Nhóm Chính Bắc', author: 'Bill George', finishedDate: '2026-04-26', rating: 4.5, topInsight: 'True North Groups — Xây dựng nhóm phát triển bản thân có kỷ luật.' },
    { title: 'Nexus', author: 'Yuval Noah Harari', finishedDate: '2026-06-28', rating: 4.7, topInsight: 'Thông tin không phải là sự thật, thông tin chỉ là nguyên liệu xây dựng mạng lưới kết nối.' }
  ];
}
