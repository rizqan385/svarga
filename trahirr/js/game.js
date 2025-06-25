const gameGrid = document.getElementById('game-grid');
const timerEl = document.getElementById('timer');
const resultEl = document.getElementById('result');
const livesEl = document.getElementById('lives');
const winSound = document.getElementById('win-sound');
const failSound = document.getElementById('fail-sound');
const highScoreEl = document.getElementById('highscore');

let chances = 3;
let timer;
let interval;
let flipped = [], matched = [], symbols = [];
let isProcessing = false;

function shuffleSymbols() {
  const iconList = [
    'twemoji:sushi',
    'twemoji:rice-ball',
    'twemoji:oden',
    'twemoji:fish-cake-with-swirl',
    'twemoji:shrimp',
    'twemoji:curry-rice',
    'twemoji:rice-cracker',
    'twemoji:dango'
  ];
  symbols = [...iconList, ...iconList].sort(() => 0.5 - Math.random());
}

function updateLives() {
  livesEl.classList.add('animate');
  livesEl.innerText = chances > 0 ? '❤️'.repeat(chances) : '💔';
  setTimeout(() => livesEl.classList.remove('animate'), 300);
}

function createGrid() {
  gameGrid.innerHTML = '';
  symbols.forEach((symbol, index) => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.symbol = symbol;
    card.dataset.index = index;

    const icon = document.createElement('iconify-icon');
    icon.setAttribute('icon', symbol);
    icon.setAttribute('width', '36');
    icon.setAttribute('height', '36');
    icon.style.display = 'none';

    card.appendChild(icon);
    card.addEventListener('click', () => flipCard(card));
    gameGrid.appendChild(card);
  });
}

function flipCard(card) {
  if (
    flipped.length >= 2 ||
    flipped.includes(card) ||
    matched.includes(card.dataset.index)
  ) return;

  const icon = card.querySelector('iconify-icon');
  icon.style.display = 'block';
  card.classList.add('open');

  flipped.push(card);

  if (flipped.length === 2) {
    const [first, second] = flipped;

    if (first.dataset.symbol === second.dataset.symbol) {
      winSound?.play();
      first.classList.add('matched');
      second.classList.add('matched');
      matched.push(first.dataset.index, second.dataset.index);
      flipped = [];

      if (matched.length === symbols.length) {
        clearInterval(interval);
        const nextTime = new Date().getTime() + 24 * 60 * 60 * 1000;
        localStorage.setItem('playedUntil', nextTime);
        resultEl.innerText = '🎉 Selamat!';
        showWinPopup();
        const score = 30 - timer;
        const best = localStorage.getItem('highScore') || 99;
        if (score < best) {
          localStorage.setItem('highScore', score);
          highScoreEl.innerText = score;
        }
      }
    } else {
      setTimeout(() => {
        flipped.forEach(c => {
          c.querySelector('iconify-icon').style.display = 'none';
          c.classList.remove('open');
        });
        flipped = [];
      }, 800);
    }
  }
}


function resetGame() {
  flipped = [];
  matched = [];
  timer = 30;
  updateLives();
  shuffleSymbols();
  createGrid();
  clearInterval(interval);
  interval = setInterval(() => {
    timer--;
    timerEl.innerText = `Waktu: ${timer}`;
if (timer <= 0) {
  clearInterval(interval);
  chances--;
  failSound?.play();
  updateLives();

  if (chances > 0) {
    resultEl.innerText = `⏰ Waktu habis! Sisa nyawa: ${chances}. Game di-reset.`;
    setTimeout(resetGame, 1000); // reset cepat 1 detik
  } else {
    resultEl.innerText = '💀 Kesempatan habis! Coba lagi besok.';
    const nextTime = new Date().getTime() + 24 * 60 * 60 * 1000;
    localStorage.setItem('playedUntil', nextTime);
  }
}

  }, 1000);
}

function startGame() {
  const playedUntil = localStorage.getItem('playedUntil');
  if (playedUntil && new Date().getTime() < parseInt(playedUntil)) {
    resultEl.innerText = "⛔ Kamu sudah bermain hari ini. Silakan kembali besok.";
    return;
  }

  const high = localStorage.getItem('highScore') || 0;
  highScoreEl.innerText = high;
  resetGame();
}

document.getElementById('playButton').addEventListener('click', () => {
  document.getElementById('playButton').style.display = 'none';
  startGame();
});

// === Popup Win & Voucher ===
function showWinPopup() {
  const popup = document.getElementById('popup');
  const voucherEl = document.getElementById('voucherCode');

  let kode = localStorage.getItem('voucherCode');
  if (!kode) {
    kode = 'SVRGA-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    localStorage.setItem('voucherCode', kode);
    localStorage.setItem('voucherDate', new Date().toLocaleDateString());
  }

  voucherEl.innerText = 'Kode Voucher: ' + kode;
  popup.style.display = 'flex';
}

function closePopup() {
  document.getElementById('popup').style.display = 'none';
}

function shareWhatsApp() {
  const kode = localStorage.getItem('voucherCode') || 'Voucher belum tersedia';
  const pesan = `Saya baru saja menang di Memory Game Svarga Dimsum dan mendapatkan kode voucher: ${kode}! 🎉`;
  const url = `https://wa.me/?text=${encodeURIComponent(pesan)}`;
  window.open(url, '_blank');
}

function validateCode() {
  const tanggalInput = document.getElementById('checkDate').value;
  const kodeInput = document.getElementById('userCode').value.trim().toUpperCase();
  const resultEl = document.getElementById('validationResult');

  const kodeTersimpan = localStorage.getItem('voucherCode') || '';
  const tanggalTersimpan = localStorage.getItem('voucherDate') || '';

  if (tanggalInput === tanggalTersimpan && kodeInput === kodeTersimpan) {
    resultEl.innerText = '✅ Kode valid!';
    resultEl.style.color = 'green';
  } else {
    resultEl.innerText = '❌ Kode tidak valid!';
    resultEl.style.color = 'red';
  }
}
