import "./styles.css";

class Ship {
  constructor(length) {
    this.length = length;
    this.hits = 0;
  }

  hit() {
    this.hits++;
  }

  isSunk() {
    return this.hits >= this.length;
  }
}

function CreateGameboard() {
  const rows = 10;
  const columns = 10;
  const board = [];
  const currentShips = [];
  const missedShots = [];

  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i][j] = { ship: null, hit: false };
    }
  }

  const getBoard = () => board;
  const getMissedShots = () => missedShots;

  const placeShip = function (row, col, shipLength, direction = "H") {
    if (row >= 10 || row < 0 || col >= 10 || col < 0) {
      return false;
    }
    const ship = new Ship(shipLength);
    currentShips.push(ship);

    for (let i = 0; i < shipLength; i++) {
      if (direction === "H") {
        if (col + i > 9) return false;
        if (board[row][col + i].ship !== null) return false;
      } else {
        if (row + i > 9) return false;
        if (board[row + i][col].ship !== null) return false;
      }
    }

    for (let i = 0; i < shipLength; i++) {
      if (direction === "H") {
        board[row][col + i].ship = ship;
      } else {
        board[row + i][col].ship = ship;
      }
    }
    return true;
  };

  const receiveAttack = function (row, col) {
    if (row >= 10 || row < 0 || col >= 10 || col < 0) {
      return false;
    }
    const cell = board[row][col];
    if (cell.ship !== null) {
      const selectedShip = cell.ship;
      cell.hit = true;
      selectedShip.hit();
    } else {
      missedShots.push([row, col]);
    }
  };

  const allSunk = function () {
    for (const ship of currentShips) {
      if (!ship.isSunk()) {
        return false;
      }
    }
    return true;
  };

  return { getBoard, getMissedShots, placeShip, receiveAttack, allSunk };
}

class Player {
  constructor(type = "real") {
    this.playerType = type;
    this.playerGameboard = CreateGameboard();
  }
}

export { Ship, CreateGameboard, Player };