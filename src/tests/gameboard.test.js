import CreateGameboard from "../code/gameboard.js";

describe("Gameboard initialisation & method testing", () => {
  test("Gameboard initialises correctly as a 10x10 grid", () => {
    const gameboard = CreateGameboard();
    const board = gameboard.getBoard();
    expect(board.length).toBe(10);
    expect(board[0].length).toBe(10);
  });

  test("Gameboard allows ships to be placed at a specific coordinate", () => {
    const gameboard = CreateGameboard();
    expect(gameboard.placeShip(2, 3, 1)).toBeTruthy();
  });

  test("Gameboard rejects ships to be placed at occupied coordinates", () => {
    const gameboard = CreateGameboard();
    gameboard.placeShip(2, 3, 5);

    expect(gameboard.placeShip(2, 3, 1)).toBeFalsy();
  });

  test("Gameboard rejects placing ships in coordinates out of bounds", () => {
    const gameboard = CreateGameboard();
    expect(gameboard.placeShip(11, 12, 1)).toBeFalsy();
  });

  test("Gameboard correctly places ships with a length greater than 1", () => {
    const gameboard = CreateGameboard();
    gameboard.placeShip(0, 0, 3);
    const board = gameboard.getBoard();

    expect(board[0][0].ship).not.toBeNull();
    expect(board[0][1].ship).not.toBeNull();
    expect(board[0][2].ship).not.toBeNull();
  });

  test("Gameboard allows ships to get hit & updates state correctly", () => {
    const gameboard = CreateGameboard();
    gameboard.placeShip(0, 0, 3);
    gameboard.receiveAttack(0, 1);
    const board = gameboard.getBoard();

    expect(board[0][1].hit).toBeTruthy();
  });

  test("Gameboard correctly stores missed shots", () => {
    const gameboard = CreateGameboard();
    gameboard.receiveAttack(7, 8);
    const missedShots = gameboard.getMissedShots();
    expect(missedShots).toEqual([[7, 8]]);
  });

  test("Gameboard correctly detects once all ships have sinked", () => {
    const gameboard = CreateGameboard();
    gameboard.placeShip(0, 0, 2);
    gameboard.placeShip(5, 0, 1);

    expect(gameboard.allSunk()).toBe(false);

    gameboard.receiveAttack(0, 0);
    gameboard.receiveAttack(0, 1);
    gameboard.receiveAttack(5,0);

    expect(gameboard.allSunk()).toBe(true);
  });
});
