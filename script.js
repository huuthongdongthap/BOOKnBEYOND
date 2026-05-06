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
    document.getElementById('clubSlogan').textContent = CONFIG.slogan;
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
    const body = document.getElementById('leaderboardBody');
    const sorted = [...CONFIG.members].sort((a, b) => b.points - a.points);

    body.innerHTML = sorted.map((m, i) => {
      const rank = i + 1;
      const rankClass = rank <= 3 ? `rank-${rank}` : 'rank-other';
      const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : '';

      return `
        <tr>
          <td><span class="rank-badge ${rankClass}">${medal || rank}</span></td>
          <td>
            <span class="member-name">
              ${m.name}
              ${m.role ? `<span class="member-role">${m.role}</span>` : ''}
            </span>
          </td>
          <td class="points-cell">${m.points}</td>
          <td>${m.shares}</td>
          <td>${m.attendance}</td>
          <td class="streak-cell">${m.streak > 0 ? m.streak + ' 🔥' : '—'}</td>
        </tr>
      `;
    }).join('');
  }

  function renderFund() {
    const fund = CONFIG.fund;
    document.getElementById('fundBalance').textContent = formatVND(fund.balance);
    document.getElementById('fundIncome').textContent = '+' + formatVND(fund.thisMonth.income);
    document.getElementById('fundExpense').textContent = '-' + formatVND(fund.thisMonth.expense);

    const list = document.getElementById('fundList');
    list.innerHTML = fund.thisMonth.details.map(d => {
      const isPositive = d.amount >= 0;
      return `
        <div class="fund-item">
          <span class="fund-item-desc">${d.desc}</span>
          <span class="fund-item-amount ${isPositive ? 'positive' : 'negative'}">
            ${isPositive ? '+' : ''}${formatVND(Math.abs(d.amount))}
          </span>
        </div>
      `;
    }).join('');
  }

  function renderLibrary() {
    const grid = document.getElementById('libraryGrid');

    if (!CONFIG.library || CONFIG.library.length === 0) {
      grid.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">📚</div>
          <div class="empty-state-text">Chưa có sách nào hoàn thành. Hãy bắt đầu cuốn đầu tiên!</div>
        </div>
      `;
      return;
    }

    grid.innerHTML = CONFIG.library.map(book => `
      <div class="library-card">
        <div class="library-card-title">${book.title}</div>
        <div class="library-card-author">${book.author}</div>
        <div class="library-card-date">📅 Hoàn thành: ${formatDate(book.finishedDate)}</div>
        <div class="library-card-rating">${getStars(book.rating)} <span style="color: var(--text-muted); font-size: 0.85rem;">${book.rating}/5</span></div>
        ${book.topInsight ? `<div class="library-card-insight">"${book.topInsight}"</div>` : ''}
      </div>
    `).join('');
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
    const summary = document.getElementById('reviewSummary');
    if (!grid || !summary) return;

    try {
      const res = await fetch('/api/reviews');
      if (res.ok) {
        currentReviews = await res.json();
      }
    } catch (e) {
      console.error('Failed to load reviews:', e);
    }

    if (!currentReviews || currentReviews.length === 0) {
      grid.innerHTML = '<p style="text-align:center; color:#64748B; width:100%; grid-column: 1/-1;">Chưa có cảm nhận nào. Hãy là người đầu tiên!</p>';
      summary.innerHTML = '';
      return;
    }

    const avg = (currentReviews.reduce((sum, r) => sum + Number(r.rating), 0) / currentReviews.length).toFixed(1);
    
    summary.innerHTML = `
      <div class="rating-badge">⭐ ${avg}/5.0</div>
      <div class="review-count">Dựa trên ${currentReviews.length} bài review</div>
    `;

    grid.innerHTML = currentReviews.map(r => `
      <div class="review-card">
        <div class="review-header">
          <div class="review-avatar">${r.name.charAt(0).toUpperCase()}</div>
          <div class="review-meta">
            <h4>${r.name} <span style="font-size: 0.8em; font-weight: normal; color: var(--text-light); display: block;">đã review <em>${r.bookTitle || 'Sách Tuần Này'}</em></span></h4>
            <div class="review-stars">${'⭐'.repeat(r.rating)}${'☆'.repeat(5-r.rating)}</div>
          </div>
        </div>
        ${r.insight ? `<div class="review-insight">💡 ${r.insight}</div>` : ''}
        <p class="review-text">${r.text}</p>
        <div class="review-date">${new Date(r.date).toLocaleDateString('vi-VN')}</div>
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
