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
const modal = document.querySelector(".modal");
const submitButton = document.getElementById("submit-button");

let player1;
let player2;
let currentPlayer;

startButton.disabled = true;
let movesBlocked = true;
let player1Ready = false;
let player2Ready = false;
let gameStarted = false;
let player1Ear = "mickey-shot";
let player2Ear = "minnie-shot";

window.onload = () => {
  modal.showModal();
};

submitButton.addEventListener("click", (event) => {
  event.preventDefault();
  const firstName = document.getElementById("first-player-name").value;
  const secondName = document.getElementById("second-player-name").value;
  modal.close();
  modal.remove();
  player1 = new Player(firstName);
  player2 = new Player(secondName);
  console.log(player1.playerName);
  console.log(player2.playerName);
  currentPlayer = player1;
  setGridSize(firstPlayerContainer, player1);
  setGridSize(secondPlayerContainer, player2);
});

startButton.addEventListener("click", () => {
  randomPlacementButton.disabled = true;
  randomPlacementButton.classList.add("locked-button");
  randomPlacementButton2.disabled = true;
  randomPlacementButton2.classList.add("locked-button");
  movesBlocked = false;
  gameStarted = true;
  updateEarStatus();
  p1Tiles.forEach((tile) => tile.classList.remove("locked-tile"));
  p2Tiles.forEach((tile) => tile.classList.remove("locked-tile"));
  p2Tiles.forEach((tile) => tile.classList.remove("occupied-tile"));
  startButton.disabled = true;
  startButton.classList.add("locked-button");
  startButton.textContent = "Enjoy the game!";
});

function swapPlayer() {
  movesBlocked = true;
  if (currentPlayer === player1) {
    currentPlayer = player2;
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
    currentPlayer = player1;
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
  updateEarStatus();
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

firstPlayerContainer.classList.add("hidden-board");
secondPlayerContainer.classList.add("hidden-board");
randomPlacementButton2.classList.add("hidden-button");
p2ReadyButton.classList.add("hidden-button");
let p1Tiles = firstPlayerContainer.querySelectorAll(".tile");
let p2Tiles = secondPlayerContainer.querySelectorAll(".tile");
p1Tiles.forEach((tile) => tile.classList.add("locked-tile"));
p2Tiles.forEach((tile) => tile.classList.add("locked-tile"));

document.addEventListener("keydown", (event) => {
  if (
    event.key &&
    event.key.toLowerCase() === "r" &&
    movesBlocked &&
    gameStarted
  ) {
    swapPlayer();
  }
});

function updateEarStatus() {
  if (!currentPlayer) return;
  const ear = currentPlayer === player1 ? player1Ear : player2Ear;

  headingStatus.textContent = `${currentPlayer.playerName}'s turn! Using ${ear === "mickey-shot" ? "🐭 Mickey" : "🎀 Minnie"} ears`;
}

function swapEars(playerEar) {
  if (playerEar === "mickey-shot") {
    playerEar = "minnie-shot";
  } else {
    playerEar = "mickey-shot";
  }
  return playerEar;
}

document.addEventListener("keydown", (event) => {
  if (event.key && event.key.toLowerCase() === "e" && gameStarted) {
    if (currentPlayer === player1) {
      player1Ear = swapEars(player1Ear);
    } else {
      player2Ear = swapEars(player2Ear);
    }
  }
  updateEarStatus();
});

let p1IllegalMoves = [];
let p2IllegalMoves = [];

secondPlayerContainer.addEventListener("click", (event) => {
  const tile = event.target.closest(".tile");

  if (!tile) return;
  if (currentPlayer !== player1 || movesBlocked === true) return;
  if (player1.playerGameboard.allSunk()) {
    headingStatus.textContent = `Game over, ${player2.playerName} has won this round of Battleship!`;
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
    tile.classList.add(player1Ear);
  } else {
    tile.classList.add("missed-tile");
  }
  p1IllegalMoves.push([selectedRow, selectedCol]);
  if (player2.playerGameboard.allSunk()) {
    headingStatus.textContent = `Game over, ${player1.playerName} has won this round of Battleship!`;
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
    if (domCurrent === player1) {
      domCurrent = player2.playerName;
    } else {
      domCurrent = player1.playerName;
    }
    headingStatus.textContent = `It's ${domCurrent} turn! (Press R to continue)`;
  }, 2000);
});

firstPlayerContainer.addEventListener("click", (event) => {
  const tile = event.target.closest(".tile");

  if (!tile) return;
  if (currentPlayer !== player2 || movesBlocked === true) return;
  if (player2.playerGameboard.allSunk()) {
    headingStatus.textContent = `Game over, ${player1.playerName} has won this round of Battleship!`;
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
    tile.classList.add(player2Ear);
  } else {
    tile.classList.add("missed-tile");
  }
  p2IllegalMoves.push([selectedRow, selectedCol]);
  if (player1.playerGameboard.allSunk()) {
    headingStatus.textContent = `Game over, ${player2.playerName} has won this round of Battleship!`;
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
    if (domCurrent === player1) {
      domCurrent = player2.playerName;
    } else {
      domCurrent = player1.playerName;
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
