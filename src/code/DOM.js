import CreateGameboard from "./gameboard.js";
import Player from "./players.js";

const firstPlayerContainer = document.querySelector(".first-player-grid");
const secondPlayerContainer = document.querySelector(".second-player-grid");
const headingStatus = document.querySelector(".status-text");
const randomPlacementButton = document.querySelector(".random-placement");
const startButton = document.querySelector(".start-button");
startButton.disabled = true;
let movesBlocked = true;
let currentPlayer = 1;

startButton.addEventListener("click", () => {
  randomPlacementButton.disabled = true;
  randomPlacementButton.classList.add("locked-button");
  setTimeout(() => {
    headingStatus.textContent = `It's player ${currentPlayer}'s turn!`;
  }, 750);
  movesBlocked = false;
  p1Tiles.forEach((tile) => tile.classList.remove("locked-tile"));
  p2Tiles.forEach((tile) => tile.classList.remove("locked-tile"));
  startButton.disabled = true;
  startButton.classList.add("locked-button");
  startButton.textContent = "Enjoy the game!";
});

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
      if (player === player1) {
        if (playerGameboard[i][j].ship) {
          newDiv.classList.add("occupied-tile");
        }
      }
      newDiv.classList.add("tile");
      container.appendChild(newDiv);
    }
  }
}

const player1 = new Player();
const player2 = new Player("computer");
const computerLengths = [5, 4, 3, 3, 2];

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

for (let i = 0; i < 5; i++) {
  let { num1, num2, direction } = randomisePlacement();
  let currentLength = computerLengths.shift();
  while (
    player2.playerGameboard.placeShip(num1, num2, currentLength, direction) ===
    false
  ) {
    ({ num1, num2, direction } = randomisePlacement());
  }
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
  startButton.disabled = false;
  startButton.classList.remove("locked-button");
});

setGridSize(firstPlayerContainer, player1);
setGridSize(secondPlayerContainer, player2);
let p1Tiles = firstPlayerContainer.querySelectorAll(".tile");
let p2Tiles = secondPlayerContainer.querySelectorAll(".tile");
p1Tiles.forEach((tile) => tile.classList.add("locked-tile"));
p2Tiles.forEach((tile) => tile.classList.add("locked-tile"));

function handleComputerMoves(player) {
  p1Tiles = firstPlayerContainer.querySelectorAll(".tile");
  let targetTile = null;
  let move = player.computerMove(player.playerGameboard);
  let [selectedRow, selectedCol] = move;
  let result = player1.playerGameboard.receiveAttack(selectedRow, selectedCol);
  for (const tile of p1Tiles) {
    if (
      tile.dataset.row === String(selectedRow) &&
      tile.dataset.col === String(selectedCol)
    ) {
      targetTile = tile;
      break;
    }
  }
  setTimeout(() => {
    if (result) {
      targetTile.classList.add("shot-tile");
    } else {
      targetTile.classList.add("missed-tile");
    }
    currentPlayer = 1;
    movesBlocked = false;
    headingStatus.textContent = `It's player ${currentPlayer}'s turn!`;
  }, 750);
}

let p1IllegalMoves = [];

p2Tiles.forEach((tile) => {
  tile.addEventListener("click", () => {
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
        console.error("You can't click the same square twice");
        return;
      }
    }
    let result = player2.playerGameboard.receiveAttack(
      selectedRow,
      selectedCol,
    );
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
    currentPlayer = 2;
    headingStatus.textContent = `It's player ${currentPlayer}'s turn!`;
    movesBlocked = true;
    handleComputerMoves(player2);
  });
});

p1Tiles.forEach((tile) => {
  tile.addEventListener("click", () => {
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
    let result = player1.playerGameboard.receiveAttack(
      selectedRow,
      selectedCol,
    );
    if (result) {
      tile.classList.add("shot-tile");
    } else {
      tile.classList.add("missed-tile");
    }
    if (player1.playerGameboard.allSunk()) {
      headingStatus.textContent =
        "Game over, player 2 has won this round of Battleship!";
      movesBlocked = true;
      p1Tiles.forEach((tile) => tile.classList.add("locked-tile"));
      p2Tiles.forEach((tile) => tile.classList.add("locked-tile"));
      return;
    }
    currentPlayer = 1;
    headingStatus.textContent = `It's player ${currentPlayer}'s turn!`;
  });
});
