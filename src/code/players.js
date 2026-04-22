import CreateGameboard from "../code/gameboard.js";

function getRandomInt(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
}

function getComputerMove(playerGameboard) {
  let xCoord = getRandomInt(0, 10);
  let yCoord = getRandomInt(0, 10);
  let illegal = true;

  while (illegal) {
    illegal = false;
    for (const element of playerGameboard.getIllegalMoves()) {
      let [a, b] = element;
      if (xCoord === a && yCoord === b) {
        xCoord = getRandomInt(0, 10);
        yCoord = getRandomInt(0, 10);
        illegal = true;
        break;
      }
    }
  }
  playerGameboard.getIllegalMoves().push([xCoord, yCoord]);
  return [xCoord, yCoord];
}

class Player {
  constructor(type = "real") {
    this.playerType = type;
    this.playerGameboard = CreateGameboard();
    if (type === "computer") {
      this.computerMove = getComputerMove;
    }
  }
}

export default Player;
