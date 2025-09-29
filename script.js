const cardGrid = document.querySelector('.card-grid');
const scoreElement = document.getElementById('score');
const timeElement = document.getElementById('time');

let score = 0;
let time = 60;
let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let timer = null;
let gameStarted = false;
let level = 1;

// daftar gambar (kamu bisa tambah sesuai kebutuhan di folder Card)
const allImages = [
  'DriftMaster.jpg', 'MuscleOutlaw.jpg', 'StreetKing.jpg', 'TorqueLegend.jpg','AmericanClassic.jpg','BlueLighting.jpg',
  'GreenMachine.jpg','HyperDrift.jpg','PinkFlaminggo.jpg','RallyLegend.jpg','SpeedDemon.jpg','SupraKing.jpg'
];

// mulai level
function startLevel() {
  resetGame();

  // tentukan jumlah pasangan kartu (mulai 4 → 5 → 6 ... sesuai level)
  const pairs = 4 + (level - 1); 
  const selectedImages = allImages.slice(0, pairs);

  // atur waktu (mulai 60, turun 10 tiap level, minimal 30)
  time = Math.max(60 - (level - 1) * 10, 30);
  timeElement.textContent = `Waktu: ${time} detik`;

  // generate kartu
  selectedImages.forEach((img, index) => {
    for (let i = 0; i < 2; i++) {
      const card = document.createElement('div');
      card.classList.add('card');
      card.dataset.pair = index;

      const front = document.createElement('div');
      front.classList.add('front');

      const back = document.createElement('div');
      back.classList.add('back');
      back.style.backgroundImage = `url('Card/${img}')`;

      card.appendChild(front);
      card.appendChild(back);

      cardGrid.appendChild(card);
      cards.push(card);
    }
  });

  // shuffle kartu
  cards = shuffle(cards);
  cards.forEach((card) => cardGrid.appendChild(card));

  // tambahkan event listener
  cards.forEach((card) => card.addEventListener('click', flipCard));

  gameStarted = false;
}

// reset game state
function resetGame() {
  clearInterval(timer);
  cardGrid.innerHTML = '';
  cards = [];
  flippedCards = [];
  matchedPairs = 0;
  gameStarted = false;
}

// fungsi flip kartu
function flipCard() {
  if (!gameStarted) {
    startTimer();
    gameStarted = true;
  }

  if (flippedCards.length < 2 && !this.classList.contains('flipped')) {
    this.classList.add('flipped');
    flippedCards.push(this);

    if (flippedCards.length === 2) {
      setTimeout(checkMatch, 800);
    }
  }
}

// fungsi check match
function checkMatch() {
  const card1 = flippedCards[0];
  const card2 = flippedCards[1];

  if (card1.dataset.pair === card2.dataset.pair) {
    score++;
    matchedPairs++;
    scoreElement.textContent = `Skor: ${score}`;

    setTimeout(() => {
      card1.style.visibility = 'hidden';
      card2.style.visibility = 'hidden';
    }, 400);

    // cek menang di level ini
    if (matchedPairs === cards.length / 2) {
      clearInterval(timer);
      setTimeout(() => {
        alert(`🎉 Level ${level} Selesai! 🎉`);
        level++;
        startLevel();
      }, 500);
    }
  } else {
    card1.classList.remove('flipped');
    card2.classList.remove('flipped');
  }

  flippedCards = [];
}

// fungsi shuffle
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// fungsi timer
function startTimer() {
  timer = setInterval(() => {
    time--;
    timeElement.textContent = `Waktu: ${time} detik`;

    if (time === 0) {
      clearInterval(timer);
      alert(`⏰ Waktu habis di Level ${level}!`);
    }
  }, 1000);
}

// tombol reset
const resetBtn = document.getElementById('resetBtn');
resetBtn.addEventListener('click', () => {
  score = 0;       // reset skor
  level = 1;       // balik ke level 1
  scoreElement.textContent = `Skor: ${score}`;
  startLevel();    // mulai ulang
});


// mulai dari level 1
startLevel();
