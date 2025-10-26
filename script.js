const form = document.getElementById('timer-form');
const timersContainer = document.getElementById('timers-container');
const timerAudio = document.getElementById('timer-audio');

let timers = []; // store timer objects

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const hours = parseInt(document.getElementById('hours').value) || 0;
  const minutes = parseInt(document.getElementById('minutes').value) || 0;
  const seconds = parseInt(document.getElementById('seconds').value) || 0;

  const totalSeconds = hours * 3600 + minutes * 60 + seconds;

  if (totalSeconds <= 0) {
    alert('Please enter a valid time!');
    return;
  }

  createTimer(totalSeconds);
  form.reset();
});

function createTimer(totalSeconds) {
  const timerId = Date.now();
  const timerCard = document.createElement('div');
  timerCard.className = 'timer-card';
  timerCard.dataset.id = timerId;

  const timerDisplay = document.createElement('span');
  timerDisplay.className = 'timer-time';
  timerDisplay.textContent = formatTime(totalSeconds);

  const stopButton = document.createElement('button');
  stopButton.className = 'stop-btn';
  stopButton.textContent = 'Stop Timer';

  stopButton.addEventListener('click', () => stopTimer(timerId));

  timerCard.append(timerDisplay, stopButton);
  timersContainer.appendChild(timerCard);

  const interval = setInterval(() => {
    totalSeconds--;

    if (totalSeconds <= 0) {
      clearInterval(interval);
      endTimer(timerId);
    } else {
      timerDisplay.textContent = formatTime(totalSeconds);
    }
  }, 1000);

  timers.push({ id: timerId, interval, card: timerCard });
}

function stopTimer(id) {
  const timer = timers.find((t) => t.id === id);
  if (timer) {
    clearInterval(timer.interval);
    timer.card.remove();
    timers = timers.filter((t) => t.id !== id);
  }
}

function endTimer(id) {
  const timer = timers.find((t) => t.id === id);
  if (!timer) return;

  timer.card.classList.add('ended');
  timer.card.querySelector('.timer-time').textContent = 'Time’s Up!';
  timer.card.querySelector('.stop-btn').remove();

  // Play sound
  timerAudio.play();

  // Optionally auto-remove after a few seconds
  setTimeout(() => timer.card.remove(), 5000);

  // Remove from active list
  timers = timers.filter((t) => t.id !== id);
}

function formatTime(sec) {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  return [h, m, s]
    .map((v) => String(v).padStart(2, '0'))
    .join(':');
}
