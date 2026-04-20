import Player from "./players.js";

const firstPlayerContainer = document.querySelector(".first-player-grid");
const secondPlayerContainer = document.querySelector(".second-player-grid");
const p1Tiles = firstPlayerContainer.querySelectorAll(".tile");
const p2Tiles = secondPlayerContainer.querySelectorAll(".tile");

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
const player2 = new Player("computer");

player1.playerGameboard.placeShip(0, 0, 5, "H");
player1.playerGameboard.placeShip(2, 2, 4, "V");
player1.playerGameboard.placeShip(5, 5, 3, "H");
player1.playerGameboard.placeShip(7, 1, 3, "V");
player1.playerGameboard.placeShip(9, 7, 2, "H");

player2.playerGameboard.placeShip(1, 1, 5, "V");
player2.playerGameboard.placeShip(3, 5, 4, "H");
player2.playerGameboard.placeShip(8, 0, 3, "H");
player2.playerGameboard.placeShip(6, 7, 3, "V");
player2.playerGameboard.placeShip(0, 7, 2, "V");

setGridSize(firstPlayerContainer, player1);
setGridSize(secondPlayerContainer, player2);

let currentPlayer = 1;
p2Tiles.forEach((tile) => {
  tile.addEventListener("click", () => {
    if (currentPlayer !== 1) return;
    let selectedRow = tile.dataset.row;
    let selectedCol = tile.dataset.col;
    let result = player2.playerGameboard.receiveAttack(selectedRow,selectedCol);
    if (result) {
      tile.classList.add("shot-tile");
    } else {
      tile.classList.add("missed-tile");
      }
      currentPlayer = 2;
  });
});

p1Tiles.forEach((tile) => {
  tile.addEventListener("click", () => {
    if (currentPlayer !== 2) return;
    let selectedRow = tile.dataset.row;
    let selectedCol = tile.dataset.col;
    let result = player1.playerGameboard.receiveAttack(selectedRow,selectedCol);
    if (result) {
      tile.classList.add("shot-tile");
    } else {
      tile.classList.add("missed-tile");
      }
      currentPlayer = 1;
  });
});
