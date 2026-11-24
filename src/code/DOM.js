import CreateGameboard from "./gameboard.js";
import Player from "./players.js";

const firstPlayerContainer = document.querySelector(".first-player-grid");
const secondPlayerContainer = document.querySelector(".second-player-grid");
const headingStatus = document.querySelector(".status-text");
const randomPlacementButton = document.querySelector(".random-placement");
const randomPlacementButton2 = document.querySelector(".random-placement-2");
const p1ReadyButton = document.querySelector(".player-1-ready");
const p2ReadyButton = document.querySelector(".player-2-ready");
const startButton = document.querySelector(".start-button");
startButton.disabled = true;
let movesBlocked = true;
let currentPlayer = 1;
let player1Ready = false;
let player2Ready = false;

startButton.addEventListener("click", () => {
  randomPlacementButton.disabled = true;
  randomPlacementButton.classList.add("locked-button");
  randomPlacementButton2.disabled = true;
  randomPlacementButton2.classList.add("locked-button");
  setTimeout(() => {
    headingStatus.textContent = `It's player ${currentPlayer}'s turn!`;
  }, 750);
  movesBlocked = false;
  p1Tiles.forEach((tile) => tile.classList.remove("locked-tile"));
  p2Tiles.forEach((tile) => tile.classList.remove("locked-tile"));
  p2Tiles.forEach((tile) => tile.classList.remove("occupied-tile"));
  startButton.disabled = true;
  startButton.classList.add("locked-button");
  startButton.textContent = "Enjoy the game!";
});

function swapPlayer() {
  movesBlocked = true;
  console.log("Coming in as:", currentPlayer);
  if (currentPlayer === 1) {
    currentPlayer = 2;
    player2.playerGameboard.getBoard().forEach((row, i) => {
      row.forEach((cell, j) => {
        if (cell.ship) {
          p2Tiles[i * 10 + j].classList.add("occupied-tile");
        }
      });
    });

    secondPlayerContainer.classList.remove("hidden-board");
    p1Tiles.forEach((tile) => tile.classList.remove("occupied-tile"));
    firstPlayerContainer.classList.remove("hidden-board");
    movesBlocked = false;
  } else {
    currentPlayer = 1;
    player1.playerGameboard.getBoard().forEach((row, i) => {
      row.forEach((cell, j) => {
        if (cell.ship) {
          p1Tiles[i * 10 + j].classList.add("occupied-tile");
        }
      });
    });
    p2Tiles.forEach((tile) => tile.classList.remove("occupied-tile"));
    secondPlayerContainer.classList.remove("hidden-board");
    firstPlayerContainer.classList.remove("hidden-board");
    movesBlocked = false;
  }
  headingStatus.textContent = `${currentPlayer}, your turn!`;
}

function getRandomInt(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
}

function setGridSize(container, player) {
  const playerGameboard = player.playerGameboard.getBoard();
  container.innerHTML = "";

  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      const newDiv = document.createElement("div");
      newDiv.dataset.row = i;
      newDiv.dataset.col = j;
      if (playerGameboard[i][j].ship) {
        newDiv.classList.add("occupied-tile");
      }
      newDiv.classList.add("tile");
      container.appendChild(newDiv);
    }
  }
}

const player1 = new Player();
const player2 = new Player();

function randomisePlacement() {
  let num1 = getRandomInt(0, 10);
  let num2 = getRandomInt(0, 10);
  let num3 = getRandomInt(0, 10);
  let direction = "H";
  if (num3 < 5) {
    direction = "V";
  }
  return { num1, num2, direction };
}

randomPlacementButton.addEventListener("click", () => {
  player1.playerGameboard = CreateGameboard();
  const playerLengths = [2, 3, 3, 4, 5];
  while (playerLengths.length !== 0) {
    let { num1, num2, direction } = randomisePlacement();
    let currentLength = playerLengths.shift();
    while (
      player1.playerGameboard.placeShip(
        num1,
        num2,
        currentLength,
        direction,
      ) === false
    ) {
      ({ num1, num2, direction } = randomisePlacement());
    }
  }
  setGridSize(firstPlayerContainer, player1);
  p1Tiles = firstPlayerContainer.querySelectorAll(".tile");
  p1Tiles.forEach((tile) => tile.classList.add("locked-tile"));
  firstPlayerContainer.classList.remove("hidden-board");
});

randomPlacementButton2.addEventListener("click", () => {
  player2.playerGameboard = CreateGameboard();
  const playerLengths = [2, 3, 3, 4, 5];
  while (playerLengths.length !== 0) {
    let { num1, num2, direction } = randomisePlacement();
    let currentLength = playerLengths.shift();
    while (
      player2.playerGameboard.placeShip(
        num1,
        num2,
        currentLength,
        direction,
      ) === false
    ) {
      ({ num1, num2, direction } = randomisePlacement());
    }
  }
  setGridSize(secondPlayerContainer, player2);
  p2Tiles = secondPlayerContainer.querySelectorAll(".tile");
  p2Tiles.forEach((tile) => tile.classList.add("locked-tile"));
  if (player1Ready && player2Ready) {
    headingStatus.textContent = "Both players are ready - start the game!";
  }
  secondPlayerContainer.classList.remove("hidden-board");
});

p1ReadyButton.addEventListener("click", () => {
  firstPlayerContainer.classList.add("hidden-board");
  randomPlacementButton.classList.add("hidden-button");
  p1ReadyButton.classList.add("hidden-button");
  player1Ready = true;
  startButton.disabled = !(player1Ready && player2Ready);

  secondPlayerContainer.classList.remove("hidden-board");
  randomPlacementButton2.classList.remove("hidden-button");
  p2ReadyButton.classList.remove("hidden-button");
});

p2ReadyButton.addEventListener("click", () => {
  randomPlacementButton2.classList.add("hidden-button");
  p2ReadyButton.classList.add("hidden-button");
  player2Ready = true;
  startButton.disabled = !(player1Ready && player2Ready);
  startButton.classList.remove("locked-button");
});

setGridSize(firstPlayerContainer, player1);
setGridSize(secondPlayerContainer, player2);
firstPlayerContainer.classList.add("hidden-board");
secondPlayerContainer.classList.add("hidden-board");
randomPlacementButton2.classList.add("hidden-button");
p2ReadyButton.classList.add("hidden-button");
let p1Tiles = firstPlayerContainer.querySelectorAll(".tile");
let p2Tiles = secondPlayerContainer.querySelectorAll(".tile");
p1Tiles.forEach((tile) => tile.classList.add("locked-tile"));
p2Tiles.forEach((tile) => tile.classList.add("locked-tile"));

document.addEventListener("keydown", (event) => {
  if (event.key.toLowerCase() === "r" && movesBlocked) {
    swapPlayer();
  }
});

let p1IllegalMoves = [];
let p2IllegalMoves = [];

secondPlayerContainer.addEventListener("click", (event) => {
  const tile = event.target.closest(".tile");

  if (!tile) return;
  if (currentPlayer !== 1 || movesBlocked === true) return;
  if (player1.playerGameboard.allSunk()) {
    headingStatus.textContent =
      "Game over, player 2 has won this round of Battleship!";
    movesBlocked = true;
    p1Tiles.forEach((tile) => tile.classList.add("locked-tile"));
    p2Tiles.forEach((tile) => tile.classList.add("locked-tile"));
    return;
  }
  let selectedRow = tile.dataset.row;
  let selectedCol = tile.dataset.col;
  for (const element of p1IllegalMoves) {
    let [a, b] = element;
    if (selectedRow === a && selectedCol === b) {
      alert("You can't click the same square twice");
      return;
    }
  }
  let result = player2.playerGameboard.receiveAttack(selectedRow, selectedCol);
  if (result) {
    tile.classList.add("shot-tile");
  } else {
    tile.classList.add("missed-tile");
  }
  p1IllegalMoves.push([selectedRow, selectedCol]);
  if (player2.playerGameboard.allSunk()) {
    headingStatus.textContent =
      "Game over, player 1 has won this round of Battleship!";
    movesBlocked = true;
    p1Tiles.forEach((tile) => tile.classList.add("locked-tile"));
    p2Tiles.forEach((tile) => tile.classList.add("locked-tile"));
    return;
  }
  movesBlocked = true;
  setTimeout(() => {
    secondPlayerContainer.classList.add("hidden-board");
    firstPlayerContainer.classList.add("hidden-board");
    let domCurrent = currentPlayer;
    if (domCurrent === 1) {
      domCurrent = 2;
    } else {
      domCurrent = 1;
    }
    headingStatus.textContent = `It's ${domCurrent} turn! (Press R to continue)`;
  }, 2000);
});

firstPlayerContainer.addEventListener("click", (event) => {
  const tile = event.target.closest(".tile");

  if (!tile) return;
  if (currentPlayer !== 2 || movesBlocked === true) return;
  if (player2.playerGameboard.allSunk()) {
    headingStatus.textContent =
      "Game over, player 1 has won this round of Battleship!";
    movesBlocked = true;
    p1Tiles.forEach((tile) => tile.classList.add("locked-tile"));
    p2Tiles.forEach((tile) => tile.classList.add("locked-tile"));
    return;
  }
  let selectedRow = tile.dataset.row;
  let selectedCol = tile.dataset.col;
  for (const element of p2IllegalMoves) {
    let [a, b] = element;
    if (selectedRow === a && selectedCol === b) {
      alert("You can't click the same square twice");
      return;
    }
  }
  let result = player1.playerGameboard.receiveAttack(selectedRow, selectedCol);
  if (result) {
    tile.classList.add("shot-tile");
  } else {
    tile.classList.add("missed-tile");
  }
  p2IllegalMoves.push([selectedRow, selectedCol]);
  if (player1.playerGameboard.allSunk()) {
    headingStatus.textContent =
      "Game over, player 2 has won this round of Battleship!";
    movesBlocked = true;
    p1Tiles.forEach((tile) => tile.classList.add("locked-tile"));
    p2Tiles.forEach((tile) => tile.classList.add("locked-tile"));
    return;
  }
  movesBlocked = true;
  setTimeout(() => {
    secondPlayerContainer.classList.add("hidden-board");
    firstPlayerContainer.classList.add("hidden-board");
    let domCurrent = currentPlayer;
    if (domCurrent === 1) {
      domCurrent = 2;
    } else {
      domCurrent = 1;
    }
    headingStatus.textContent = `It's ${domCurrent} turn! (Press R to continue)`;
  }, 2000);
});

// function handleComputerMoves(player) {
//   p1Tiles = firstPlayerContainer.querySelectorAll(".tile");
//   let targetTile = null;
//   let move = player.computerMove(player.playerGameboard);
//   let [selectedRow, selectedCol] = move;
//   let result = player1.playerGameboard.receiveAttack(selectedRow, selectedCol);
//   for (const tile of p1Tiles) {
//     if (
//       tile.dataset.row === String(selectedRow) &&
//       tile.dataset.col === String(selectedCol)
//     ) {
//       targetTile = tile;
//       break;
//     }
//   }
//   setTimeout(() => {
//     if (result) {
//       targetTile.classList.add("shot-tile");
//     } else {
//       targetTile.classList.add("missed-tile");
//     }
//     currentPlayer = 1;
//     movesBlocked = false;
//     headingStatus.textContent = `It's player ${currentPlayer}'s turn!`;
//   }, 750);
// }

// const computerLengths = [5, 4, 3, 3, 2];

// for (let i = 0; i < 5; i++) {
//   let { num1, num2, direction } = randomisePlacement();
//   let currentLength = computerLengths.shift();
//   while (
//     player2.playerGameboard.placeShip(num1, num2, currentLength, direction) ===
//     false
//   ) {
//     ({ num1, num2, direction } = randomisePlacement());
//   }
// }
