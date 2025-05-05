let startTime, running = false;
let times = [];
let scrambles = [];

const timer = document.getElementById('timer');
const delta = document.getElementById('delta');
const scrambleDiv = document.getElementById('scramble');
const ao5 = document.getElementById('ao5');
const ao12 = document.getElementById('ao12');
const history = document.getElementById('history');
const toggleHistory = document.getElementById('toggleHistory');

function generateScramble() {
  const moves = ["R","R'","R2","L","L'","L2","U","U'","U2","D","D'","D2","F","F'","F2","B","B'","B2"];
  let scramble = [];
  let lastMove = '';
  for (let i = 0; i < 20; i++) {
    let move;
    do {
      move = moves[Math.floor(Math.random() * moves.length)];
    } while (move[0] === lastMove[0]);
    scramble.push(move);
    lastMove = move;
  }
  scrambleDiv.textContent = scramble.join(' ');
}

function updateTime() {
  const now = performance.now();
  const diff = ((now - startTime) / 1000).toFixed(2);
  timer.textContent = diff;
  if (running) requestAnimationFrame(updateTime);
}

function calcAverage(arr) {
  if (arr.length < 3) return null;
  const sorted = [...arr].sort((a, b) => a - b).slice(1, -1);
  const sum = sorted.reduce((a, b) => a + b, 0);
  return (sum / sorted.length).toFixed(3);
}

document.addEventListener('keydown', (e) => {
  if (e.code === 'Space') e.preventDefault();
});

document.addEventListener('keyup', (e) => {
  if (e.code !== 'Space') return;

  if (!running) {
    startTime = performance.now();
    running = true;
    delta.textContent = '';
    requestAnimationFrame(updateTime);
  } else {
    running = false;
    const end = performance.now();
    const time = ((end - startTime) / 1000).toFixed(3);
    const last = times[times.length - 1];
    const diff = last ? (time - last).toFixed(3) : "+0.000";
    delta.textContent = (diff >= 0 ? "+" : "") + diff;

    times.push(parseFloat(time));
    scrambles.push(scrambleDiv.textContent);
    if (times.length > 100) {
      times.shift();
      scrambles.shift();
    }

    timer.textContent = time;

    if (times.length >= 5) {
      const ao5val = calcAverage(times.slice(-5));
      ao5.textContent = "ao5: " + (ao5val || "--");
    }

    if (times.length >= 12) {
      const ao12val = calcAverage(times.slice(-12));
      ao12.textContent = "ao12: " + (ao12val || "--");
    }

    updateHistory();
    generateScramble();
  }
});

function updateHistory() {
  history.innerHTML = '';
  for (let i = times.length - 1; i >= 0; i--) {
    const li = document.createElement('li');
    li.textContent = `${times[i].toFixed(3)}s — ${scrambles[i]}`;
    history.appendChild(li);
  }
}

toggleHistory.addEventListener('click', () => {
  history.classList.toggle('hidden');
  toggleHistory.textContent = history.classList.contains('hidden') ? 'Mostrar Histórico' : 'Ocultar Histórico';
});

generateScramble();
