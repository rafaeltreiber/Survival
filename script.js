const map = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0],
  [0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0],
  [0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0],
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 1, 0],
  [0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 0],
  [0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0],
  [0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 0],
  [0, 1, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 1, 0],
  [0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0],
  [0, 1, 1, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0],
  [0, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0],
  [0, 1, 1, 1, 1, 0, 1, 0, 0, 0, 1, 0, 0, 1, 1, 1, 1, 0, 1, 0],
  [0, 1, 0, 0, 1, 0, 1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0],
  [0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0],
  [0, 1, 1, 1, 1, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 1, 1, 0],
  [0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0],
  [0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
  [0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

function createMap() {
  for (let a = 0; a < 10; a++) {
    for (let b = 0; b < 10; b++) {
      map[a][b] = Math.floor(Math.random() * 2); // returns a random between 0 and 1
    }
  }
}

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

function getTileDrawing(posX, posY) {
  switch (map[posX][posY]) {
    case 0:
      return "./images/black.png";
    case 1:
      return "./images/white.png";
    case 2:
      return "./images/red.png";
    case 3:
      return "./images/green.png";
    case 4:
      return "./images/gray.png";
  }
}

function paintMap() {
  let imagem0000 = document.querySelector("#imagem0000");
  let imagem0001 = document.querySelector("#imagem0001");
  let imagem0002 = document.querySelector("#imagem0002");
  let imagem0003 = document.querySelector("#imagem0003");
  let imagem0004 = document.querySelector("#imagem0004");
  let imagem0005 = document.querySelector("#imagem0005");
  let imagem0006 = document.querySelector("#imagem0006");
  let imagem0007 = document.querySelector("#imagem0007");
  let imagem0008 = document.querySelector("#imagem0008");
  let imagem0009 = document.querySelector("#imagem0009");
  let imagem0010 = document.querySelector("#imagem0010");
  let imagem0011 = document.querySelector("#imagem0011");
  let imagem0012 = document.querySelector("#imagem0012");
  let imagem0013 = document.querySelector("#imagem0013");
  let imagem0014 = document.querySelector("#imagem0014");
  let imagem0015 = document.querySelector("#imagem0015");
  let imagem0016 = document.querySelector("#imagem0016");
  let imagem0017 = document.querySelector("#imagem0017");
  let imagem0018 = document.querySelector("#imagem0018");
  let imagem0019 = document.querySelector("#imagem0019");

  let imagem0100 = document.querySelector("#imagem0100");
  let imagem0101 = document.querySelector("#imagem0101");
  let imagem0102 = document.querySelector("#imagem0102");
  let imagem0103 = document.querySelector("#imagem0103");
  let imagem0104 = document.querySelector("#imagem0104");
  let imagem0105 = document.querySelector("#imagem0105");
  let imagem0106 = document.querySelector("#imagem0106");
  let imagem0107 = document.querySelector("#imagem0107");
  let imagem0108 = document.querySelector("#imagem0108");
  let imagem0109 = document.querySelector("#imagem0109");
  let imagem0110 = document.querySelector("#imagem0110");
  let imagem0111 = document.querySelector("#imagem0111");
  let imagem0112 = document.querySelector("#imagem0112");
  let imagem0113 = document.querySelector("#imagem0113");
  let imagem0114 = document.querySelector("#imagem0114");
  let imagem0115 = document.querySelector("#imagem0115");
  let imagem0116 = document.querySelector("#imagem0116");
  let imagem0117 = document.querySelector("#imagem0117");
  let imagem0118 = document.querySelector("#imagem0118");
  let imagem0119 = document.querySelector("#imagem0119");

  let imagem0200 = document.querySelector("#imagem0200");
  let imagem0201 = document.querySelector("#imagem0201");
  let imagem0202 = document.querySelector("#imagem0202");
  let imagem0203 = document.querySelector("#imagem0203");
  let imagem0204 = document.querySelector("#imagem0204");
  let imagem0205 = document.querySelector("#imagem0205");
  let imagem0206 = document.querySelector("#imagem0206");
  let imagem0207 = document.querySelector("#imagem0207");
  let imagem0208 = document.querySelector("#imagem0208");
  let imagem0209 = document.querySelector("#imagem0209");
  let imagem0210 = document.querySelector("#imagem0210");
  let imagem0211 = document.querySelector("#imagem0211");
  let imagem0212 = document.querySelector("#imagem0212");
  let imagem0213 = document.querySelector("#imagem0213");
  let imagem0214 = document.querySelector("#imagem0214");
  let imagem0215 = document.querySelector("#imagem0215");
  let imagem0216 = document.querySelector("#imagem0216");
  let imagem0217 = document.querySelector("#imagem0217");
  let imagem0218 = document.querySelector("#imagem0218");
  let imagem0219 = document.querySelector("#imagem0219");

  let imagem0300 = document.querySelector("#imagem0300");
  let imagem0301 = document.querySelector("#imagem0301");
  let imagem0302 = document.querySelector("#imagem0302");
  let imagem0303 = document.querySelector("#imagem0303");
  let imagem0304 = document.querySelector("#imagem0304");
  let imagem0305 = document.querySelector("#imagem0305");
  let imagem0306 = document.querySelector("#imagem0306");
  let imagem0307 = document.querySelector("#imagem0307");
  let imagem0308 = document.querySelector("#imagem0308");
  let imagem0309 = document.querySelector("#imagem0309");
  let imagem0310 = document.querySelector("#imagem0310");
  let imagem0311 = document.querySelector("#imagem0311");
  let imagem0312 = document.querySelector("#imagem0312");
  let imagem0313 = document.querySelector("#imagem0313");
  let imagem0314 = document.querySelector("#imagem0314");
  let imagem0315 = document.querySelector("#imagem0315");
  let imagem0316 = document.querySelector("#imagem0316");
  let imagem0317 = document.querySelector("#imagem0317");
  let imagem0318 = document.querySelector("#imagem0318");
  let imagem0319 = document.querySelector("#imagem0319");

  let imagem0400 = document.querySelector("#imagem0400");
  let imagem0401 = document.querySelector("#imagem0401");
  let imagem0402 = document.querySelector("#imagem0402");
  let imagem0403 = document.querySelector("#imagem0403");
  let imagem0404 = document.querySelector("#imagem0404");
  let imagem0405 = document.querySelector("#imagem0405");
  let imagem0406 = document.querySelector("#imagem0406");
  let imagem0407 = document.querySelector("#imagem0407");
  let imagem0408 = document.querySelector("#imagem0408");
  let imagem0409 = document.querySelector("#imagem0409");
  let imagem0410 = document.querySelector("#imagem0410");
  let imagem0411 = document.querySelector("#imagem0411");
  let imagem0412 = document.querySelector("#imagem0412");
  let imagem0413 = document.querySelector("#imagem0413");
  let imagem0414 = document.querySelector("#imagem0414");
  let imagem0415 = document.querySelector("#imagem0415");
  let imagem0416 = document.querySelector("#imagem0416");
  let imagem0417 = document.querySelector("#imagem0417");
  let imagem0418 = document.querySelector("#imagem0418");
  let imagem0419 = document.querySelector("#imagem0419");

  let imagem0500 = document.querySelector("#imagem0500");
  let imagem0501 = document.querySelector("#imagem0501");
  let imagem0502 = document.querySelector("#imagem0502");
  let imagem0503 = document.querySelector("#imagem0503");
  let imagem0504 = document.querySelector("#imagem0504");
  let imagem0505 = document.querySelector("#imagem0505");
  let imagem0506 = document.querySelector("#imagem0506");
  let imagem0507 = document.querySelector("#imagem0507");
  let imagem0508 = document.querySelector("#imagem0508");
  let imagem0509 = document.querySelector("#imagem0509");
  let imagem0510 = document.querySelector("#imagem0510");
  let imagem0511 = document.querySelector("#imagem0511");
  let imagem0512 = document.querySelector("#imagem0512");
  let imagem0513 = document.querySelector("#imagem0513");
  let imagem0514 = document.querySelector("#imagem0514");
  let imagem0515 = document.querySelector("#imagem0515");
  let imagem0516 = document.querySelector("#imagem0516");
  let imagem0517 = document.querySelector("#imagem0517");
  let imagem0518 = document.querySelector("#imagem0518");
  let imagem0519 = document.querySelector("#imagem0519");

  let imagem0600 = document.querySelector("#imagem0600");
  let imagem0601 = document.querySelector("#imagem0601");
  let imagem0602 = document.querySelector("#imagem0602");
  let imagem0603 = document.querySelector("#imagem0603");
  let imagem0604 = document.querySelector("#imagem0604");
  let imagem0605 = document.querySelector("#imagem0605");
  let imagem0606 = document.querySelector("#imagem0606");
  let imagem0607 = document.querySelector("#imagem0607");
  let imagem0608 = document.querySelector("#imagem0608");
  let imagem0609 = document.querySelector("#imagem0609");
  let imagem0610 = document.querySelector("#imagem0610");
  let imagem0611 = document.querySelector("#imagem0611");
  let imagem0612 = document.querySelector("#imagem0612");
  let imagem0613 = document.querySelector("#imagem0613");
  let imagem0614 = document.querySelector("#imagem0614");
  let imagem0615 = document.querySelector("#imagem0615");
  let imagem0616 = document.querySelector("#imagem0616");
  let imagem0617 = document.querySelector("#imagem0617");
  let imagem0618 = document.querySelector("#imagem0618");
  let imagem0619 = document.querySelector("#imagem0619");

  let imagem0700 = document.querySelector("#imagem0700");
  let imagem0701 = document.querySelector("#imagem0701");
  let imagem0702 = document.querySelector("#imagem0702");
  let imagem0703 = document.querySelector("#imagem0703");
  let imagem0704 = document.querySelector("#imagem0704");
  let imagem0705 = document.querySelector("#imagem0705");
  let imagem0706 = document.querySelector("#imagem0706");
  let imagem0707 = document.querySelector("#imagem0707");
  let imagem0708 = document.querySelector("#imagem0708");
  let imagem0709 = document.querySelector("#imagem0709");
  let imagem0710 = document.querySelector("#imagem0710");
  let imagem0711 = document.querySelector("#imagem0711");
  let imagem0712 = document.querySelector("#imagem0712");
  let imagem0713 = document.querySelector("#imagem0713");
  let imagem0714 = document.querySelector("#imagem0714");
  let imagem0715 = document.querySelector("#imagem0715");
  let imagem0716 = document.querySelector("#imagem0716");
  let imagem0717 = document.querySelector("#imagem0717");
  let imagem0718 = document.querySelector("#imagem0718");
  let imagem0719 = document.querySelector("#imagem0719");

  let imagem0800 = document.querySelector("#imagem0800");
  let imagem0801 = document.querySelector("#imagem0801");
  let imagem0802 = document.querySelector("#imagem0802");
  let imagem0803 = document.querySelector("#imagem0803");
  let imagem0804 = document.querySelector("#imagem0804");
  let imagem0805 = document.querySelector("#imagem0805");
  let imagem0806 = document.querySelector("#imagem0806");
  let imagem0807 = document.querySelector("#imagem0807");
  let imagem0808 = document.querySelector("#imagem0808");
  let imagem0809 = document.querySelector("#imagem0809");
  let imagem0810 = document.querySelector("#imagem0810");
  let imagem0811 = document.querySelector("#imagem0811");
  let imagem0812 = document.querySelector("#imagem0812");
  let imagem0813 = document.querySelector("#imagem0813");
  let imagem0814 = document.querySelector("#imagem0814");
  let imagem0815 = document.querySelector("#imagem0815");
  let imagem0816 = document.querySelector("#imagem0816");
  let imagem0817 = document.querySelector("#imagem0817");
  let imagem0818 = document.querySelector("#imagem0818");
  let imagem0819 = document.querySelector("#imagem0819");

  let imagem0900 = document.querySelector("#imagem0900");
  let imagem0901 = document.querySelector("#imagem0901");
  let imagem0902 = document.querySelector("#imagem0902");
  let imagem0903 = document.querySelector("#imagem0903");
  let imagem0904 = document.querySelector("#imagem0904");
  let imagem0905 = document.querySelector("#imagem0905");
  let imagem0906 = document.querySelector("#imagem0906");
  let imagem0907 = document.querySelector("#imagem0907");
  let imagem0908 = document.querySelector("#imagem0908");
  let imagem0909 = document.querySelector("#imagem0909");
  let imagem0910 = document.querySelector("#imagem0910");
  let imagem0911 = document.querySelector("#imagem0911");
  let imagem0912 = document.querySelector("#imagem0912");
  let imagem0913 = document.querySelector("#imagem0913");
  let imagem0914 = document.querySelector("#imagem0914");
  let imagem0915 = document.querySelector("#imagem0915");
  let imagem0916 = document.querySelector("#imagem0916");
  let imagem0917 = document.querySelector("#imagem0917");
  let imagem0918 = document.querySelector("#imagem0918");
  let imagem0919 = document.querySelector("#imagem0919");

  let imagem1000 = document.querySelector("#imagem1000");
  let imagem1001 = document.querySelector("#imagem1001");
  let imagem1002 = document.querySelector("#imagem1002");
  let imagem1003 = document.querySelector("#imagem1003");
  let imagem1004 = document.querySelector("#imagem1004");
  let imagem1005 = document.querySelector("#imagem1005");
  let imagem1006 = document.querySelector("#imagem1006");
  let imagem1007 = document.querySelector("#imagem1007");
  let imagem1008 = document.querySelector("#imagem1008");
  let imagem1009 = document.querySelector("#imagem1009");
  let imagem1010 = document.querySelector("#imagem1010");
  let imagem1011 = document.querySelector("#imagem1011");
  let imagem1012 = document.querySelector("#imagem1012");
  let imagem1013 = document.querySelector("#imagem1013");
  let imagem1014 = document.querySelector("#imagem1014");
  let imagem1015 = document.querySelector("#imagem1015");
  let imagem1016 = document.querySelector("#imagem1016");
  let imagem1017 = document.querySelector("#imagem1017");
  let imagem1018 = document.querySelector("#imagem1018");
  let imagem1019 = document.querySelector("#imagem1019");

  let imagem1100 = document.querySelector("#imagem1100");
  let imagem1101 = document.querySelector("#imagem1101");
  let imagem1102 = document.querySelector("#imagem1102");
  let imagem1103 = document.querySelector("#imagem1103");
  let imagem1104 = document.querySelector("#imagem1104");
  let imagem1105 = document.querySelector("#imagem1105");
  let imagem1106 = document.querySelector("#imagem1106");
  let imagem1107 = document.querySelector("#imagem1107");
  let imagem1108 = document.querySelector("#imagem1108");
  let imagem1109 = document.querySelector("#imagem1109");
  let imagem1110 = document.querySelector("#imagem1110");
  let imagem1111 = document.querySelector("#imagem1111");
  let imagem1112 = document.querySelector("#imagem1112");
  let imagem1113 = document.querySelector("#imagem1113");
  let imagem1114 = document.querySelector("#imagem1114");
  let imagem1115 = document.querySelector("#imagem1115");
  let imagem1116 = document.querySelector("#imagem1116");
  let imagem1117 = document.querySelector("#imagem1117");
  let imagem1118 = document.querySelector("#imagem1118");
  let imagem1119 = document.querySelector("#imagem1119");

  let imagem1200 = document.querySelector("#imagem1200");
  let imagem1201 = document.querySelector("#imagem1201");
  let imagem1202 = document.querySelector("#imagem1202");
  let imagem1203 = document.querySelector("#imagem1203");
  let imagem1204 = document.querySelector("#imagem1204");
  let imagem1205 = document.querySelector("#imagem1205");
  let imagem1206 = document.querySelector("#imagem1206");
  let imagem1207 = document.querySelector("#imagem1207");
  let imagem1208 = document.querySelector("#imagem1208");
  let imagem1209 = document.querySelector("#imagem1209");
  let imagem1210 = document.querySelector("#imagem1210");
  let imagem1211 = document.querySelector("#imagem1211");
  let imagem1212 = document.querySelector("#imagem1212");
  let imagem1213 = document.querySelector("#imagem1213");
  let imagem1214 = document.querySelector("#imagem1214");
  let imagem1215 = document.querySelector("#imagem1215");
  let imagem1216 = document.querySelector("#imagem1216");
  let imagem1217 = document.querySelector("#imagem1217");
  let imagem1218 = document.querySelector("#imagem1218");
  let imagem1219 = document.querySelector("#imagem1219");

  let imagem1300 = document.querySelector("#imagem1300");
  let imagem1301 = document.querySelector("#imagem1301");
  let imagem1302 = document.querySelector("#imagem1302");
  let imagem1303 = document.querySelector("#imagem1303");
  let imagem1304 = document.querySelector("#imagem1304");
  let imagem1305 = document.querySelector("#imagem1305");
  let imagem1306 = document.querySelector("#imagem1306");
  let imagem1307 = document.querySelector("#imagem1307");
  let imagem1308 = document.querySelector("#imagem1308");
  let imagem1309 = document.querySelector("#imagem1309");
  let imagem1310 = document.querySelector("#imagem1310");
  let imagem1311 = document.querySelector("#imagem1311");
  let imagem1312 = document.querySelector("#imagem1312");
  let imagem1313 = document.querySelector("#imagem1313");
  let imagem1314 = document.querySelector("#imagem1314");
  let imagem1315 = document.querySelector("#imagem1315");
  let imagem1316 = document.querySelector("#imagem1316");
  let imagem1317 = document.querySelector("#imagem1317");
  let imagem1318 = document.querySelector("#imagem1318");
  let imagem1319 = document.querySelector("#imagem1319");

  let imagem1400 = document.querySelector("#imagem1400");
  let imagem1401 = document.querySelector("#imagem1401");
  let imagem1402 = document.querySelector("#imagem1402");
  let imagem1403 = document.querySelector("#imagem1403");
  let imagem1404 = document.querySelector("#imagem1404");
  let imagem1405 = document.querySelector("#imagem1405");
  let imagem1406 = document.querySelector("#imagem1406");
  let imagem1407 = document.querySelector("#imagem1407");
  let imagem1408 = document.querySelector("#imagem1408");
  let imagem1409 = document.querySelector("#imagem1409");
  let imagem1410 = document.querySelector("#imagem1410");
  let imagem1411 = document.querySelector("#imagem1411");
  let imagem1412 = document.querySelector("#imagem1412");
  let imagem1413 = document.querySelector("#imagem1413");
  let imagem1414 = document.querySelector("#imagem1414");
  let imagem1415 = document.querySelector("#imagem1415");
  let imagem1416 = document.querySelector("#imagem1416");
  let imagem1417 = document.querySelector("#imagem1417");
  let imagem1418 = document.querySelector("#imagem1418");
  let imagem1419 = document.querySelector("#imagem1419");

  let imagem1500 = document.querySelector("#imagem1500");
  let imagem1501 = document.querySelector("#imagem1501");
  let imagem1502 = document.querySelector("#imagem1502");
  let imagem1503 = document.querySelector("#imagem1503");
  let imagem1504 = document.querySelector("#imagem1504");
  let imagem1505 = document.querySelector("#imagem1505");
  let imagem1506 = document.querySelector("#imagem1506");
  let imagem1507 = document.querySelector("#imagem1507");
  let imagem1508 = document.querySelector("#imagem1508");
  let imagem1509 = document.querySelector("#imagem1509");
  let imagem1510 = document.querySelector("#imagem1510");
  let imagem1511 = document.querySelector("#imagem1511");
  let imagem1512 = document.querySelector("#imagem1512");
  let imagem1513 = document.querySelector("#imagem1513");
  let imagem1514 = document.querySelector("#imagem1514");
  let imagem1515 = document.querySelector("#imagem1515");
  let imagem1516 = document.querySelector("#imagem1516");
  let imagem1517 = document.querySelector("#imagem1517");
  let imagem1518 = document.querySelector("#imagem1518");
  let imagem1519 = document.querySelector("#imagem1519");

  let imagem1600 = document.querySelector("#imagem1600");
  let imagem1601 = document.querySelector("#imagem1601");
  let imagem1602 = document.querySelector("#imagem1602");
  let imagem1603 = document.querySelector("#imagem1603");
  let imagem1604 = document.querySelector("#imagem1604");
  let imagem1605 = document.querySelector("#imagem1605");
  let imagem1606 = document.querySelector("#imagem1606");
  let imagem1607 = document.querySelector("#imagem1607");
  let imagem1608 = document.querySelector("#imagem1608");
  let imagem1609 = document.querySelector("#imagem1609");
  let imagem1610 = document.querySelector("#imagem1610");
  let imagem1611 = document.querySelector("#imagem1611");
  let imagem1612 = document.querySelector("#imagem1612");
  let imagem1613 = document.querySelector("#imagem1613");
  let imagem1614 = document.querySelector("#imagem1614");
  let imagem1615 = document.querySelector("#imagem1615");
  let imagem1616 = document.querySelector("#imagem1616");
  let imagem1617 = document.querySelector("#imagem1617");
  let imagem1618 = document.querySelector("#imagem1618");
  let imagem1619 = document.querySelector("#imagem1619");

  let imagem1700 = document.querySelector("#imagem1700");
  let imagem1701 = document.querySelector("#imagem1701");
  let imagem1702 = document.querySelector("#imagem1702");
  let imagem1703 = document.querySelector("#imagem1703");
  let imagem1704 = document.querySelector("#imagem1704");
  let imagem1705 = document.querySelector("#imagem1705");
  let imagem1706 = document.querySelector("#imagem1706");
  let imagem1707 = document.querySelector("#imagem1707");
  let imagem1708 = document.querySelector("#imagem1708");
  let imagem1709 = document.querySelector("#imagem1709");
  let imagem1710 = document.querySelector("#imagem1710");
  let imagem1711 = document.querySelector("#imagem1711");
  let imagem1712 = document.querySelector("#imagem1712");
  let imagem1713 = document.querySelector("#imagem1713");
  let imagem1714 = document.querySelector("#imagem1714");
  let imagem1715 = document.querySelector("#imagem1715");
  let imagem1716 = document.querySelector("#imagem1716");
  let imagem1717 = document.querySelector("#imagem1717");
  let imagem1718 = document.querySelector("#imagem1718");
  let imagem1719 = document.querySelector("#imagem1719");

  let imagem1800 = document.querySelector("#imagem1800");
  let imagem1801 = document.querySelector("#imagem1801");
  let imagem1802 = document.querySelector("#imagem1802");
  let imagem1803 = document.querySelector("#imagem1803");
  let imagem1804 = document.querySelector("#imagem1804");
  let imagem1805 = document.querySelector("#imagem1805");
  let imagem1806 = document.querySelector("#imagem1806");
  let imagem1807 = document.querySelector("#imagem1807");
  let imagem1808 = document.querySelector("#imagem1808");
  let imagem1809 = document.querySelector("#imagem1809");
  let imagem1810 = document.querySelector("#imagem1810");
  let imagem1811 = document.querySelector("#imagem1811");
  let imagem1812 = document.querySelector("#imagem1812");
  let imagem1813 = document.querySelector("#imagem1813");
  let imagem1814 = document.querySelector("#imagem1814");
  let imagem1815 = document.querySelector("#imagem1815");
  let imagem1816 = document.querySelector("#imagem1816");
  let imagem1817 = document.querySelector("#imagem1817");
  let imagem1818 = document.querySelector("#imagem1818");
  let imagem1819 = document.querySelector("#imagem1819");

  let imagem1900 = document.querySelector("#imagem1900");
  let imagem1901 = document.querySelector("#imagem1901");
  let imagem1902 = document.querySelector("#imagem1902");
  let imagem1903 = document.querySelector("#imagem1903");
  let imagem1904 = document.querySelector("#imagem1904");
  let imagem1905 = document.querySelector("#imagem1905");
  let imagem1906 = document.querySelector("#imagem1906");
  let imagem1907 = document.querySelector("#imagem1907");
  let imagem1908 = document.querySelector("#imagem1908");
  let imagem1909 = document.querySelector("#imagem1909");
  let imagem1910 = document.querySelector("#imagem1910");
  let imagem1911 = document.querySelector("#imagem1911");
  let imagem1912 = document.querySelector("#imagem1912");
  let imagem1913 = document.querySelector("#imagem1913");
  let imagem1914 = document.querySelector("#imagem1914");
  let imagem1915 = document.querySelector("#imagem1915");
  let imagem1916 = document.querySelector("#imagem1916");
  let imagem1917 = document.querySelector("#imagem1917");
  let imagem1918 = document.querySelector("#imagem1918");
  let imagem1919 = document.querySelector("#imagem1919");

  imagem0000.src = getTileDrawing(0, 0);
  imagem0001.src = getTileDrawing(0, 1);
  imagem0002.src = getTileDrawing(0, 2);
  imagem0003.src = getTileDrawing(0, 3);
  imagem0004.src = getTileDrawing(0, 4);
  imagem0005.src = getTileDrawing(0, 5);
  imagem0006.src = getTileDrawing(0, 6);
  imagem0007.src = getTileDrawing(0, 7);
  imagem0008.src = getTileDrawing(0, 8);
  imagem0009.src = getTileDrawing(0, 9);
  imagem0010.src = getTileDrawing(0, 10);
  imagem0011.src = getTileDrawing(0, 11);
  imagem0012.src = getTileDrawing(0, 12);
  imagem0013.src = getTileDrawing(0, 13);
  imagem0014.src = getTileDrawing(0, 14);
  imagem0015.src = getTileDrawing(0, 15);
  imagem0016.src = getTileDrawing(0, 16);
  imagem0017.src = getTileDrawing(0, 17);
  imagem0018.src = getTileDrawing(0, 18);
  imagem0019.src = getTileDrawing(0, 19);
  imagem0100.src = getTileDrawing(1, 0);
  imagem0101.src = getTileDrawing(1, 1);
  imagem0102.src = getTileDrawing(1, 2);
  imagem0103.src = getTileDrawing(1, 3);
  imagem0104.src = getTileDrawing(1, 4);
  imagem0105.src = getTileDrawing(1, 5);
  imagem0106.src = getTileDrawing(1, 6);
  imagem0107.src = getTileDrawing(1, 7);
  imagem0108.src = getTileDrawing(1, 8);
  imagem0109.src = getTileDrawing(1, 9);
  imagem0110.src = getTileDrawing(1, 10);
  imagem0111.src = getTileDrawing(1, 11);
  imagem0112.src = getTileDrawing(1, 12);
  imagem0113.src = getTileDrawing(1, 13);
  imagem0114.src = getTileDrawing(1, 14);
  imagem0115.src = getTileDrawing(1, 15);
  imagem0116.src = getTileDrawing(1, 16);
  imagem0117.src = getTileDrawing(1, 17);
  imagem0118.src = getTileDrawing(1, 18);
  imagem0119.src = getTileDrawing(1, 19);
  imagem0200.src = getTileDrawing(2, 0);
  imagem0201.src = getTileDrawing(2, 1);
  imagem0202.src = getTileDrawing(2, 2);
  imagem0203.src = getTileDrawing(2, 3);
  imagem0204.src = getTileDrawing(2, 4);
  imagem0205.src = getTileDrawing(2, 5);
  imagem0206.src = getTileDrawing(2, 6);
  imagem0207.src = getTileDrawing(2, 7);
  imagem0208.src = getTileDrawing(2, 8);
  imagem0209.src = getTileDrawing(2, 9);
  imagem0210.src = getTileDrawing(2, 10);
  imagem0211.src = getTileDrawing(2, 11);
  imagem0212.src = getTileDrawing(2, 12);
  imagem0213.src = getTileDrawing(2, 13);
  imagem0214.src = getTileDrawing(2, 14);
  imagem0215.src = getTileDrawing(2, 15);
  imagem0216.src = getTileDrawing(2, 16);
  imagem0217.src = getTileDrawing(2, 17);
  imagem0218.src = getTileDrawing(2, 18);
  imagem0219.src = getTileDrawing(2, 19);
  imagem0300.src = getTileDrawing(3, 0);
  imagem0301.src = getTileDrawing(3, 1);
  imagem0302.src = getTileDrawing(3, 2);
  imagem0303.src = getTileDrawing(3, 3);
  imagem0304.src = getTileDrawing(3, 4);
  imagem0305.src = getTileDrawing(3, 5);
  imagem0306.src = getTileDrawing(3, 6);
  imagem0307.src = getTileDrawing(3, 7);
  imagem0308.src = getTileDrawing(3, 8);
  imagem0309.src = getTileDrawing(3, 9);
  imagem0310.src = getTileDrawing(3, 10);
  imagem0311.src = getTileDrawing(3, 11);
  imagem0312.src = getTileDrawing(3, 12);
  imagem0313.src = getTileDrawing(3, 13);
  imagem0314.src = getTileDrawing(3, 14);
  imagem0315.src = getTileDrawing(3, 15);
  imagem0316.src = getTileDrawing(3, 16);
  imagem0317.src = getTileDrawing(3, 17);
  imagem0318.src = getTileDrawing(3, 18);
  imagem0319.src = getTileDrawing(3, 19);
  imagem0400.src = getTileDrawing(4, 0);
  imagem0401.src = getTileDrawing(4, 1);
  imagem0402.src = getTileDrawing(4, 2);
  imagem0403.src = getTileDrawing(4, 3);
  imagem0404.src = getTileDrawing(4, 4);
  imagem0405.src = getTileDrawing(4, 5);
  imagem0406.src = getTileDrawing(4, 6);
  imagem0407.src = getTileDrawing(4, 7);
  imagem0408.src = getTileDrawing(4, 8);
  imagem0409.src = getTileDrawing(4, 9);
  imagem0410.src = getTileDrawing(4, 10);
  imagem0411.src = getTileDrawing(4, 11);
  imagem0412.src = getTileDrawing(4, 12);
  imagem0413.src = getTileDrawing(4, 13);
  imagem0414.src = getTileDrawing(4, 14);
  imagem0415.src = getTileDrawing(4, 15);
  imagem0416.src = getTileDrawing(4, 16);
  imagem0417.src = getTileDrawing(4, 17);
  imagem0418.src = getTileDrawing(4, 18);
  imagem0419.src = getTileDrawing(4, 19);
  imagem0500.src = getTileDrawing(5, 0);
  imagem0501.src = getTileDrawing(5, 1);
  imagem0502.src = getTileDrawing(5, 2);
  imagem0503.src = getTileDrawing(5, 3);
  imagem0504.src = getTileDrawing(5, 4);
  imagem0505.src = getTileDrawing(5, 5);
  imagem0506.src = getTileDrawing(5, 6);
  imagem0507.src = getTileDrawing(5, 7);
  imagem0508.src = getTileDrawing(5, 8);
  imagem0509.src = getTileDrawing(5, 9);
  imagem0510.src = getTileDrawing(5, 10);
  imagem0511.src = getTileDrawing(5, 11);
  imagem0512.src = getTileDrawing(5, 12);
  imagem0513.src = getTileDrawing(5, 13);
  imagem0514.src = getTileDrawing(5, 14);
  imagem0515.src = getTileDrawing(5, 15);
  imagem0516.src = getTileDrawing(5, 16);
  imagem0517.src = getTileDrawing(5, 17);
  imagem0518.src = getTileDrawing(5, 18);
  imagem0519.src = getTileDrawing(5, 19);
  imagem0600.src = getTileDrawing(6, 0);
  imagem0601.src = getTileDrawing(6, 1);
  imagem0602.src = getTileDrawing(6, 2);
  imagem0603.src = getTileDrawing(6, 3);
  imagem0604.src = getTileDrawing(6, 4);
  imagem0605.src = getTileDrawing(6, 5);
  imagem0606.src = getTileDrawing(6, 6);
  imagem0607.src = getTileDrawing(6, 7);
  imagem0608.src = getTileDrawing(6, 8);
  imagem0609.src = getTileDrawing(6, 9);
  imagem0610.src = getTileDrawing(6, 10);
  imagem0611.src = getTileDrawing(6, 11);
  imagem0612.src = getTileDrawing(6, 12);
  imagem0613.src = getTileDrawing(6, 13);
  imagem0614.src = getTileDrawing(6, 14);
  imagem0615.src = getTileDrawing(6, 15);
  imagem0616.src = getTileDrawing(6, 16);
  imagem0617.src = getTileDrawing(6, 17);
  imagem0618.src = getTileDrawing(6, 18);
  imagem0619.src = getTileDrawing(6, 19);
  imagem0700.src = getTileDrawing(7, 0);
  imagem0701.src = getTileDrawing(7, 1);
  imagem0702.src = getTileDrawing(7, 2);
  imagem0703.src = getTileDrawing(7, 3);
  imagem0704.src = getTileDrawing(7, 4);
  imagem0705.src = getTileDrawing(7, 5);
  imagem0706.src = getTileDrawing(7, 6);
  imagem0707.src = getTileDrawing(7, 7);
  imagem0708.src = getTileDrawing(7, 8);
  imagem0709.src = getTileDrawing(7, 9);
  imagem0710.src = getTileDrawing(7, 10);
  imagem0711.src = getTileDrawing(7, 11);
  imagem0712.src = getTileDrawing(7, 12);
  imagem0713.src = getTileDrawing(7, 13);
  imagem0714.src = getTileDrawing(7, 14);
  imagem0715.src = getTileDrawing(7, 15);
  imagem0716.src = getTileDrawing(7, 16);
  imagem0717.src = getTileDrawing(7, 17);
  imagem0718.src = getTileDrawing(7, 18);
  imagem0719.src = getTileDrawing(7, 19);
  imagem0800.src = getTileDrawing(8, 0);
  imagem0801.src = getTileDrawing(8, 1);
  imagem0802.src = getTileDrawing(8, 2);
  imagem0803.src = getTileDrawing(8, 3);
  imagem0804.src = getTileDrawing(8, 4);
  imagem0805.src = getTileDrawing(8, 5);
  imagem0806.src = getTileDrawing(8, 6);
  imagem0807.src = getTileDrawing(8, 7);
  imagem0808.src = getTileDrawing(8, 8);
  imagem0809.src = getTileDrawing(8, 9);
  imagem0810.src = getTileDrawing(8, 10);
  imagem0811.src = getTileDrawing(8, 11);
  imagem0812.src = getTileDrawing(8, 12);
  imagem0813.src = getTileDrawing(8, 13);
  imagem0814.src = getTileDrawing(8, 14);
  imagem0815.src = getTileDrawing(8, 15);
  imagem0816.src = getTileDrawing(8, 16);
  imagem0817.src = getTileDrawing(8, 17);
  imagem0818.src = getTileDrawing(8, 18);
  imagem0819.src = getTileDrawing(8, 19);
  imagem0900.src = getTileDrawing(9, 0);
  imagem0901.src = getTileDrawing(9, 1);
  imagem0902.src = getTileDrawing(9, 2);
  imagem0903.src = getTileDrawing(9, 3);
  imagem0904.src = getTileDrawing(9, 4);
  imagem0905.src = getTileDrawing(9, 5);
  imagem0906.src = getTileDrawing(9, 6);
  imagem0907.src = getTileDrawing(9, 7);
  imagem0908.src = getTileDrawing(9, 8);
  imagem0909.src = getTileDrawing(9, 9);
  imagem0910.src = getTileDrawing(9, 10);
  imagem0911.src = getTileDrawing(9, 11);
  imagem0912.src = getTileDrawing(9, 12);
  imagem0913.src = getTileDrawing(9, 13);
  imagem0914.src = getTileDrawing(9, 14);
  imagem0915.src = getTileDrawing(9, 15);
  imagem0916.src = getTileDrawing(9, 16);
  imagem0917.src = getTileDrawing(9, 17);
  imagem0918.src = getTileDrawing(9, 18);
  imagem0919.src = getTileDrawing(9, 19);
  imagem1000.src = getTileDrawing(10, 0);
  imagem1001.src = getTileDrawing(10, 1);
  imagem1002.src = getTileDrawing(10, 2);
  imagem1003.src = getTileDrawing(10, 3);
  imagem1004.src = getTileDrawing(10, 4);
  imagem1005.src = getTileDrawing(10, 5);
  imagem1006.src = getTileDrawing(10, 6);
  imagem1007.src = getTileDrawing(10, 7);
  imagem1008.src = getTileDrawing(10, 8);
  imagem1009.src = getTileDrawing(10, 9);
  imagem1010.src = getTileDrawing(10, 10);
  imagem1011.src = getTileDrawing(10, 11);
  imagem1012.src = getTileDrawing(10, 12);
  imagem1013.src = getTileDrawing(10, 13);
  imagem1014.src = getTileDrawing(10, 14);
  imagem1015.src = getTileDrawing(10, 15);
  imagem1016.src = getTileDrawing(10, 16);
  imagem1017.src = getTileDrawing(10, 17);
  imagem1018.src = getTileDrawing(10, 18);
  imagem1019.src = getTileDrawing(10, 19);
  imagem1100.src = getTileDrawing(11, 0);
  imagem1101.src = getTileDrawing(11, 1);
  imagem1102.src = getTileDrawing(11, 2);
  imagem1103.src = getTileDrawing(11, 3);
  imagem1104.src = getTileDrawing(11, 4);
  imagem1105.src = getTileDrawing(11, 5);
  imagem1106.src = getTileDrawing(11, 6);
  imagem1107.src = getTileDrawing(11, 7);
  imagem1108.src = getTileDrawing(11, 8);
  imagem1109.src = getTileDrawing(11, 9);
  imagem1110.src = getTileDrawing(11, 10);
  imagem1111.src = getTileDrawing(11, 11);
  imagem1112.src = getTileDrawing(11, 12);
  imagem1113.src = getTileDrawing(11, 13);
  imagem1114.src = getTileDrawing(11, 14);
  imagem1115.src = getTileDrawing(11, 15);
  imagem1116.src = getTileDrawing(11, 16);
  imagem1117.src = getTileDrawing(11, 17);
  imagem1118.src = getTileDrawing(11, 18);
  imagem1119.src = getTileDrawing(11, 19);
  imagem1200.src = getTileDrawing(12, 0);
  imagem1201.src = getTileDrawing(12, 1);
  imagem1202.src = getTileDrawing(12, 2);
  imagem1203.src = getTileDrawing(12, 3);
  imagem1204.src = getTileDrawing(12, 4);
  imagem1205.src = getTileDrawing(12, 5);
  imagem1206.src = getTileDrawing(12, 6);
  imagem1207.src = getTileDrawing(12, 7);
  imagem1208.src = getTileDrawing(12, 8);
  imagem1209.src = getTileDrawing(12, 9);
  imagem1210.src = getTileDrawing(12, 10);
  imagem1211.src = getTileDrawing(12, 11);
  imagem1212.src = getTileDrawing(12, 12);
  imagem1213.src = getTileDrawing(12, 13);
  imagem1214.src = getTileDrawing(12, 14);
  imagem1215.src = getTileDrawing(12, 15);
  imagem1216.src = getTileDrawing(12, 16);
  imagem1217.src = getTileDrawing(12, 17);
  imagem1218.src = getTileDrawing(12, 18);
  imagem1219.src = getTileDrawing(12, 19);
  imagem1300.src = getTileDrawing(13, 0);
  imagem1301.src = getTileDrawing(13, 1);
  imagem1302.src = getTileDrawing(13, 2);
  imagem1303.src = getTileDrawing(13, 3);
  imagem1304.src = getTileDrawing(13, 4);
  imagem1305.src = getTileDrawing(13, 5);
  imagem1306.src = getTileDrawing(13, 6);
  imagem1307.src = getTileDrawing(13, 7);
  imagem1308.src = getTileDrawing(13, 8);
  imagem1309.src = getTileDrawing(13, 9);
  imagem1310.src = getTileDrawing(13, 10);
  imagem1311.src = getTileDrawing(13, 11);
  imagem1312.src = getTileDrawing(13, 12);
  imagem1313.src = getTileDrawing(13, 13);
  imagem1314.src = getTileDrawing(13, 14);
  imagem1315.src = getTileDrawing(13, 15);
  imagem1316.src = getTileDrawing(13, 16);
  imagem1317.src = getTileDrawing(13, 17);
  imagem1318.src = getTileDrawing(13, 18);
  imagem1319.src = getTileDrawing(13, 19);
  imagem1400.src = getTileDrawing(14, 0);
  imagem1401.src = getTileDrawing(14, 1);
  imagem1402.src = getTileDrawing(14, 2);
  imagem1403.src = getTileDrawing(14, 3);
  imagem1404.src = getTileDrawing(14, 4);
  imagem1405.src = getTileDrawing(14, 5);
  imagem1406.src = getTileDrawing(14, 6);
  imagem1407.src = getTileDrawing(14, 7);
  imagem1408.src = getTileDrawing(14, 8);
  imagem1409.src = getTileDrawing(14, 9);
  imagem1410.src = getTileDrawing(14, 10);
  imagem1411.src = getTileDrawing(14, 11);
  imagem1412.src = getTileDrawing(14, 12);
  imagem1413.src = getTileDrawing(14, 13);
  imagem1414.src = getTileDrawing(14, 14);
  imagem1415.src = getTileDrawing(14, 15);
  imagem1416.src = getTileDrawing(14, 16);
  imagem1417.src = getTileDrawing(14, 17);
  imagem1418.src = getTileDrawing(14, 18);
  imagem1419.src = getTileDrawing(14, 19);
  imagem1500.src = getTileDrawing(15, 0);
  imagem1501.src = getTileDrawing(15, 1);
  imagem1502.src = getTileDrawing(15, 2);
  imagem1503.src = getTileDrawing(15, 3);
  imagem1504.src = getTileDrawing(15, 4);
  imagem1505.src = getTileDrawing(15, 5);
  imagem1506.src = getTileDrawing(15, 6);
  imagem1507.src = getTileDrawing(15, 7);
  imagem1508.src = getTileDrawing(15, 8);
  imagem1509.src = getTileDrawing(15, 9);
  imagem1510.src = getTileDrawing(15, 10);
  imagem1511.src = getTileDrawing(15, 11);
  imagem1512.src = getTileDrawing(15, 12);
  imagem1513.src = getTileDrawing(15, 13);
  imagem1514.src = getTileDrawing(15, 14);
  imagem1515.src = getTileDrawing(15, 15);
  imagem1516.src = getTileDrawing(15, 16);
  imagem1517.src = getTileDrawing(15, 17);
  imagem1518.src = getTileDrawing(15, 18);
  imagem1519.src = getTileDrawing(15, 19);
  imagem1600.src = getTileDrawing(16, 0);
  imagem1601.src = getTileDrawing(16, 1);
  imagem1602.src = getTileDrawing(16, 2);
  imagem1603.src = getTileDrawing(16, 3);
  imagem1604.src = getTileDrawing(16, 4);
  imagem1605.src = getTileDrawing(16, 5);
  imagem1606.src = getTileDrawing(16, 6);
  imagem1607.src = getTileDrawing(16, 7);
  imagem1608.src = getTileDrawing(16, 8);
  imagem1609.src = getTileDrawing(16, 9);
  imagem1610.src = getTileDrawing(16, 10);
  imagem1611.src = getTileDrawing(16, 11);
  imagem1612.src = getTileDrawing(16, 12);
  imagem1613.src = getTileDrawing(16, 13);
  imagem1614.src = getTileDrawing(16, 14);
  imagem1615.src = getTileDrawing(16, 15);
  imagem1616.src = getTileDrawing(16, 16);
  imagem1617.src = getTileDrawing(16, 17);
  imagem1618.src = getTileDrawing(16, 18);
  imagem1619.src = getTileDrawing(16, 19);
  imagem1700.src = getTileDrawing(17, 0);
  imagem1701.src = getTileDrawing(17, 1);
  imagem1702.src = getTileDrawing(17, 2);
  imagem1703.src = getTileDrawing(17, 3);
  imagem1704.src = getTileDrawing(17, 4);
  imagem1705.src = getTileDrawing(17, 5);
  imagem1706.src = getTileDrawing(17, 6);
  imagem1707.src = getTileDrawing(17, 7);
  imagem1708.src = getTileDrawing(17, 8);
  imagem1709.src = getTileDrawing(17, 9);
  imagem1710.src = getTileDrawing(17, 10);
  imagem1711.src = getTileDrawing(17, 11);
  imagem1712.src = getTileDrawing(17, 12);
  imagem1713.src = getTileDrawing(17, 13);
  imagem1714.src = getTileDrawing(17, 14);
  imagem1715.src = getTileDrawing(17, 15);
  imagem1716.src = getTileDrawing(17, 16);
  imagem1717.src = getTileDrawing(17, 17);
  imagem1718.src = getTileDrawing(17, 18);
  imagem1719.src = getTileDrawing(17, 19);
  imagem1800.src = getTileDrawing(18, 0);
  imagem1801.src = getTileDrawing(18, 1);
  imagem1802.src = getTileDrawing(18, 2);
  imagem1803.src = getTileDrawing(18, 3);
  imagem1804.src = getTileDrawing(18, 4);
  imagem1805.src = getTileDrawing(18, 5);
  imagem1806.src = getTileDrawing(18, 6);
  imagem1807.src = getTileDrawing(18, 7);
  imagem1808.src = getTileDrawing(18, 8);
  imagem1809.src = getTileDrawing(18, 9);
  imagem1810.src = getTileDrawing(18, 10);
  imagem1811.src = getTileDrawing(18, 11);
  imagem1812.src = getTileDrawing(18, 12);
  imagem1813.src = getTileDrawing(18, 13);
  imagem1814.src = getTileDrawing(18, 14);
  imagem1815.src = getTileDrawing(18, 15);
  imagem1816.src = getTileDrawing(18, 16);
  imagem1817.src = getTileDrawing(18, 17);
  imagem1818.src = getTileDrawing(18, 18);
  imagem1819.src = getTileDrawing(18, 19);
  imagem1900.src = getTileDrawing(19, 0);
  imagem1901.src = getTileDrawing(19, 1);
  imagem1902.src = getTileDrawing(19, 2);
  imagem1903.src = getTileDrawing(19, 3);
  imagem1904.src = getTileDrawing(19, 4);
  imagem1905.src = getTileDrawing(19, 5);
  imagem1906.src = getTileDrawing(19, 6);
  imagem1907.src = getTileDrawing(19, 7);
  imagem1908.src = getTileDrawing(19, 8);
  imagem1909.src = getTileDrawing(19, 9);
  imagem1910.src = getTileDrawing(19, 10);
  imagem1911.src = getTileDrawing(19, 11);
  imagem1912.src = getTileDrawing(19, 12);
  imagem1913.src = getTileDrawing(19, 13);
  imagem1914.src = getTileDrawing(19, 14);
  imagem1915.src = getTileDrawing(19, 15);
  imagem1916.src = getTileDrawing(19, 16);
  imagem1917.src = getTileDrawing(19, 17);
  imagem1918.src = getTileDrawing(19, 18);
  imagem1919.src = getTileDrawing(19, 19);
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
