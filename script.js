/* ===========================
   Book & Beyond — Web Hub
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

  function formatDate(dateStr) {
    const d = new Date(dateStr + 'T00:00:00');
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
    const now = new Date();
    const start = new Date(book.startDate + 'T00:00:00');
    const end = new Date(book.endDate + 'T00:00:00');
    const total = end - start;
    const elapsed = now - start;
    const pct = Math.max(0, Math.min(100, Math.round((elapsed / total) * 100)));

    document.getElementById('bookDates').textContent = `${formatDate(book.startDate)} → ${formatDate(book.endDate)}`;

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

      return `
        <div class="schedule-card ${isCurrent ? 'current' : ''}" style="${isPast ? 'opacity: 0.5;' : ''}">
          <div class="schedule-card-header">
            <span class="schedule-week">Tuần ${week.week}</span>
            <span class="schedule-date">${formatDate(week.date)}</span>
          </div>
          <div class="schedule-mc">🎙️ MC: <strong>${week.mc}</strong></div>
          <div class="schedule-sharers">
            ${week.sharers.filter(s => s.name || s.chapter).map((s, i) => `
              <div class="sharer-item">
                <span class="sharer-index">${i + 1}</span>
                <div class="sharer-info">
                  <div class="sharer-name">${s.name || '—'}</div>
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
      `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent('Book & Beyond — Chia sẻ sách')}&dates=20260315T051500/20260315T071500&recur=RRULE:FREQ=WEEKLY;BYDAY=SU&details=${encodeURIComponent('Buổi chia sẻ sách hàng tuần. Link Meet: ' + CONFIG.meetLink)}`;
  }

  // ——————————————————————————
  // Init
  // ——————————————————————————
  async function init() {
    try {
      const response = await fetch('data/config.json');
      CONFIG = await response.json();
    } catch (e) {
      console.error('Failed to load config:', e);
      return;
    }

    renderHero();
    renderBook();
    renderSchedule();
    renderLeaderboard();
    renderFund();
    renderLibrary();
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
})();
