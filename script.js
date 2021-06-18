import map from './map.js';
import paintMap from './drawings.js';

function createInitialPopulation() {
  var a, b;
  snakes.push(createAnimal("snake", "male"));
  snakes.push(createAnimal("snake", "female"));

  for (a = 0, b = 0; a < 4; a++, b++) {
    frogs.push(
      b <= 1 ? createAnimal("frog", "male") : createAnimal("frog", "female")
    );
  }

  for (a = 0, b = 0; a < 8; a++, b++) {
    flies.push(
      b <= 3 ? createAnimal("fly", "male") : createAnimal("fly", "female")
    );
  }

  for (let c = 0; c < snakes.length; c++) {
    map[snakes[c].x][snakes[c].y] = 2;
  }

  for (let c = 0; c < frogs.length; c++) {
    map[frogs[c].x][frogs[c].y] = 3;
  }

  for (let c = 0; c < flies.length; c++) {
    map[flies[c].x][flies[c].y] = 4;
  }
}

function createAnimal(type, sex) {
  const Animal = {
    type,
    x: 0,
    y: 0,
    sex,
    secondsToLive: 900,
    secondsToFeed: 1,
    secondsToHeat: 1,
    direction: 0, // Clockwise with 0 being north
    isAlive: true,
    isInHeat: false,

    subtractSecondsToLive() {
      this.secondsToLive--;
      if (this.secondsToLive <= 0) {
        this.killSelf();
      }
    },
    subtractHunger() {
      this.secondsToFeed--;
      if (this.secondsToFeed <= -1200) {
        this.killSelf();
      }
    },
    subtractHeatTime() {
      if (this.sex != "female") return;
      this.secondsToHeat--;
      if (this.secondsToHeat <= 0) this.isInHeat = true;
    },
    killSelf() {
      this.isAlive = false;
    },
    tryFeeding() {
      if (this.secondsToFeed > 0) return;

      if (this.type === "snake") {
        verifiyAnimalToKillAt(this.x, this.y, "frog");
      } else if (this.type === "frog") {
        verifiyAnimalToKillAt(this.x, this.y, "fly");
      }
      //this.secondsToFeed = 120;
    },
    tryMating() {
      if (this.secondsToHeat > 0) return;

      if (this.type === "snake") {
        verifiyOpositeSexAt(this.x, this.y, "snake", this.sex);
      } else if (this.type === "frog") {
        verifiyOpositeSexAt(this.x, this.y, "frog", this.sex);
      } else verifiyOpositeSexAt(this.x, this.y, "fly", this.sex);
    },
  };

  Animal.secondsToLive = Math.floor(Math.random() * 1000);
  Animal.secondsToFeed = Math.floor(Math.random() * 1);
  Animal.secondsToHeat = 2;
  Animal.direction = Math.floor(Math.random() * 3);
  Animal.isAlive = true;

 // if (sex == "female") secondsToHeat = Math.floor(Math.random() * 120);

  do {
    Animal.x = Math.floor(Math.random() * 20); // returns a random between 0 and 19
    Animal.y = Math.floor(Math.random() * 20); // returns a random between 0 and 19
  } while (map[Animal.x][Animal.y] == 0);

  return Animal;
}

function cleanDead() {
  for (let a = 0; a < snakes.length; a++) {
    if (!snakes[a].isAlive) snakes.splice(a, 1);
  }

  for (let b = 0; b < frogs.length; b++) {
    if (!frogs[b].isAlive) frogs.splice(b, 1);
  }

  for (let c = 0; c < flies.length; c++) {
    if (!flies[c].isAlive) flies.splice(c, 1);
  }
}

function verifiyAnimalToKillAt(x, y, type) {
  if (type === "frog") {
    frogs.map((frog) => {
      if (frog.x === x && frog.y === y) {
        frog.isAlive = false;
        console.log("snake ate frog")
      }
      return frog;
    });
    flies.map((fly) => {
      if (fly.x === x && fly.y === y) {
        fly.isAlive = false;
        console.log("frog ate fly")
      }
      return fly;
    });
  }
}

function verifiyOpositeSexAt(x, y, type, sex) {
  if (type === "snake") {
    snakes.forEach((snake) => {
      if (snake.x === x && snake.y === y) {
        if (
          (snake.sex === "male" && sex === "female") ||
          (snake.sex === "female" && sex === "male")
        ) {
          const coinFlip = Math.floor(Math.random() * 2);
          if (coinFlip === 0) snakes.push(createAnimal("snake", "male"));
          else snakes.push(createAnimal("snake", "female"));
          console.log("snake mated");
        }
      }
    });
  }
  else if (type === "frog") {
    frogs.forEach((frog) => {
      if (frog.x === x && frog.y === y) {
        if (
          (frog.sex === "male" && sex === "female") ||
          (frog.sex === "female" && sex === "male")
        ) {
          const coinFlip = Math.floor(Math.random() * 2);
          if (coinFlip === 0) frogs.push(createAnimal("frog", "male"));
          else frogs.push(createAnimal("frog", "female"));
          console.log("frog mated");
        }
      }
    });
  }
  else if (type === "fly") {
    flies.forEach((fly) => {
      if (fly.x === x && fly.y === y) {
        if (
          (fly.sex === "male" && sex === "female") ||
          (fly.sex === "female" && sex === "male")
        ) {
          const coinFlip = Math.floor(Math.random() * 2);
          if (coinFlip === 0) flies.push(createAnimal("fly", "male"));
          else flies.push(createAnimal("fly", "female"));
          console.log("fly mated");
        }
      }
    });
  }
}

function move() {
  let possibilities = [];

  for (let a = 0; a < snakes.length; a++) {
    if (!snakes[a].isAlive) continue;
    if (snakes[a].direction === 0) {
      if (map[snakes[a].x - 1][snakes[a].y] != 0) possibilities.push(0);
      if (map[snakes[a].x][snakes[a].y + 1] != 0) possibilities.push(1);
      if (map[snakes[a].x][snakes[a].y - 1] != 0) possibilities.push(3);
      //only goes backwards if there is no other option to go
      if (
        map[snakes[a].x - 1][snakes[a].y] === 0 &&
        map[snakes[a].x][snakes[a].y + 1] === 0 &&
        map[snakes[a].x][snakes[a].y - 1] === 0
      )
        possibilities.push(2);
    } else if (snakes[a].direction === 1) {
      if (map[snakes[a].x][snakes[a].y + 1] != 0) possibilities.push(1);
      if (map[snakes[a].x + 1][snakes[a].y] != 0) possibilities.push(2);
      if (map[snakes[a].x - 1][snakes[a].y] != 0) possibilities.push(0);
      //only goes backwards if there is no other option to go
      if (
        map[snakes[a].x][snakes[a].y + 1] === 0 &&
        map[snakes[a].x + 1][snakes[a].y] === 0 &&
        map[snakes[a].x - 1][snakes[a].y] === 0
      )
        possibilities.push(3);
    } else if (snakes[a].direction === 2) {
      if (map[snakes[a].x + 1][snakes[a].y] != 0) possibilities.push(2);
      if (map[snakes[a].x][snakes[a].y - 1] != 0) possibilities.push(3);
      if (map[snakes[a].x][snakes[a].y + 1] != 0) possibilities.push(1);
      //only goes backwards if there is no other option to go
      if (
        map[snakes[a].x + 1][snakes[a].y] === 0 &&
        map[snakes[a].x + 1][snakes[a].y] === 0 &&
        map[snakes[a].x][snakes[a].y + 1] === 0
      )
        possibilities.push(0);
    } else if (snakes[a].direction === 3) {
      if (map[snakes[a].x][snakes[a].y - 1] != 0) possibilities.push(3);
      if (map[snakes[a].x - 1][snakes[a].y] != 0) possibilities.push(0);
      if (map[snakes[a].x + 1][snakes[a].y] != 0) possibilities.push(2);
      //only goes backwards if there is no other option to go
      if (
        map[snakes[a].x][snakes[a].y - 1] === 0 &&
        map[snakes[a].x - 1][snakes[a].y] === 0 &&
        map[snakes[a].x + 1][snakes[a].y] === 0
      )
        possibilities.push(1);
    }

    let chosen =
      possibilities[Math.floor(Math.random() * possibilities.length)];

    snakes[a].direction = chosen;
    map[snakes[a].x][snakes[a].y] = 1;

    if (snakes[a].direction === 0) {
      snakes[a].x--;
    } else if (snakes[a].direction === 1) {
      snakes[a].y++;
    } else if (snakes[a].direction === 2) {
      snakes[a].x++;
    } else if (snakes[a].direction === 3) {
      snakes[a].y--;
    }

    map[snakes[a].x][snakes[a].y] = 2;
    possibilities = [];
  }

  for (let a = 0; a < frogs.length; a++) {
    if (!frogs[a].isAlive) continue;
    if (frogs[a].direction === 0) {
      if (map[frogs[a].x - 1][frogs[a].y] != 0) possibilities.push(0);
      if (map[frogs[a].x][frogs[a].y + 1] != 0) possibilities.push(1);
      if (map[frogs[a].x][frogs[a].y - 1] != 0) possibilities.push(3);
      //only goes backwards if there is no other option to go
      if (
        map[frogs[a].x - 1][frogs[a].y] === 0 &&
        map[frogs[a].x][frogs[a].y + 1] === 0 &&
        map[frogs[a].x][frogs[a].y - 1] === 0
      )
        possibilities.push(2);
    } else if (frogs[a].direction === 1) {
      if (map[frogs[a].x][frogs[a].y + 1] != 0) possibilities.push(1);
      if (map[frogs[a].x + 1][frogs[a].y] != 0) possibilities.push(2);
      if (map[frogs[a].x - 1][frogs[a].y] != 0) possibilities.push(0);
      //only goes backwards if there is no other option to go
      if (
        map[frogs[a].x][frogs[a].y + 1] === 0 &&
        map[frogs[a].x + 1][frogs[a].y] === 0 &&
        map[frogs[a].x - 1][frogs[a].y] === 0
      )
        possibilities.push(3);
    } else if (frogs[a].direction === 2) {
      if (map[frogs[a].x + 1][frogs[a].y] != 0) possibilities.push(2);
      if (map[frogs[a].x][frogs[a].y - 1] != 0) possibilities.push(3);
      if (map[frogs[a].x][frogs[a].y + 1] != 0) possibilities.push(1);
      //only goes backwards if there is no other option to go
      if (
        map[frogs[a].x + 1][frogs[a].y] === 0 &&
        map[frogs[a].x + 1][frogs[a].y] === 0 &&
        map[frogs[a].x][frogs[a].y + 1] === 0
      )
        possibilities.push(0);
    } else if (frogs[a].direction === 3) {
      if (map[frogs[a].x][frogs[a].y - 1] != 0) possibilities.push(3);
      if (map[frogs[a].x - 1][frogs[a].y] != 0) possibilities.push(0);
      if (map[frogs[a].x + 1][frogs[a].y] != 0) possibilities.push(2);
      //only goes backwards if there is no other option to go
      if (
        map[frogs[a].x][frogs[a].y - 1] === 0 &&
        map[frogs[a].x - 1][frogs[a].y] === 0 &&
        map[frogs[a].x + 1][frogs[a].y] === 0
      )
        possibilities.push(1);
    }

    let chosen =
      possibilities[Math.floor(Math.random() * possibilities.length)];
    frogs[a].direction = chosen;
    map[frogs[a].x][frogs[a].y] = 1;

    if (frogs[a].direction === 0) {
      frogs[a].x--;
    } else if (frogs[a].direction === 1) {
      frogs[a].y++;
    } else if (frogs[a].direction === 2) {
      frogs[a].x++;
    } else if (frogs[a].direction === 3) {
      frogs[a].y--;
    }

    map[frogs[a].x][frogs[a].y] = 3;
    possibilities = [];
  }

  for (let a = 0; a < flies.length; a++) {
    if (!flies[a].isAlive) continue;
    if (flies[a].direction === 0) {
      if (map[flies[a].x - 1][flies[a].y] != 0) possibilities.push(0);
      if (map[flies[a].x][flies[a].y + 1] != 0) possibilities.push(1);
      if (map[flies[a].x][flies[a].y - 1] != 0) possibilities.push(3);
      //only goes backwards if there is no other option to go
      if (
        map[flies[a].x - 1][flies[a].y] === 0 &&
        map[flies[a].x][flies[a].y + 1] === 0 &&
        map[flies[a].x][flies[a].y - 1] === 0
      )
        possibilities.push(2);
    } else if (flies[a].direction === 1) {
      if (map[flies[a].x][flies[a].y + 1] != 0) possibilities.push(1);
      if (map[flies[a].x + 1][flies[a].y] != 0) possibilities.push(2);
      if (map[flies[a].x - 1][flies[a].y] != 0) possibilities.push(0);
      //only goes backwards if there is no other option to go
      if (
        map[flies[a].x][flies[a].y + 1] === 0 &&
        map[flies[a].x + 1][flies[a].y] === 0 &&
        map[flies[a].x - 1][flies[a].y] === 0
      )
        possibilities.push(3);
    } else if (flies[a].direction === 2) {
      if (map[flies[a].x + 1][flies[a].y] != 0) possibilities.push(2);
      if (map[flies[a].x][flies[a].y - 1] != 0) possibilities.push(3);
      if (map[flies[a].x][flies[a].y + 1] != 0) possibilities.push(1);
      //only goes backwards if there is no other option to go
      if (
        map[flies[a].x + 1][flies[a].y] === 0 &&
        map[flies[a].x + 1][flies[a].y] === 0 &&
        map[flies[a].x][flies[a].y + 1] === 0
      )
        possibilities.push(0);
    } else if (flies[a].direction === 3) {
      if (map[flies[a].x][flies[a].y - 1] != 0) possibilities.push(3);
      if (map[flies[a].x - 1][flies[a].y] != 0) possibilities.push(0);
      if (map[flies[a].x + 1][flies[a].y] != 0) possibilities.push(2);
      //only goes backwards if there is no other option to go
      if (
        map[flies[a].x][flies[a].y - 1] === 0 &&
        map[flies[a].x - 1][flies[a].y] === 0 &&
        map[flies[a].x + 1][flies[a].y] === 0
      )
        possibilities.push(1);
    }

    let chosen =
      possibilities[Math.floor(Math.random() * possibilities.length)];
    flies[a].direction = chosen;
    map[flies[a].x][flies[a].y] = 1;

    if (flies[a].direction === 0) {
      flies[a].x--;
    } else if (flies[a].direction === 1) {
      flies[a].y++;
    } else if (flies[a].direction === 2) {
      flies[a].x++;
    } else if (flies[a].direction === 3) {
      flies[a].y--;
    }

    map[flies[a].x][flies[a].y] = 4;
    possibilities = [];
  }
}

function update() {
  for (let a = 0; a < snakes.length; a++) {
    if (!snakes[a].isAlive) continue;
    snakes[a].subtractSecondsToLive();
    snakes[a].subtractHunger();
    snakes[a].subtractHeatTime();
    snakes[a].tryFeeding();
    snakes[a].tryMating();
  }

  for (let b = 0; b < frogs.length; b++) {
    if (!frogs[b].isAlive) continue;
    frogs[b].subtractSecondsToLive();
    frogs[b].subtractHunger();
    frogs[b].subtractHeatTime();
    frogs[b].tryFeeding();
    frogs[b].tryMating();
  }

  for (let c = 0; c < flies.length; c++) {
    if (!flies[c].isAlive) continue;
    flies[c].subtractSecondsToLive();
    flies[c].subtractHunger();
    flies[c].subtractHeatTime();
    flies[c].tryMating();
  }

  totalSnakes = snakes.length;
  totalFrogs = frogs.length;
  totalFlies = flies.length;
  totalSnakesDOM.innerHTML = `Total Snakes: ${totalSnakes}`;
  totalFrogsDOM.innerHTML = `Total Frogs: ${totalFrogs}`;
  totalFliesDOM.innerHTML = `Total Flies: ${totalFlies}`;
}


let snakes = [];
let frogs = [];
let flies = [];
let totalSnakes = 0;
let totalFrogs = 0;
let totalFlies = 0;
let totalSnakesDOM = document.querySelector("#TotalSnakes")
let totalFrogsDOM = document.querySelector("#TotalFrogs")
let totalFliesDOM = document.querySelector("#TotalFlies")
createInitialPopulation();

setInterval(() => {
  move();
  update();
  cleanDead();
  paintMap();
}, 1000);
