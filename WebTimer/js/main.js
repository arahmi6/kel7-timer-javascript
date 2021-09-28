// dom
const DOMTimer = document.getElementById('timer');
const DOMBtnStart = document.getElementById('btn-start');
const DOMBtnStop = document.getElementById('btn-stop');
const DOMBtnLap = document.getElementById('btn-lap');
const DOMBtnResetLap = document.getElementById('btn-resetLap');
const DOMResult = document.getElementById('result');
const DOMResultTime = document.getElementById('result-time');

//var untuk lap
var lapsContainer = document.getElementById('laps');
var incrementLap =0;
// variable
const statusBtn = {
  start: 'Start',
  continue: 'Continue',
  pause: 'Pause',
}

const DELAY_SECOND = 1000; //1 second


let countdown = parseInt(localStorage.getItem('countdown')) || 0;
let startTime = localStorage.getItem('startTime');
let pauseTime = localStorage.getItem('pauseTime');
let isPlay = JSON.parse(localStorage.getItem('isPlay')) || false;
let isPause = JSON.parse(localStorage.getItem('isPause')) || false;
let isFinish = false;

// mount
didMount();
setInterval(handleTimerChange, DELAY_SECOND);

// event
DOMBtnStart.addEventListener('click', () => {
  if(!isPlay) {
    handlePlay();
    
  } else {
    handlePause();
  }
});

DOMBtnStop.addEventListener('click', () => {
  handleStop();
});

DOMBtnLap.addEventListener('click', () => {
  incrementLap +=1;
  lap();
});

DOMBtnResetLap.addEventListener('click', () => {
  resetLap();
});

// function
function didMount() {
  if(!startTime && !isPlay && !isPause) {
    countdown = 0;
    DOMBtnStart.innerText = statusBtn.start;
    tampilLap();
  } else {
    if(isPause) {
      DOMBtnStart.innerHTML = statusBtn.continue;
      tampilLap();
    } else {
      let newTime = calculateTimeDiff(startTime, Date.now());
      countdown = newTime;
      DOMBtnStart.innerHTML = statusBtn.pause;
      tampilLap();
    }
  }
}

function handleTimerChange() {
  if(isPlay) {
    countdown += DELAY_SECOND;
    localStorage.setItem('countdown', countdown);
  }

  DOMTimer.innerText = convertMillisecondToMinutes(countdown);
}

function handlePlay() {
  if(!startTime) {
    let newTime = Date.now();
    startTime = newTime;
    localStorage.setItem('startTime', newTime);
    countdown = 0;
    
  }
  DOMBtnStart.innerText = statusBtn.pause;
  if(pauseTime) {
    let pauseDiff = calculateTimeDiff(pauseTime, Date.now());
    startTime = parseInt(startTime) + pauseDiff;
    localStorage.setItem('startTime', startTime);
  
  }
  setPlay();
}

function handlePause() {
  let newTime = Date.now();
  pauseTime = newTime;
  localStorage.setItem('countdown', countdown);
  localStorage.setItem('pauseTime', pauseTime);
  DOMBtnStart.innerText = statusBtn.continue;
  setPause();
}

function handleStop() {
  if(startTime) {
    DOMResult.style.display = 'block';
    DOMResultTime.innerText = convertMillisecondToMinutes(countdown, true);
  }
  setStop();
}

function setPlay() {
  isPlay = true;
  isPause = false;
  localStorage.setItem('isPlay', isPlay);
  localStorage.setItem('isPause', isPause);
  DOMResult.style.display = 'none';
  
  

}


function setPause() {
  isPause = true;
  isPlay = false;
  localStorage.setItem('isPause', isPause);
  localStorage.setItem('isPlay', isPlay);
}

function setStop() {
  startTime = 0;
  pauseTime = 0;
  isPlay = false;
  isPause = false;
  countdown = 0;
  DOMBtnStart.innerText = statusBtn.start;
  localStorage.clear();

}

function convertMillisecondToMinutes(millis = 0, isDescription = false) {
  let sec = Math.floor(millis / 1000);
  let hrs = Math.floor(sec / 3600);
  let days = Math.floor(hrs/ 24);
  sec -= hrs * 3600;
  let min = Math.floor(sec / 60);
  sec -= min * 60;
 
  sec = '' + sec;

  if (hrs >= 24){
    hrs -= days*24;
    if(isDescription){
       return ` ${days} Hari ${hrs} Jam ${min} Menit ${sec} Detik`;
    }
    hrs = '' + hrs ;
    min = '' + min ;
    days= '' + days;

    days = ('00' + days).substring(days.length);
    hrs = ('00' + hrs).substring(hrs.length);
    min = ('00' + min).substring(min.length);
    sec = ('00' + sec).substring(sec.length);
    return days + ":"+ hrs + ":" + min + ":" + sec;
  }
  else if (hrs > 0 && hrs < 24) {
    if(isDescription) {
      return ` ${hrs} Jam ${min} Menit ${sec} Detik`;
    }
    min = '' + min;
    min = ('00' + min).substring(min.length);
    sec = ('00' + sec).substring(sec.length);
    return "00:" + hrs + ":" + min + ":" + sec;
  }
  else {
    if(isDescription) {
      return ` ${min} Menit ${sec} Detik`;
    } else {
      sec = ('00' + sec).substring(sec.length);
      return "0:00:" + (min < 10 ? '0' + min : min) + ":" + sec;
    }
  }
}

function lap() {
  
  var li = document.createElement('li');
  DOMResultTime.innerText = convertMillisecondToMinutes(countdown, true)
  li.innerText = "Lap ke " + incrementLap + DOMResultTime.innerText;
  lapsContainer.appendChild(li);
  localStorage.setItem("laps", lapsContainer.innerHTML);
 
}

function tampilLap(){
  lapsContainer.innerHTML=localStorage.getItem("laps");
}

function resetLap() {
  incrementLap=0;
  lapsContainer.innerHTML="";
  
}

function calculateTimeDiff(dateStart, dateEnd) {
  const diffTime = Math.abs(dateEnd - dateStart); // return millisecond
  return diffTime;
}