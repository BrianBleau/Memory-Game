"use strict";

const cards = document.querySelectorAll(".card");
const cardInner = document.querySelectorAll(".card-inner");
const labelClock = document.querySelector(".clock-display");
const highscoreDisplay = document.querySelector(".highscore-display");
const nameInput = document.querySelector(".name-input");
const nameButton = document.querySelector(".name-button");
const players = [];
const nameDisplay = document.querySelector(".name-display");
const playerHighDisplay = document.querySelector(".player-high");
const popup = document.querySelector(".popup");
const popupText = document.querySelector(".popup-text");
let playing = {};
let highscore;
let firstGuess;
let secondGuess;
let flippedCard = false;
let lockedBoard = false;
let clockRunning = false;
let matched = 0;

const resetClock = () => (labelClock.textContent = "0:00");

const calcPlayerHigh = function () {
  let time = playing.playerHigh;
  const min = String(Math.trunc(time / 60)).padStart(2, 0);
  const sec = String(time % 60).padStart(2, 0);
  playerHighDisplay.textContent = `${playing.playerName}'s High: ${min}:${sec}`;
};

function found(first, second) {
  firstGuess.removeEventListener("click", flipCard);
  secondGuess.removeEventListener("click", flipCard);
}

nameButton.addEventListener("click", function (e) {
  e.preventDefault();
  matched = 0;
  playing = {};
  let current = players.find((o) => o.playerName === nameInput.value);
  if (current) {
    playing = current;
    nameDisplay.textContent = `Playing: ${playing.playerName}`;
    popup.classList.toggle("hidden");
    calcPlayerHigh();
    flipAll();
    setTimeout(shuffle, 600);
    cardInner.forEach((el) => el.addEventListener("click", flipCard));
  } else {
    let obj = {
      playerName: nameInput.value,
      hasHigh: false,
    };
    players.push(obj);
    playing = obj;
    nameDisplay.textContent = `Playing: ${playing.playerName}`;
    popup.classList.toggle("hidden");
    flipAll();
    setTimeout(shuffle, 600);
    cardInner.forEach((el) => el.addEventListener("click", flipCard));
  }
});

const startTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    labelClock.textContent = `${min}:${sec}`;
    if (matched === 9) {
      clearInterval(timer);
      if (!playing.playerHigh || time < playing.playerHigh) {
        playing.playerHigh = time;
      }

      if (!highscore || time < highscore) {
        highscore = time;
        let minHigh = String(Math.trunc(highscore / 60)).padStart(2, 0);
        let secHigh = String(highscore % 60).padStart(2, 0);
        highscoreDisplay.textContent = `Best Overall(${playing.playerName}):${minHigh}:${secHigh}`;
      }
      clockRunning = false;
      popup.classList.remove("hidden");
      popupText.textContent = `Congrats, ${playing.playerName}, your time is ${playing.playerHigh} seconds. Who's next?`;
    }

    time++;
  };

  let time = 0;
  tick();
  const timer = setInterval(tick, 1000);

  return timer;
};

const flipCard = function () {
  if (clockRunning === false) {
    startTimer();
    clockRunning = true;
  }
  //return if clicking on same card
  if (this === firstGuess) return;
  //return if pending timeout
  if (lockedBoard) return;
  this.classList.toggle("flip");
  if (!flippedCard) {
    firstGuess = this;
    flippedCard = true;
  } else {
    secondGuess = this;
    flippedCard = false;
    if (firstGuess.dataset.image === secondGuess.dataset.image) {
      matched++;
      found(firstGuess, secondGuess);
    } else {
      lockedBoard = true;
      setTimeout(() => {
        firstGuess.classList.toggle("flip");
        secondGuess.classList.toggle("flip");
        firstGuess = undefined;
        secondGuess = undefined;
        lockedBoard = false;
      }, 1500);
    }
  }
};

const flip = cardInner.forEach((card) =>
  card.addEventListener("click", flipCard)
);

const flipAll = () => {
  cardInner.forEach((e) => {
    e.classList.add("flip");
  });
};

//Using flex order to randomize board
const shuffle = () => {
  cards.forEach((card) => {
    let random = Math.floor(Math.random() * 18);
    card.style.order = random;
  });
};
