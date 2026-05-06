let configData = null;

let dataSourceLabel = 'đang tải...';

async function loadData() {
    try {
        const apiRes = await fetch('/api/sheet-data');
        if (apiRes.ok) {
            const data = await apiRes.json();
            if (!data.error && !data._fallback) {
                configData = data;
                dataSourceLabel = '✅ Google Sheets (live)';
                if (data._cachedAt) {
                    const t = new Date(data._cachedAt);
                    dataSourceLabel += ` · cached ${t.toLocaleTimeString('vi-VN')}`;
                }
                updateDataSourceUI();
                initSelect();
                return;
            }
        }
        throw new Error('API unavailable');
    } catch (apiErr) {
        console.warn('[Generator] ⚠️ Falling back to config.json:', apiErr.message);
        try {
            const res = await fetch('data/config.json');
            configData = await res.json();
            dataSourceLabel = '📄 config.json (offline)';
            updateDataSourceUI();
            initSelect();
        } catch(e) {
            console.error(e);
            dataSourceLabel = '❌ Không tải được dữ liệu';
            updateDataSourceUI();
            document.getElementById('announcementText').value = "Lỗi tải dữ liệu: " + e.message;
        }
    }
}

function updateDataSourceUI() {
    const el = document.getElementById('dataSource');
    if (el) el.textContent = '📡 Nguồn: ' + dataSourceLabel;
}

document.addEventListener('DOMContentLoaded', loadData);

function capitalizeViName(name) {
    if (!name) return '';
    return name.trim().split(/\s+/).map(word => {
        if (!word) return '';
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }).join(' ');
}

function formatDateLong(dateStr) {
    if (!dateStr) return 'Đang cập nhật';
    const d = new Date(dateStr + 'T00:00:00');
    if (isNaN(d.getTime())) return 'Đang cập nhật';
    const days = ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
    return `${days[d.getDay()]}, ${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`;
}

function initSelect() {
    const s = document.getElementById('weekSelect');
    s.innerHTML = '<option value="">-- Chọn Tuần Chia Sẻ --</option>';
    configData.schedule.forEach((w, idx) => {
        // Skip break weeks
        if (w.isBreak) return;
        const opt = document.createElement('option');
        opt.value = idx;
        const label = w.label ? ` — ${w.label}` : '';
        opt.textContent = `Tuần ${w.week} - ${formatDateLong(w.date)}${label}`;
        s.appendChild(opt);
    });
    s.addEventListener('change', (e) => {
        if(e.target.value === "") return;
        renderWeek(parseInt(e.target.value));
    });
}

function renderWeek(idx) {
    const weekData = configData.schedule[idx];
    const book = configData.currentBook;
    
    // 1. TEXT ANNOUNCEMENT
    let sharersText = "";
    weekData.sharers.forEach((sh, i) => {
        const name = capitalizeViName(sh.name) || '❓ Chờ đăng ký';
        sharersText += `${i+1}️⃣ Phần ${i+1} (${name}): ${sh.chapter}\n`;
    });
    const mcName = capitalizeViName(weekData.mc) || '❓ Chưa phân công';
    const textOut = `🧭 THÔNG BÁO MEET TUẦN ${weekData.week}: ${book.title.toUpperCase()} 🧭

Chào cả nhà ${configData.clubName}, 
Tuần này chúng ta sẽ tiếp tục khám phá cuốn "${book.title}" (${book.originalTitle}). Hãy chuẩn bị sẵn sàng cho những chia sẻ thú vị!

📅 Thời gian: ${configData.meetTime.start} – ${configData.meetTime.end} | ${formatDateLong(weekData.date)}
📍 Địa điểm: Google Meet (${configData.meetLink})
📚 Sách đọc: ${book.title} (${book.author})

🎙️ MC dẫn chương trình: ${mcName}

🌟 NỘI DUNG CHIA SẺ TUẦN ${weekData.week}:
${sharersText}
💡 Lưu ý chung:
- Các sharer nhớ chuẩn bị nội dung thật cô đọng (tối đa 10 phút/người).
- Mọi người vào sớm 5 phút để ổn định đường truyền và kịp "check-in".
- Quy tắc Kỷ Luật: Đến trễ, vắng không báo trước thì tiến hành áp dụng quy định tự kỷ luật nhé! 🏃‍♂️💸

Đọc để biết · Chia sẻ để nhớ · Ứng dụng để chuyển hóa.
Hẹn gặp đại gia đình vào sáng Chủ Nhật đầy năng lượng! ☕✨`;
    
    document.getElementById('announcementText').value = textOut;
    
    // 2. POSTER DOM UPDATE
    document.getElementById('posClubName').textContent = configData.clubName;
    document.getElementById('posWeekCount').textContent = `TUẦN ${weekData.week}`;
    document.getElementById('posDate').textContent = formatDateLong(weekData.date);
    document.getElementById('posTime').textContent = `${configData.meetTime.start} – ${configData.meetTime.end}`;
    
    document.getElementById('posBookTitle').textContent = book.title;
    document.getElementById('posBookAuthor').textContent = book.author;
    document.getElementById('posBookOriginal').textContent = book.originalTitle;
    document.getElementById('posMc').textContent = weekData.mc;
    
    // Update QR image conditionally, fallback to week2 if weekX doesn't exist
    const posQr = document.getElementById('posQr');
    posQr.onerror = () => { 
        posQr.onerror = null; // prevent infinite loop
        posQr.src = 'assets/qr-meet.svg'; 
    };
    posQr.src = `assets/qr-meet-week${weekData.week}.svg`;
    
    // Combine speakers if the same person speaks consecutively to fit 3-col layout
    const collapsed = [];
    weekData.sharers.forEach(sh => {
        if(!sh.name) return;
        if(collapsed.length > 0 && collapsed[collapsed.length - 1].name === sh.name) {
            collapsed[collapsed.length - 1].chapter += " & " + sh.chapter;
        } else {
            collapsed.push({ ...sh });
        }
    });
    
    const sg = document.getElementById('posSpeakers');
    sg.innerHTML = collapsed.map((sh, index) => {
        // Simple extraction of pages if available (e.g. "(tr.191-206, 17 trang)")
        const pageMatch = sh.chapter.match(/\((tr\..+?)\)/);
        const pagesText = pageMatch ? `<div class="speaker-pages">${pageMatch[1]}</div>` : '';
        const chapterClean = sh.chapter.replace(/\(tr\..+?\)/g, "").trim();
        
        return `
        <div class="speaker-card">
          <div class="speaker-part">Phần ${index+1}</div>
          <div class="speaker-name">${sh.name}</div>
          <div class="speaker-chapter" style="font-size:15px; margin-bottom: 20px;">${chapterClean}</div>
          ${pagesText}
        </div>
        `;
    }).join('');
}

function copyAnnouncement() {
    const t = document.getElementById('announcementText');
    t.select();
    document.execCommand('copy');
    showMsg('Đã copy nội dung!');
}

async function downloadPoster() {
    const p = document.getElementById('posterElement');
    showMsg('Đang tạo ảnh Poster...');

    try {
        const dataUrl = await htmlToImage.toPng(p, {
            pixelRatio: 2,
            backgroundColor: '#F8FAFC',
            cacheBust: true
        });
        
        const a = document.createElement('a');
        a.href = dataUrl;
        const sIndex = document.getElementById('weekSelect').value;
        const w = configData.schedule[sIndex];
        a.download = `BOOKnBEYOND_Poster_Tuan_${w ? w.week : 'X'}.png`;
        a.click();
        showMsg('Tải xuống thành công!');
    } catch (err) {
        console.error(err);
        showMsg('Lỗi tạo ảnh: ' + err.message);
    }
}

function showMsg(m) {
    const el = document.getElementById('statusMsg');
    el.textContent = m;
    el.style.display = 'block';
    setTimeout(() => { el.style.display = 'none'; }, 3000);
}

async function refreshData() {
    showMsg('🔄 Đang xóa cache và tải data mới...');
    try {
        // Bust the KV cache
        await fetch('/api/cache-bust');
        // Reload data
        await loadData();
        // Re-render current week if selected
        const weekSelect = document.getElementById('weekSelect');
        if (weekSelect.value !== '') {
            renderWeek(parseInt(weekSelect.value));
        }
        showMsg('✅ Đã cập nhật data từ Google Sheet!');
    } catch (e) {
        showMsg('❌ Lỗi refresh: ' + e.message);
    }
}

// Share poster via Web Share API (mobile)
async function sharePoster() {
    const p = document.getElementById('posterElement');
    showMsg('Đang tạo ảnh để chia sẻ...');

    try {
        const blob = await htmlToImage.toBlob(p, {
            pixelRatio: 2,
            backgroundColor: '#F8FAFC',
            cacheBust: true
        });

        const sIndex = document.getElementById('weekSelect').value;
        const w = configData.schedule[sIndex];
        const fileName = `BOOKnBEYOND_Poster_Tuan_${w ? w.week : 'X'}.png`;
        const file = new File([blob], fileName, { type: 'image/png' });

        if (navigator.share && navigator.canShare({ files: [file] })) {
            await navigator.share({
                title: `BOOKnBEYOND - Tuần ${w ? w.week : '?'}`,
                text: document.getElementById('announcementText').value.substring(0, 200),
                files: [file]
            });
            showMsg('✅ Đã chia sẻ!');
        } else {
            showMsg('❌ Trình duyệt không hỗ trợ Share API. Vui lòng Tải Poster thay thế.');
        }
    } catch (err) {
        console.error(err);
        showMsg('Lỗi tạo ảnh: ' + err.message);
    }
}
