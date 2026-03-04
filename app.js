// 1. ЗВУКОВИЙ ДВИГУН
const aurumSounds = {
    coin: new Audio('https://cdn.pixabay.com/audio/2021/08/04/audio_37022066d4.mp3'),
    click: new Audio('https://cdn.pixabay.com/audio/2022/03/15/audio_7838382e79.mp3'),
    radar: new Audio('https://www.soundjay.com/buttons/sounds/button-20.mp3')
};

function playSound(type) {
    if (aurumSounds[type]) {
        aurumSounds[type].currentTime = 0;
        aurumSounds[type].volume = 0.3;
        aurumSounds[type].play().catch(() => {});
    }
}

// 2. PRELOADER (ЗАВАНТАЖЕННЯ)
window.onload = () => {
    const progress = document.querySelector('.loader-progress');
    const status = document.getElementById('loader-status');
    let width = 0;

    const loaderInterval = setInterval(() => {
        if (width >= 100) {
            clearInterval(loaderInterval);
            setTimeout(() => {
                document.getElementById('preloader').style.opacity = '0';
                document.body.style.overflow = 'auto';
                setTimeout(() => document.getElementById('preloader').style.display = 'none', 800);
            }, 500);
        } else {
            width += Math.random() * 10;
            if (width > 100) width = 100;
            progress.style.width = width + '%';
            if (width > 40) status.innerText = "З'єднання з Cloud-сервером...";
            if (width > 80) status.innerText = "Отримання RTP даних...";
        }
    }, 100);
};

// 3. ДАНІ ТА КОНТЕНТ
const vipGames = [
    { name: "Gates of Olympus", rtp: 98.6, icon: "fa-bolt" },
    { name: "Sweet Bonanza", rtp: 97.4, icon: "fa-candy-cane" },
    { name: "Sugar Rush", rtp: 99.1, icon: "fa-ice-cream" },
    { name: "The Dog House", rtp: 96.8, icon: "fa-dog" },
    { name: "Wolf Gold", rtp: 97.2, icon: "fa-wolf-pack-battalion" },
    { name: "Big Bass Splash", rtp: 98.9, icon: "fa-fish" }
];

let isFiltered = false;

function renderGames(list) {
    return list.map(game => `
        <div class="game-card">
            <div class="rtp-indicator">RTP ${game.rtp}%</div>
            <i class="fas ${game.icon} game-icon"></i>
            <h3>${game.name}</h3>
            <button class="analyze-btn" onclick="playSound('coin'); alert('Аналіз ${game.name} завершено. Очікуваний профіт: високий.')">АНАЛІЗУВАТИ</button>
        </div>
    `).join('');
}

const contentData = {
    dashboard: `<h1 class="gold-text">ПАНЕЛЬ КЕРУВАННЯ</h1><p>Всі системи Aurum Fortuna в нормі. Поточне навантаження на мережу: 14%.</p>`,
    slots: `
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
            <h1 class="gold-text">VIP СЛОТИ</h1>
            <button class="vip-button" id="filter-btn" onclick="toggleHotSlots()"><i class="fas fa-fire"></i> HOT ФІЛЬТР</button>
        </div>
        <div class="game-grid" id="game-container">${renderGames(vipGames)}</div>
    `,
    radar: `
        <h1 class="gold-text">БОНУС-СКАННЕР 2.0</h1>
        <div style="text-align:center;">
            <div class="radar-container"><div class="radar-sweep"></div></div>
            <p id="radar-status" style="margin:20px 0; font-weight:bold;">Система готова до пошуку бонусів.</p>
            <button class="vip-button" style="padding:15px 40px;" onclick="startScanning()">ЗАПУСТИТИ СКАНЕР</button>
        </div>
    `,
    analytics: `<h1 class="gold-text">ГЛОБАЛЬНА АНАЛІТИКА</h1><div style="background:var(--card-bg);padding:20px;border-radius:15px;border:1px solid var(--border-gold);"><canvas id="aurumChart" style="width:100%;height:300px;"></canvas></div>`,
    support: `<h1 class="gold-text">VIP ПІДТРИМКА</h1><div style="text-align:center;padding:50px;background:var(--card-bg);border-radius:15px;border:1px solid var(--border-gold);"><i class="fab fa-telegram" style="font-size:60px;color:#24A1DE;margin-bottom:20px;"></i><h2>Ваш персональний менеджер</h2><button class="vip-button" onclick="window.open('https://t.me/AurumAdmin')">НАПИСАТИ В TELEGRAM</button></div>`
};

// 4. ФУНКЦІЇ МОДУЛІВ
function toggleHotSlots() {
    playSound('click');
    const container = document.getElementById('game-container');
    const btn = document.getElementById('filter-btn');
    if (!isFiltered) {
        container.innerHTML = renderGames(vipGames.filter(g => g.rtp >= 98));
        btn.innerHTML = '<i class="fas fa-th"></i> ПОКАЗАТИ ВСІ';
        btn.style.background = "linear-gradient(135deg, #ff416c, #ff4b2b)";
        isFiltered = true;
    } else {
        container.innerHTML = renderGames(vipGames);
        btn.innerHTML = '<i class="fas fa-fire"></i> HOT ФІЛЬТР';
        btn.style.background = "var(--gold)";
        isFiltered = false;
    }
}

function startScanning() {
    playSound('radar');
    const status = document.getElementById('radar-status');
    status.innerText = "Сканування активних сесій...";
    status.style.color = "#d4af37";
    
    setTimeout(() => {
        const foundGame = vipGames[Math.floor(Math.random()*vipGames.length)].name;
        status.innerHTML = `<span style="color:#00ff88;">ЗНАЙДЕНО: ${foundGame} (Bonus Ready)</span>`;
        playSound('coin');
    }, 3000);
}

// 5. НАВІГАЦІЯ ТА ГРАФІК
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', function() {
        playSound('click');
        document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
        this.classList.add('active');
        const tab = this.getAttribute('data-tab');
        document.getElementById('content-area').innerHTML = contentData[tab];
        if (tab === 'analytics') initChart();
    });
});

function initChart() {
    setTimeout(() => {
        const ctx = document.getElementById('aurumChart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['00:00', '06:00', '12:00', '18:00', '22:00'],
                datasets: [{ label: 'Network RTP %', data: [94, 98, 96.5, 99.8, 97], borderColor: '#d4af37', backgroundColor: 'rgba(212,175,55,0.1)', fill: true, tension: 0.4 }]
            },
            options: { plugins: { legend: { display: false } }, scales: { y: { ticks: { color: '#888' } }, x: { ticks: { color: '#888' } } } }
        });
    }, 100);
}

// 6. ЖИВИЙ ДЖЕКПОТ
setInterval(() => {
    const el = document.getElementById('jackpot');
    if (el) {
        let val = parseInt(el.innerText.replace(/\D/g, '')) + Math.floor(Math.random() * 300);
        el.innerText = "₴ " + val.toLocaleString();
    }
}, 3000);