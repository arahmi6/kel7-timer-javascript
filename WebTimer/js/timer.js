// total countdown to render
const TOTAL_RENDER_COUNTDOWN = 3;
// delay for setTimeOut
const DELAY_SECOND = 1000; //1 second
// active countdown
let active = 0;
if (localStorage.getItem('active')) {
  active = parseInt(localStorage.getItem('active'));
} else {
  localStorage.setItem('active', active);
}

// render HTML
const DOMRoot = document.getElementById('root');
render();

function render() {
  DOMRoot.innerHTML = renderCountdown();
}

function renderCountdown() {
  let html = '';
  let hex = ['#e6eeff', '#f7f8ef'];

  for(let i = 0; i < TOTAL_RENDER_COUNTDOWN; i++) {
    html += `
      <div class="countdown" style="background-color: ${hex[i%2]}">
        <h3 class="title">Stopwatch ${i+1}</h3>
        <h1 class="timer" name="timer">
          00:00:00
        </h1>
        <div class="action">
          <button class="btn start" name="btn-start" onclick="handlePlay(${i})">Start</button>
          <button class="btn stop" name="btn-stop" onclick="handleStop(${i})">Stop</button>
          <button class="btn split" name="btn-split" onclick="handleSplit(${i})">Split</button>
        </div>
        <h2 class="result" name="result">Total Waktu Pengerjaan : <span name="result-time"></span> </h2>
        <div class="split-container" name="split-container">
          <!-- SPLIT LIST -->
        </div>
      </div>
    `;
  }
  return html;
}

// localStorage key and clear
const KEY_STORAGE = (index = active) => ({
  countdown: `countdown-${index}`,
  startTime: `startTime-${index}`,
  pauseTime: `pauseTime-${index}`,
  isPlay: `isPlay-${index}`,
  isPause: `isPause-${index}`,
  split: `split-${index}`,
});

function clearStorage(index) {
  Object.keys(KEY_STORAGE(index)).map(keys => {
    localStorage.removeItem(KEY_STORAGE(index)[keys]);
  });
}

// dom
const DOM = (index = active) => ({
  Timer: document.getElementsByName('timer')[index],
  BtnStart: document.getElementsByName('btn-start')[index],
  BtnStop: document.getElementsByName('btn-stop')[index],
  BtnSplit: document.getElementsByName('btn-split')[index],
  SplitContainer: document.getElementsByName('split-container')[index],
  Result: document.getElementsByName('result')[index],
  ResultTime: document.getElementsByName('result-time')[index],
});

// variable
const statusBtn = {
  start: 'Start',
  continue: 'Continue',
  pause: 'Pause',
}
let countdown = parseInt(localStorage.getItem(KEY_STORAGE(active).countdown)) || 0;
let startTime = localStorage.getItem(KEY_STORAGE(active).startTime);
let pauseTime = localStorage.getItem(KEY_STORAGE(active).pauseTime);
let isPlay = JSON.parse(localStorage.getItem(KEY_STORAGE(active).isPlay)) || false;
let isPause = JSON.parse(localStorage.getItem(KEY_STORAGE(active).isPause)) || false;
let isFinish = false;
let split = JSON.parse(localStorage.getItem(KEY_STORAGE(active).split)) || [];

// mount
didMount();
setInterval(handleTimerChange, DELAY_SECOND);

// function
function didMount() {
  mapDataCountdown();
  getPlay(active);
  if (!startTime && !isPlay && !isPause) {
    countdown = 0;
    DOM(active).BtnStart.innerText = statusBtn.start;
  } else {
    if (isPause) {
      DOM(active).BtnStart.innerHTML = statusBtn.continue;
    } else {
      let newTime = calculateTimeDiff(startTime, Date.now());
      countdown = newTime;
      DOM(active).BtnSplit.style.display = 'inline';
      DOM(active).BtnStart.innerHTML = statusBtn.pause;
    }
  }
}

function handleTimerChange() {
  if (isPlay) {
    countdown += DELAY_SECOND;
    localStorage.setItem(KEY_STORAGE(active).countdown, countdown);
  }

  DOM(active).Timer.innerText = convertMillisecondToMinutes(countdown);
}

function handleActiveChange(index) {
  let prevCountdown = localStorage.getItem(KEY_STORAGE(active).countdown);
  if (active !== index && prevCountdown) {
    split = JSON.parse(localStorage.getItem(KEY_STORAGE(index).split)) || [];
    localStorage.setItem(KEY_STORAGE(active).isPlay, false);
    localStorage.setItem(KEY_STORAGE(active).isPause, true);
    localStorage.setItem(KEY_STORAGE(active).pauseTime, Date.now());
    DOM(active).BtnStart.innerText = statusBtn.continue;
    DOM(active).BtnSplit.style.display = 'none';
  }
  active = index;
  countdown = parseInt(localStorage.getItem(KEY_STORAGE(active).countdown));
  localStorage.setItem('active', active);
}

function mapDataCountdown() {
  for(let i = 0; i < TOTAL_RENDER_COUNTDOWN; i++) {
    let localCountdown = parseInt(localStorage.getItem(KEY_STORAGE(i).countdown)) || 0;
    let localSplit = JSON.parse(localStorage.getItem(KEY_STORAGE(i).split)) || [];
    DOM(i).Timer.innerText = convertMillisecondToMinutes(localCountdown);
    if(localSplit || localSplit[0]) {
      mapSplitData(localSplit, i);
    }
  }
}

function handlePlay(indexEl) {
  getPlay(indexEl);
  handleActiveChange(indexEl);
  if (!isPlay) {
    if (!startTime) {
      let newTime = Date.now();
      startTime = newTime;
      localStorage.setItem(KEY_STORAGE(active).startTime, newTime);
      countdown = 0;
      DOM(active).SplitContainer.innerHTML = '';
    }
    DOM(active).BtnStart.innerText = statusBtn.pause;
    if (pauseTime) {
      let pauseDiff = calculateTimeDiff(pauseTime, Date.now());
      startTime = parseInt(startTime) + pauseDiff;
      localStorage.setItem(KEY_STORAGE(active).startTime, startTime);
    }
    setPlay();
  } else {
    handlePause();
  }
}

function getPlay(index) {
  isPlay = JSON.parse(localStorage.getItem(KEY_STORAGE(index).isPlay));
  startTime = JSON.parse(localStorage.getItem(KEY_STORAGE(index).startTime));
  pauseTime = JSON.parse(localStorage.getItem(KEY_STORAGE(index).pauseTime));
}

function setPlay() {
  isPlay = true;
  isPause = false;
  localStorage.setItem(KEY_STORAGE(active).isPlay, isPlay);
  localStorage.setItem(KEY_STORAGE(active).isPause, isPause);
  DOM(active).BtnSplit.style.display = 'inline';
  DOM(active).Result.style.display = 'none';
}


function handlePause(indexEl) {
  pauseTime = Date.now();
  localStorage.setItem(KEY_STORAGE(active).countdown, countdown);
  localStorage.setItem(KEY_STORAGE(active).pauseTime, pauseTime);
  DOM(active).BtnStart.innerText = statusBtn.continue;
  setPause();
}

function setPause() {
  isPause = true;
  isPlay = false;
  localStorage.setItem(KEY_STORAGE(active).isPause, isPause);
  localStorage.setItem(KEY_STORAGE(active).isPlay, isPlay);
  DOM(active).BtnSplit.style.display = 'none';
}

function handleStop(indexEl) {
  let localStartTime = localStorage.getItem(KEY_STORAGE(indexEl).startTime);
  let localCountdown = parseInt(localStorage.getItem(KEY_STORAGE(indexEl).countdown)) || 0;
  let localSplit = JSON.parse(localStorage.getItem(KEY_STORAGE(indexEl).split)) || [];
  if (localStartTime) {
    DOM(indexEl).Result.style.display = 'block';
    if(localSplit.length > 0) {
      let totalDiff = calculateTimeDiff(localSplit[0].time, localCountdown);
      DOM(indexEl).ResultTime.innerText = convertMillisecondToMinutes(localCountdown, true) + ' | Selisih : ' + convertMillisecondToMinutes(totalDiff, true);
    } else {
      DOM(indexEl).ResultTime.innerText = convertMillisecondToMinutes(localCountdown, true);
    }
    DOM(indexEl).Timer.innerText = convertMillisecondToMinutes(0);
    DOM(indexEl).BtnSplit.style.display = 'none';
    DOM(indexEl).BtnStart.innerText = statusBtn.start;
    clearStorage(indexEl);
    if(indexEl === active) {
      setStop();
    }
  }
}

function setStop() {
  startTime = 0;
  pauseTime = 0;
  isPlay = false;
  isPause = false;
  countdown = 0;
  split = [];
}

function handleSplit(indexEl) {
  let index = split.length + 1;
  let data = { index, time: countdown };
  split.unshift(data);
  localStorage.setItem(KEY_STORAGE(active).split, JSON.stringify(split));

  mapSplitData(split);
}

function mapSplitData(splitData, index = active) {
  let splitHtml = '';
  splitData.map((data, index) => splitHtml += renderSplit(data.index, convertMillisecondToMinutes(data.time), splitTimeDiff(index, splitData)));
  DOM(index).SplitContainer.innerHTML = splitHtml;
}

function renderSplit(index, time, diff) {
  return (
    `<div class="split-list">
      <p>${index}</p>
      <p>${time}</p>
      <p>${diff}</p>
    </div>`
  );
}

function splitTimeDiff(index, data) {
  let nextData = data[index + 1];
  if(nextData) {
    return convertMillisecondToMinutes(calculateTimeDiff(data[index].time, nextData.time));
  } else {
    return convertMillisecondToMinutes(data[index].time);
  }
}

function convertMillisecondToMinutes(millis = 0, isDescription = false) {
  let sec = Math.floor(millis / 1000);
  let hrs = Math.floor(sec / 3600);
  sec -= hrs * 3600;
  let min = Math.floor(sec / 60);
  sec -= min * 60;

  sec = '' + sec;

  if (hrs > 0) {
    min = '' + min;
    min = ('00' + min).substring(min.length);
    sec = ('00' + sec).substring(sec.length);
    return hrs + ":" + min + ":" + sec;
  }
  else {
    if (isDescription) {
      return `${min} Menit ${sec} Detik`;
    } else {
      sec = ('00' + sec).substring(sec.length);
      return "00:" + (min < 10 ? '0' + min : min) + ":" + sec;
    }
  }
}

function calculateTimeDiff(dateStart, dateEnd) {
  const diffTime = Math.abs(dateEnd - dateStart); // return millisecond
  return diffTime;
}