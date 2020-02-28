const mediaQueries = {
  'smallSize': window.matchMedia('(min-width: 576px)'),
  'largeSize': window.matchMedia('(min-width: 992px)'),
};
const stopWatchButtons = document.querySelectorAll('.stopwatch__controls > button');
const hoursBox = document.querySelector('.stopwatch__hours');
const minutesBox = document.querySelector('.stopwatch__minutes');
const secondsBox = document.querySelector('.stopwatch__seconds');
const millisecondsBox = document.querySelector('.stopwatch__milliseconds');
const buttonsContainer = document.querySelector('.stopwatch__controls');
const startButton = document.querySelector('#stopwatch__controls__start');
const resetButton = document.querySelector('#stopwatch__controls__reset');

let previousTime;
let activeTimer;
let hours = minutes = seconds = milliseconds = 0;
let pastHours = pastMinutes = pastSeconds = pastMilliseconds = 0;

function resizeButtons() {
  let screenSize = window.innerWidth;

  if (screenSize >= 576 && screenSize < 992) {
    stopWatchButtons.forEach(buttonElement => {
        ['btn-sm', 'btn-lg'].forEach(cssClass => buttonElement.classList.remove(cssClass));
      }
    );
  } else if (screenSize >= 992) {
    stopWatchButtons.forEach(buttonElement => buttonElement.classList.add('btn-lg'));
    stopWatchButtons.forEach(buttonElement => buttonElement.classList.remove('btn-sm'));
  } else {
    stopWatchButtons.forEach(buttonElement => buttonElement.classList.add('btn-sm'));
    stopWatchButtons.forEach(buttonElement => buttonElement.classList.remove('btn-lg'));
  }
}


for (let mediaQuery in mediaQueries) {
  mediaQueries[mediaQuery].onchange = resizeButtons;
}

window.onload = resizeButtons;


function formatNumber(number) {
  return 0 <= number && number < 10 ? `0${number}` : number.toString();
}


function processElapsedSeconds() {
  seconds += Math.floor(milliseconds / 1000);
  if (seconds >= 60) {
    processElapsedMinutes();
    seconds = seconds % 60;
  }
}


function processElapsedMinutes() {
  minutes += Math.floor(seconds / 60);
  if (minutes >= 60) {
    hours += Math.floor(minutes / 60);
    minutes = minutes % 60;
  }
}


function sliceTime(elapsed) {
  milliseconds += elapsed;
  if (milliseconds > 1000) {
    processElapsedSeconds();
    milliseconds = milliseconds % 1000;
  }
}


function paintStopwatch() {
  hoursBox.textContent = formatNumber(hours);
  minutesBox.textContent = formatNumber(minutes);
  secondsBox.textContent = formatNumber(seconds);
  millisecondsBox.textContent = formatNumber(milliseconds).slice(0, 1);
}


function paintLap({lapHours, lapMinutes, lapSeconds, lapMilliseconds}) {
  console.log(lapHours, lapMinutes, lapSeconds, lapMilliseconds);
}


function updateTimer() {
  let currentTime = Date.now();
  let elapsed = currentTime - previousTime;
  previousTime = currentTime;
  sliceTime(elapsed);
  paintStopwatch();
}


function calculateLap() {
  let timeComponents = {'lapHours': 0, 'lapMinutes': 0, 'lapSeconds': 0, 'lapMilliseconds': 0};
  timeComponents['lapHours'] = hours - pastHours;

  if (pastMinutes > minutes) {
    timeComponents['lapHours'] -= 1;
    timeComponents['lapMinutes'] = 60 - (pastMinutes - minutes);
  } else {
    timeComponents['lapMinutes'] = minutes - pastMinutes;
  }

  if (pastSeconds > seconds) {
    timeComponents['lapMinutes'] -= 1;
    timeComponents['lapSeconds'] = 60 - (pastSeconds - seconds);
  } else {
    timeComponents['lapSeconds'] = seconds - pastSeconds;
  }

  if (pastMilliseconds > milliseconds) {
    timeComponents['lapSeconds'] -= 1;
    timeComponents['lapMilliseconds'] = 1000 - (pastMilliseconds - milliseconds);
  } else {
    timeComponents['lapMilliseconds'] = milliseconds - pastMilliseconds;
  }
  return timeComponents;
}


function resetOrLap() {
  if (activeTimer) {
    let timeComponents = calculateLap();
    paintLap(timeComponents);
    pastHours = hours;
    pastMinutes = minutes;
    pastSeconds = seconds;
    pastMilliseconds = milliseconds;
  } else {
      hours = minutes = seconds = milliseconds = 0;
      paintStopwatch();
  }
}


function toggleTimer() {
  if (activeTimer) {
    clearInterval(activeTimer);
    activeTimer = null;
    startButton.textContent = 'START';
    resetButton.textContent = 'RESET';
  } else {
    previousTime = Date.now();
    activeTimer = setInterval(updateTimer, 100);
    startButton.textContent = 'PAUSE';
    resetButton.textContent = 'LAP';
  }
}


function initiateStopwatch(e) {
  if (e.target.id === 'stopwatch__controls__start') {
    toggleTimer();
  } else if (e.target.id === 'stopwatch__controls__reset') {
      resetOrLap();
  } else {
      console.debug('Clicked on container');
  }
}

buttonsContainer.addEventListener('click', initiateStopwatch);
