import CreateGameboard from "../code/gameboard.js";

class Player {
  constructor(type = "real") {
    this.playerType = type;
    this.playerGameboard = CreateGameboard();
  }
}

export default Player;