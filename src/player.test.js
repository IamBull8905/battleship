import { Player } from "./index.js";

describe("Players initialise correctly with correct gameboard & type", () => {
  test("Real player initialises correctly", () => {
    const player = new Player();
    expect(player.playerType).toBe("real");
    expect(player.playerGameboard).toBeDefined();
  });

  test("Computer player initialises correctly", () => {
    const player = new Player("computer");
    expect(player.playerType).toBe("computer");
    expect(player.playerGameboard).toBeDefined();
  });
});
