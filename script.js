"use strict";

const cards = document.querySelectorAll(".card");
const cardInner = document.querySelectorAll(".card-inner");
let firstGuess;
let secondGuess;
let flippedCard = false;
let lockedBoard = false;

function found(first, second) {
  firstGuess.removeEventListener("click", flipCard);
  secondGuess.removeEventListener("click", flipCard);
}

const flipCard = function () {
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
