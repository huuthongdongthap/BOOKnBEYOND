import { DAYS, WEEK_THEMES } from './metahuman-curriculum.js';
import { PHASE_OVERVIEW, DAY_OUTCOMES } from './metahuman-outcomes.js';

const esc = (v) => String(v ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const state = {
  phase: 'all',
  query: '',
  showEn: true
};

function renderPhaseCards() {
  const root = document.getElementById('phase-overview-grid');
  if (!root) return;
  root.innerHTML = PHASE_OVERVIEW.map((p) => `
    <article class="phase-card" data-phase="${p.id}">
      <div class="phase-card-head">
        <span class="phase-chip">${esc(p.range)}</span>
        <span class="phase-step">Chặng ${p.id}/4</span>
      </div>
      <h3 class="serif phase-title">${esc(p.title)}</h3>
      <div class="phase-row"><strong>Tinh thần cốt lõi:</strong> ${esc(p.spirit)}</div>
      <div class="phase-row"><strong>Mục tiêu thức tỉnh:</strong> ${esc(p.goal)}</div>
      <div class="phase-row outcome-highlight"><strong>Kết quả chuyển hóa:</strong> ${esc(p.outcome)}</div>
    </article>
  `).join('');
}

function renderWeekTable() {
  const tbody = document.getElementById('week-matrix-body');
  if (!tbody) return;
  tbody.innerHTML = WEEK_THEMES.map((w) => `
    <tr>
      <td><span class="day-pill">Tuần ${w.week}</span><div class="sub-range">${esc(w.daysRange)}</div></td>
      <td><strong>${esc(w.title)}</strong></td>
      <td>${esc(w.focusPrompt)}</td>
    </tr>
  `).join('');
}

function filteredDays() {
  const q = state.query.trim().toLowerCase();
  return DAYS.filter((d) => {
    if (state.phase !== 'all' && String(d.phase) !== String(state.phase)) return false;
    if (!q) return true;
    const out = DAY_OUTCOMES[d.day] || {};
    const steps = Array.isArray(d.stepsVi) ? d.stepsVi.join(' ') : '';
    const hay = `${d.day} ${d.pageRef || ''} ${d.titleVi} ${d.axiomVi} ${d.axiomEn} ${d.metaphorVi || ''} ${d.contemplationVi || ''} ${d.practiceVi} ${steps} ${d.experienceGuideVi || ''} ${out.objectiveVi || ''} ${out.outcomeVi || ''}`.toLowerCase();
    return hay.includes(q);
  });
}

function renderDayMatrix() {
  const tbody = document.getElementById('day-matrix-body');
  const countEl = document.getElementById('day-count-label');
  if (!tbody) return;
  const rows = filteredDays();
  if (countEl) countEl.textContent = `Đang hiển thị ${rows.length} / ${DAYS.length} bài học`;

  tbody.innerHTML = rows.map((d) => {
    const out = DAY_OUTCOMES[d.day] || {};
    const dayLabel = d.day === 32 ? 'Ngày 32 · Mọi Ngày' : `Ngày ${String(d.day).padStart(2, '0')}`;
    const stepsHtml = Array.isArray(d.stepsVi) && d.stepsVi.length
      ? `<ol class="steps-ol">${d.stepsVi.map((s) => `<li>${esc(s)}</li>`).join('')}</ol>`
      : '';
    return `
      <tr class="day-row phase-border-${d.phase}">
        <td class="col-day">
          <span class="day-badge phase-bg-${d.phase}">${esc(dayLabel)}</span>
          <div class="day-phase-tag">Chặng ${d.phase} ${d.pageRef ? `· ${esc(d.pageRef)}` : ''}</div>
        </td>
        <td class="col-axiom">
          <div class="lesson-title serif">${esc(d.titleVi)}</div>
          <blockquote class="axiom-vi">“${esc(d.axiomVi)}”</blockquote>
          ${state.showEn ? `<div class="axiom-en">“${esc(d.axiomEn)}”</div>` : ''}
          ${d.metaphorVi ? `<div class="metaphor-box"><strong>📖 Ẩn dụ &amp; Ví dụ trong sách:</strong> ${esc(d.metaphorVi)}</div>` : ''}
          <div class="contemplation-text">${esc(d.contemplationVi)}</div>
        </td>
        <td class="col-objective">
          <div class="cell-label">Mục tiêu nhận thức</div>
          <p>${esc(out.objectiveVi || d.contemplationVi)}</p>
        </td>
        <td class="col-action">
          <div class="action-main"><strong>Bài tập gốc trong sách (For Today):</strong> ${esc(d.practiceVi)}</div>
          ${state.showEn && d.practiceEn ? `<div class="axiom-en" style="margin-top:4px">${esc(d.practiceEn)}</div>` : ''}
          ${stepsHtml}
          <div class="habit-tiers">
            <div class="tier-mini">⚡ <strong>Mini (1 phút):</strong> ${esc(d.miniVi)}</div>
            <div class="tier-full">🧘 <strong>Đầy đủ (5–10 phút):</strong> ${esc(d.fullVi)}</div>
          </div>
        </td>
        <td class="col-outcome">
          <div class="outcome-box">
            <strong>Kết quả chuyển hóa:</strong> ${esc(out.outcomeVi || '')}
          </div>
          ${d.experienceGuideVi ? `<div class="exp-guide-box"><strong>🔍 Ghi nhận "Your Experience":</strong> ${esc(d.experienceGuideVi)}</div>` : ''}
          <div class="prompt-box">
            <em>✍️ Câu hỏi tự vấn:</em> ${esc(d.promptVi)}
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

export function buildZaloShareText() {
  const lines = [
    '🧭 CẨM NANG 31 NGÀY THỨC TỈNH — SIÊU NHÂN LOẠI (METAHUMAN)',
    '📚 Tác giả: Deepak Chopra, M.D. | CLB Đọc Sách BooknBeyond',
    '━━━━━━━━━━━━━━━━━━━━',
    '🎯 TINH THẦN CỐT LÕI CỦA SÁCH:',
    'Không phải cố gắng "sửa chữa cái tôi" trong thực tại ảo, mà là thực hiện 31 thí nghiệm nhận thức nhỏ (1–10 phút/ngày) để lùi lại phía sau ống kính, nhận ra mình là Ý THỨC THUẦN KHIẾT — vừa say sưa thưởng thức bộ phim cuộc đời, vừa biết mình là người sáng tạo bộ phim ấy.',
    '',
    '🗺️ LỘ TRÌNH 4 GIAI ĐOẠN CHUYỂN HÓA:',
    ...PHASE_OVERVIEW.map((p) => `• ${p.title} (${p.range}):\n  - Mục tiêu: ${p.goal}\n  - Kết quả: ${p.outcome}`),
    '',
    '⚡ CÁCH THỰC HÀNH MỖI NGÀY (Hệ thống Core / Mini Habit):',
    '1️⃣ Đọc Tiên đề (Axiom) & Chiêm nghiệm trong ngày.',
    '2️⃣ Chọn 1 trong 2 mức: Mức Mini (1 phút cho ngày bận rộn) hoặc Mức Đầy đủ (5–10 phút trải nghiệm sâu).',
    '3️⃣ Ghi lại vài dòng vào mục "Trải nghiệm của bạn (Your Experience)".',
    '',
    '🔗 Xem Bảng Tổng Quan 31 Ngày chi tiết: https://book-and-beyond.pages.dev/slides-metahuman-31-days.html'
  ];
  return lines.join('\n');
}

function initEvents() {
  document.querySelectorAll('[data-phase-filter]').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.phase = btn.dataset.phaseFilter;
      document.querySelectorAll('[data-phase-filter]').forEach((b) => b.classList.toggle('active', b === btn));
      renderDayMatrix();
    });
  });

  const searchInput = document.getElementById('day-search');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.query = e.target.value || '';
      renderDayMatrix();
    });
  }

  const toggleEn = document.getElementById('toggle-en');
  if (toggleEn) {
    toggleEn.addEventListener('click', () => {
      state.showEn = !state.showEn;
      toggleEn.textContent = state.showEn ? '🌐 Song ngữ VI/EN: Bật' : '🌐 Song ngữ VI/EN: Tắt';
      renderDayMatrix();
    });
  }

  const printBtn = document.getElementById('btn-print');
  if (printBtn) printBtn.addEventListener('click', () => window.print());

  const copyBtn = document.getElementById('btn-copy-zalo');
  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      const text = buildZaloShareText();
      await navigator.clipboard?.writeText(text);
      const orig = copyBtn.textContent;
      copyBtn.textContent = '✅ Đã copy bản tóm tắt gửi Zalo!';
      setTimeout(() => { copyBtn.textContent = orig; }, 2600);
    });
  }
}

if (typeof document !== 'undefined') {
  renderPhaseCards();
  renderWeekTable();
  renderDayMatrix();
  initEvents();
}
