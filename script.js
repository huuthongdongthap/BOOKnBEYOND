/* ===========================
   BooknBeyond — Web Hub
   Script
   =========================== */

(function () {
  'use strict';

  let CONFIG = null;

  // ——————————————————————————
  // Utils
  // ——————————————————————————
  function formatVND(amount) {
    return new Intl.NumberFormat('vi-VN').format(amount) + 'đ';
  }

  // Capitalize Vietnamese name — e.g. "thanh" → "Thanh", "nguyen van a" → "Nguyen Van A"
  function capitalizeViName(name) {
    if (!name) return '';
    return name.trim().split(/\s+/).map(word => {
      if (!word) return '';
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }).join(' ');
  }

  function formatDate(dateStr) {
    if (!dateStr) return 'Đang cập nhật';
    const d = new Date(dateStr + 'T00:00:00');
    if (isNaN(d.getTime())) return 'Đang cập nhật';
    const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    return `${days[d.getDay()]}, ${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  }

  function getStars(rating) {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5 ? 1 : 0;
    const empty = 5 - full - half;
    return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty);
  }

  // ——————————————————————————
  // Countdown Timer
  // ——————————————————————————
  function getNextSunday515() {
    const now = new Date();
    const next = new Date(now);

    // Find next Sunday
    const dayOfWeek = now.getDay(); // 0 = Sunday
    let daysUntilSunday = (7 - dayOfWeek) % 7;

    // If it's Sunday but past 07:15, go to next Sunday
    if (daysUntilSunday === 0) {
      const cutoff = new Date(now);
      cutoff.setHours(7, 15, 0, 0);
      if (now > cutoff) daysUntilSunday = 7;
    }

    next.setDate(now.getDate() + daysUntilSunday);
    next.setHours(5, 15, 0, 0);
    return next;
  }

  function updateCountdown() {
    const target = getNextSunday515();
    const now = new Date();
    let diff = target - now;

    if (diff < 0) diff = 0;

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById('days').textContent = String(d).padStart(2, '0');
    document.getElementById('hours').textContent = String(h).padStart(2, '0');
    document.getElementById('minutes').textContent = String(m).padStart(2, '0');
    document.getElementById('seconds').textContent = String(s).padStart(2, '0');
  }

  // ——————————————————————————
  // Navigation
  // ——————————————————————————
  function initNav() {
    const toggle = document.getElementById('navToggle');
    const links = document.getElementById('navLinks');
    const navbar = document.getElementById('navbar');

    toggle.addEventListener('click', () => {
      toggle.classList.toggle('active');
      links.classList.toggle('open');
    });

    // Close menu on link click
    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        toggle.classList.remove('active');
        links.classList.remove('open');
      });
    });

    // Scroll effect
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    });

    // Active link on scroll
    const sections = document.querySelectorAll('.section, .hero');
    window.addEventListener('scroll', () => {
      let current = '';
      sections.forEach(section => {
        const top = section.offsetTop - 100;
        if (window.scrollY >= top) current = section.getAttribute('id');
      });
      links.querySelectorAll('a').forEach(a => {
        a.classList.remove('active');
        if (a.getAttribute('href') === '#' + current) a.classList.add('active');
      });
    });
  }

  // ——————————————————————————
  // Scroll Animations
  // ——————————————————————————
  function initAnimations() {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    document.querySelectorAll('.section-header, .book-card, .schedule-card, .fund-overview, .fund-details, .library-card, .rules-grid, .links-grid').forEach(el => {
      el.classList.add('fade-in');
      observer.observe(el);
    });
  }

  // ——————————————————————————
  // Render Functions
  // ——————————————————————————
  function renderHero() {
    document.getElementById('clubName').textContent = CONFIG.clubName;
    // Removed document.getElementById('clubSlogan').textContent = CONFIG.slogan;
    document.getElementById('meetBtn').href = CONFIG.meetLink;
  }

  function renderBook() {
    const book = CONFIG.currentBook;
    document.getElementById('bookTitle').textContent = book.title;
    document.getElementById('bookAuthor').textContent = book.author;
    document.getElementById('bookOriginal').textContent = book.originalTitle ? `Original: ${book.originalTitle}` : '';
    document.getElementById('bookCover').style.backgroundImage = `url(${book.cover})`;
    document.getElementById('registerBtn').href = CONFIG.registerFormLink;

    // Calculate progress based on schedule
    let pct = 0;
    if (book.startDate && book.endDate) {
      const now = new Date();
      const start = new Date(book.startDate + 'T00:00:00');
      const end = new Date(book.endDate + 'T00:00:00');
      const total = end - start;
      const elapsed = now - start;
      if (total > 0 && !isNaN(total)) {
        pct = Math.max(0, Math.min(100, Math.round((elapsed / total) * 100)));
      }
    }

    document.getElementById('bookDates').textContent = 
      (!book.startDate && !book.endDate) ? 'Thời gian đọc: Đang cập nhật' : `${formatDate(book.startDate)} → ${formatDate(book.endDate)}`;

    // Animate progress
    setTimeout(() => {
      document.getElementById('bookProgress').style.width = pct + '%';
      document.getElementById('bookProgressText').textContent = pct + '%';
    }, 500);
  }

  function renderSchedule() {
    const grid = document.getElementById('scheduleGrid');
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    grid.innerHTML = CONFIG.schedule.map(week => {
      const weekDate = new Date(week.date + 'T00:00:00');
      const nextWeek = new Date(weekDate);
      nextWeek.setDate(nextWeek.getDate() + 7);
      const isCurrent = now >= weekDate && now < nextWeek;
      const isPast = now >= nextWeek;

      // Break week (tuần nghỉ)
      if (week.isBreak) {
        return `
          <div class="schedule-card schedule-break ${isCurrent ? 'current' : ''}" style="${isPast ? 'opacity: 0.4;' : ''}">
            <div class="schedule-card-header">
              <span class="schedule-week">Tuần ${week.week}</span>
              <span class="schedule-date">${formatDate(week.date)}</span>
            </div>
            <div style="text-align:center; padding: 20px 0;">
              <div style="font-size: 32px; margin-bottom: 8px;">🔋</div>
              <div style="color: var(--amber); font-weight: 600;">TUẦN NGHỈ</div>
              <div style="color: var(--text-muted); font-size: 14px; margin-top: 4px;">Đọc trước & ôn lại</div>
            </div>
          </div>
        `;
      }

      // Active week
      const mcDisplay = capitalizeViName(week.mc) || '<span style="color:var(--text-muted); font-style:italic;">Chưa phân công</span>';
      const labelHtml = week.label ? `<div style="color: var(--amber); font-size: 12px; font-weight: 600; letter-spacing: 0.5px; margin-top: 4px;">${week.label}</div>` : '';

      return `
        <div class="schedule-card ${isCurrent ? 'current' : ''}" style="${isPast ? 'opacity: 0.5;' : ''}">
          <div class="schedule-card-header">
            <span class="schedule-week">Tuần ${week.week}</span>
            <span class="schedule-date">${formatDate(week.date)}</span>
          </div>
          ${labelHtml}
          <div class="schedule-mc">🎙️ MC: <strong>${mcDisplay}</strong></div>
          <div class="schedule-sharers">
            ${week.sharers.filter(s => s.name || s.chapter).map((s, i) => `
              <div class="sharer-item">
                <span class="sharer-index">${i + 1}</span>
                <div class="sharer-info">
                  <div class="sharer-name">${capitalizeViName(s.name) || '<span style="color:var(--text-muted); font-style:italic;">Chờ đăng ký</span>'}</div>
                  <div class="sharer-chapter">${s.chapter}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }).join('');
  }

  function renderLeaderboard() {
    const topContainer = document.getElementById('leaderboardTop');
    const listContainer = document.getElementById('leaderboardList');
    if (!topContainer || !listContainer) return;

    if (!CONFIG.members || CONFIG.members.length === 0) {
      topContainer.innerHTML = '';
      listContainer.innerHTML = '<div class="empty-state">Tuần đầu tiên — bảng còn trống, ai sẽ chia sẻ trước?</div>';
      return;
    }

    const sorted = [...CONFIG.members].sort((a, b) => b.points - a.points);
    const top3 = sorted.slice(0, 3);
    const others = sorted.slice(3);

    // Reorder Top 3 for visual display: #2, #1, #3
    const displayTop3 = [];
    if (top3[1]) displayTop3.push({ ...top3[1], rank: 2 });
    if (top3[0]) displayTop3.push({ ...top3[0], rank: 1 });
    if (top3[2]) displayTop3.push({ ...top3[2], rank: 3 });

    topContainer.innerHTML = displayTop3.map(m => {
      const isTop1 = m.rank === 1;
      const streakDots = Array.from({length: Math.min(m.streak, 5)}).map((_, i) => 
        `<span class="streak-dot" style="opacity: ${0.4 + (i * 0.15)}"></span>`
      ).join('');
      
      return `
        <div class="lb-top-card rank-${m.rank}">
          <div class="lb-avatar">${m.name.charAt(0).toUpperCase()}</div>
          <div class="lb-name">${m.name}</div>
          <div class="lb-points">${m.points} điểm</div>
          ${m.streak > 0 ? `<div class="lb-streak" title="${m.streak} tuần liên tiếp">${streakDots} <span style="font-size:10px; margin-left:4px;">${m.streak}</span></div>` : ''}
        </div>
      `;
    }).join('');

    const maxPoints = others.length > 0 ? others[0].points : 1;

    listContainer.innerHTML = others.map((m, i) => {
      const rank = i + 4;
      const pct = Math.max(5, Math.round((m.points / maxPoints) * 100));
      return `
        <div class="lb-list-item">
          <div class="lb-list-progress" style="width: ${pct}%"></div>
          <div class="lb-list-content">
            <span class="lb-rank">${rank}</span>
            <span class="lb-name">${m.name}</span>
            <span class="lb-points">${m.points} đ</span>
          </div>
        </div>
      `;
    }).join('');
  }

  function renderFund() {
    const fund = CONFIG.fund;
    if(!fund) return;
    
    document.getElementById('fundBalance').textContent = formatVND(fund.balance);
    const incEl = document.getElementById('fundIncome');
    const expEl = document.getElementById('fundExpense');
    if(incEl) incEl.textContent = formatVND(fund.thisMonth.income);
    if(expEl) expEl.textContent = formatVND(fund.thisMonth.expense);

    // Donut chart logic
    const donut = document.getElementById('fundDonut');
    if (donut) {
      const total = fund.thisMonth.income + fund.thisMonth.expense;
      if (total > 0) {
        const incPct = Math.round((fund.thisMonth.income / total) * 100);
        donut.style.background = `conic-gradient(var(--green) 0% ${incPct}%, var(--red) ${incPct}% 100%)`;
      } else {
        donut.style.background = `var(--border-light)`;
      }
    }

    const list = document.getElementById('fundList');
    if (!list) return;
    
    if (fund.thisMonth.details.length === 0) {
      list.innerHTML = '<div class="empty-state">Chưa có thu chi tháng này.</div>';
      return;
    }

    list.innerHTML = fund.thisMonth.details.map(d => {
      const isPositive = d.amount >= 0;
      return `
        <div class="fund-timeline-item">
          <div class="fund-timeline-icon ${isPositive ? 'income' : 'expense'}">
            ${isPositive ? '↓' : '↑'}
          </div>
          <div class="fund-timeline-content">
            <div class="fund-timeline-desc">${d.desc}</div>
            <div class="fund-timeline-date">${d.date || 'Tháng này'}</div>
          </div>
          <div class="fund-timeline-amount ${isPositive ? 'positive' : 'negative'}">
            ${isPositive ? '+' : '-'}${formatVND(Math.abs(d.amount))}
          </div>
        </div>
      `;
    }).join('');
  }

  function renderLibrary() {
    const grid = document.getElementById('libraryGrid');
    if (!grid) return;

    if (!CONFIG.library || CONFIG.library.length === 0) {
      grid.innerHTML = '<div class="empty-state">Chưa có cuốn sách nào được hoàn thành. Di sản bắt đầu từ hôm nay.</div>';
      return;
    }

    // Colors for spine gradient
    const colors = [
      ['#0f172a', '#1e293b'],
      ['#064e3b', '#047857'],
      ['#451a03', '#78350f'],
      ['#312e81', '#4338ca'],
      ['#831843', '#be185d'],
      ['#1c1917', '#44403c']
    ];

    let currentMonthYear = '';
    let html = '';

    CONFIG.library.forEach((book, i) => {
      const date = new Date(book.finishedDate + 'T00:00:00');
      const monthYear = !isNaN(date.getTime()) ? `Tháng ${date.getMonth() + 1}, ${date.getFullYear()}` : 'Chưa rõ';
      
      // Removed month marker to keep spines in a continuous horizontal shelf

      const colorPair = colors[i % colors.length];
      const hWidth = Math.floor(Math.random() * 20) + 50; // 50px - 70px

      html += `
        <div class="book-spine-group">
          <div class="book-spine" style="width: ${hWidth}px; background: linear-gradient(180deg, ${colorPair[0]}, ${colorPair[1]});">
            <div class="spine-content">
              <span class="spine-title">${book.title}</span>
              <span class="spine-author">${book.author}</span>
            </div>
          </div>
          <div class="book-spine-tooltip">
            <strong>${book.title}</strong>
            <div style="font-size:0.8rem; margin:4px 0; color:var(--gold);">${getStars(book.rating)}</div>
            ${book.topInsight ? `<div style="font-style:italic; font-size:0.85rem; color:var(--text-secondary); margin-top:8px;">"${book.topInsight}"</div>` : ''}
          </div>
        </div>
      `;
    });

    grid.innerHTML = html;

    // View Toggle
    const btnSpine = document.getElementById('btnSpineView');
    const btnGrid = document.getElementById('btnGridView');
    if (btnSpine && btnGrid) {
      btnSpine.addEventListener('click', () => {
        btnSpine.classList.add('active');
        btnGrid.classList.remove('active');
        grid.classList.add('spine-view');
        grid.classList.remove('grid-view');
      });
      btnGrid.addEventListener('click', () => {
        btnGrid.classList.add('active');
        btnSpine.classList.remove('active');
        grid.classList.add('grid-view');
        grid.classList.remove('spine-view');
      });
    }
  }

  function renderRules() {
    const rulesList = document.getElementById('rulesList');
    rulesList.innerHTML = CONFIG.rules.map(r => `
      <div class="rule-item">
        <span class="rule-icon">${r.icon}</span>
        <span>${r.rule}</span>
      </div>
    `).join('');

    const penaltiesList = document.getElementById('penaltiesList');
    penaltiesList.innerHTML = CONFIG.penalties.map(p => `
      <div class="rp-item">
        <span class="rp-item-desc">${p.violation}</span>
        <span class="rp-item-value">${p.amount}</span>
      </div>
    `).join('');

    const rewardsList = document.getElementById('rewardsList');
    rewardsList.innerHTML = CONFIG.rewards.map(r => `
      <div class="rp-item">
        <span class="rp-item-desc">${r.achievement}</span>
        <span class="rp-item-value">${r.reward}</span>
      </div>
    `).join('');
  }

  function renderLinks() {
    document.getElementById('linkMeet').href = CONFIG.meetLink;
    document.getElementById('linkRegister').href = CONFIG.registerFormLink || CONFIG.sheetsLink || '#';
    document.getElementById('linkVote').href = CONFIG.voteFormLink;
    document.getElementById('linkDrive').href = CONFIG.driveLink;
    document.getElementById('linkZalo').href = CONFIG.zaloGroupLink;
    // Calendar link — Google Calendar event creation
    document.getElementById('linkCalendar').href =
      `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(CONFIG.clubName + ' — Chia sẻ sách')}&dates=20260315T051500/20260315T071500&recur=RRULE:FREQ=WEEKLY;BYDAY=SU&details=${encodeURIComponent('Buổi chia sẻ sách hàng tuần. Link Meet: ' + CONFIG.meetLink)}`;
  }

  // ——————————————————————————
  // Init
  // ——————————————————————————
  async function init() {
    // Try live Google Sheets API first, fallback to static config.json
    try {
      const apiResponse = await fetch('/api/sheet-data');
      if (apiResponse.ok) {
        const data = await apiResponse.json();
        if (!data.error && !data._fallback) {
          CONFIG = data;
          console.log('[BnB] ✅ Loaded from Google Sheets API', data._cachedAt || '');
        } else {
          throw new Error(data.error || 'API returned fallback flag');
        }
      } else {
        throw new Error(`API returned ${apiResponse.status}`);
      }
    } catch (apiErr) {
      console.warn('[BnB] ⚠️ API unavailable, falling back to config.json:', apiErr.message);
      try {
        const response = await fetch('data/config.json');
        CONFIG = await response.json();
        console.log('[BnB] 📄 Loaded from static config.json');
      } catch (e) {
        console.error('[BnB] ❌ Failed to load any config:', e);
        return;
      }
    }

    renderHero();
    renderBook();
    renderSchedule();
    renderLeaderboard();
    renderFund();
    renderLibrary();
    renderReviews();
    renderRules();
    renderLinks();

    initNav();
    updateCountdown();
    setInterval(updateCountdown, 1000);

    // Delay animations init to let content render
    requestAnimationFrame(() => {
      initAnimations();
    });
  }

  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  // ——————————————————————————
  // Reviews Logic
  // ——————————————————————————
  let currentReviews = [];
  
  async function renderReviews() {
    const grid = document.getElementById('reviewGrid');
    if (!grid) return;

    try {
      const res = await fetch('/api/reviews');
      if (res.ok) {
        currentReviews = await res.json();
      }
    } catch (e) {
      console.error('Failed to load reviews:', e);
    }

    if (!currentReviews || currentReviews.length === 0) {
      grid.innerHTML = '<div class="empty-state" style="grid-column: 1/-1;">Một cuốn sách chưa có dòng review nào. Bạn sẽ là người mở đầu?</div>';
      return;
    }

    grid.innerHTML = currentReviews.map(r => `
      <div class="review-quote-card">
        <div class="quote-mark">“</div>
        <p class="review-text">${r.text.replace(/\n/g, '<br>')}</p>
        <div class="review-divider"></div>
        <div class="review-author">
          <strong>— ${r.name}</strong>, về <cite>${r.bookTitle || 'Sách Tuần Này'}</cite>
        </div>
      </div>
    `).join('');
  }

  // Bind functions to window so inline HTML onclick can see them
  window.openReviewModal = () => {
    const modal = document.getElementById('reviewModal');
    if (modal) {
      const sel = document.getElementById('reviewBookSelect');
      const currentBook = CONFIG?.book?.title || '';
      
      // Try to pre-select current book
      const match = [...sel.options].find(o => o.value === currentBook);
      if (match) {
        sel.value = currentBook;
      } else {
        sel.value = '';
      }
      document.getElementById('reviewBookCustom').style.display = 'none';
      modal.classList.add('active');
    }
  };

  window.toggleCustomBook = () => {
    const sel = document.getElementById('reviewBookSelect');
    const custom = document.getElementById('reviewBookCustom');
    if (sel.value === '_other') {
      custom.style.display = 'block';
      custom.required = true;
      custom.focus();
    } else {
      custom.style.display = 'none';
      custom.required = false;
      custom.value = '';
    }
  };

  window.closeReviewModal = () => {
    const modal = document.getElementById('reviewModal');
    if (modal) modal.classList.remove('active');
    document.getElementById('reviewOutput').style.display = 'none';
    document.getElementById('reviewForm').style.display = 'block';
    document.getElementById('reviewForm').reset();
    document.getElementById('reviewBookCustom').style.display = 'none';
    document.getElementById('reviewBookCustom').required = false;
    document.querySelectorAll('.star-btn').forEach(b => {
      b.classList.remove('active');
      b.textContent = '☆';
    });
    document.getElementById('reviewRating').value = '0';
  };

  window.submitReview = async (e) => {
    e.preventDefault();
    const sel = document.getElementById('reviewBookSelect');
    const bookTitle = sel.value === '_other' 
      ? document.getElementById('reviewBookCustom').value 
      : sel.value;
    if (!bookTitle) {
      alert('Vui lòng chọn tên sách!');
      return false;
    }
    const name = document.getElementById('reviewName').value;
    const rating = document.getElementById('reviewRating').value;
    const insight = document.getElementById('reviewInsight').value;
    const text = document.getElementById('reviewText').value;

    if (rating === '0') {
      alert('Vui lòng chọn số sao đánh giá!');
      return false;
    }

    const btn = e.target.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    btn.innerHTML = '⏳ Đang lưu...';
    btn.disabled = true;

    try {
      const payload = { name, rating: Number(rating), insight, text, bookTitle };
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        // Render formatted text for copy
        const formatted = `[REVIEW] ${bookTitle}
⭐ Đánh giá: ${rating}/5
👤 Người review: ${name}
💡 Insight: ${insight || 'Không có'}

📝 Cảm nhận:
${text}

---
Tham gia BOOKnBEYOND: https://zalo.me/g/ukcaaq228`;

        document.getElementById('reviewOutputText').value = formatted;
        document.getElementById('reviewForm').style.display = 'none';
        document.getElementById('reviewOutput').style.display = 'block';
        
        // Try auto-copy
        try {
          await navigator.clipboard.writeText(formatted);
        } catch (err) {
          console.warn('Auto copy failed', err);
        }

        // Refresh grid
        renderReviews();
      } else {
        throw new Error('Lỗi từ server');
      }
    } catch (err) {
      alert('Đã có lỗi xảy ra: ' + err.message);
    } finally {
      btn.innerHTML = originalText;
      btn.disabled = false;
    }

    return false;
  };

  window.copyReviewText = () => {
    const text = document.getElementById('reviewOutputText').value;
    navigator.clipboard.writeText(text).then(() => {
      alert('Đã copy!');
    });
  };

  // Setup Star Rating logic
  const stars = document.querySelectorAll('.star-btn');
  const ratingInput = document.getElementById('reviewRating');
  stars.forEach(star => {
    star.addEventListener('click', () => {
      const val = star.getAttribute('data-value');
      ratingInput.value = val;
      stars.forEach(s => {
        if (s.getAttribute('data-value') <= val) {
          s.classList.add('active');
          s.textContent = '⭐';
        } else {
          s.classList.remove('active');
          s.textContent = '☆';
        }
      });
    });
  });

})();
