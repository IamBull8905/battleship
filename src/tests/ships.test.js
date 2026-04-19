import Ship from "../code/ship.js";

describe("Ship initialisation & method testing", () => {
  test("Ship initialises correctly", () => {
    const newShip = new Ship(3);
    expect(newShip.length).toBe(3);
    expect(newShip.hits).toBe(0);
    expect(newShip.sunk).toBeFalsy();
  });

  test("Ship can get hit successfully", () => {
    const newShip = new Ship(3);
    newShip.hit();
    expect(newShip.hits).toBe(1);
  });

  test("Ship can accurately report if it has been sunk", () => {
    const newShip = new Ship(2);
    newShip.hit();
    newShip.hit();
    expect(newShip.isSunk()).toBeTruthy();
  });
});
