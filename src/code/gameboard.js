import Ship from "../code/ship.js";

function CreateGameboard() {
  const rows = 10;
  const columns = 10;
  const board = [];
  const currentShips = [];
  const missedShots = [];
  const illegalMoves = [];

  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i][j] = { ship: null, hit: false };
    }
  }

  const getBoard = () => board;
  const getMissedShots = () => missedShots;
  const getIllegalMoves = () => illegalMoves;

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
    row = Number(row);
    col = Number(col);
    if (row >= 10 || row < 0 || col >= 10 || col < 0) {
      return false;
    }
    const cell = board[row][col];
    if (cell.ship !== null) {
      const selectedShip = cell.ship;
      cell.hit = true;
      selectedShip.hit();
      return true;
    } else {
      missedShots.push([row, col]);
      return false;
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

  return { getBoard, getMissedShots, getIllegalMoves, placeShip, receiveAttack, allSunk };
}

export default CreateGameboard;
