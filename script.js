"use strict";

const cards = document.querySelectorAll(".card");
const cardInner = document.querySelectorAll(".card-inner");
const labelClock = document.querySelector(".clock-display");
const highscoreDisplay = document.querySelector(".highscore-display");
let highscore;
let firstGuess;
let secondGuess;
let flippedCard = false;
let lockedBoard = false;
let clockRunning = false;
let matched = 0;

function found(first, second) {
  firstGuess.removeEventListener("click", flipCard);
  secondGuess.removeEventListener("click", flipCard);
}

const startTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    if (matched === 9) {
      clearInterval(timer);
      if (!highscore) {
        highscore = time;
        let minHigh = String(Math.trunc(highscore / 60)).padStart(2, 0);
        let secHigh = String(highscore % 60).padStart(2, 0);
        highscoreDisplay.textContent = `${minHigh}:${secHigh}`;
      }
    }
    labelClock.textContent = `${min}:${sec}`;
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
      console.log(matched);
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

//Using flex order to randomize board
const shuffle = () => {
  cards.forEach((card) => {
    let random = Math.floor(Math.random() * 18);
    card.style.order = random;
  });
};

shuffle();
