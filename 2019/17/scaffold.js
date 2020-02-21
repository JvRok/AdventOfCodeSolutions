var fs = require("fs");
require("draftlog").into(console);

var endFlag = false;
var sM = []; //sM = scaffolding map
sM[0] = [];
var attemptCount = 0;
var solved = false;
var cols = 48;
var line = "";
var startPt = { x: 23, y: 23 };
var endPt;
var robot = { x: startPt.x, y: startPt.y, dir: 1, pdir: 0, px: 0, py: 0 };
var bool = false;
//init the grid matrix
/*for (var i = 0; i < cols; i++) {
  gameMap[i] = [];
}
gameMap[startPt.x][startPt.y] = "X";
*/
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

//Dont touch
function splitData(data) {
  return data.toString().split(",");
}

//Convert to int as promise
function convertToInt(array) {
  return new Promise(function(resolve, reject) {
    for (i in array) {
      array[i] = parseInt(array[i], 10);
    }
    resolve(array);
  });
}

//Dont touch
function splitArray(input) {
  return new Promise(function(resolve, reject) {
    input.on("data", function(data) {
      resolve(splitData(data));
    });
  });
}

function calcIndexes(oa, ind, p, rb) {
  return new Promise(function(resolve, reject) {
    switch (p) {
      case undefined:
        resolve(oa[ind]);
        break;
      case "0":
        resolve(oa[ind]);
        break;
      case "1":
        resolve(ind);
        break;
      case "2":
        resolve(rb + oa[ind]);
        break;
    }
  });
}

function getIndexes(oa, ind, rb) {
  return new Promise(async function(resolve, reject) {
    var opcode = oa[ind].toString();
    var opl = opcode.length;
    var inst = "";
    for (var i = opl - 1; i >= 0 && i >= opl - 2; i--) {
      inst = opcode[i] + inst;
    }
    inst = parseInt(inst);
    var p1c = opcode[opl - 3];
    var p2c = opcode[opl - 4];
    var p3c = opcode[opl - 5];

    var i1 = await calcIndexes(oa, ind + 1, p1c, rb);
    var i2 = await calcIndexes(oa, ind + 2, p2c, rb);
    var i3 = await calcIndexes(oa, ind + 3, p3c, rb);

    resolve({ inst: inst, i1: i1, i2: i2, i3: i3 });
  });
}

function isClear(tile) {
  if (
    tile === " " ||
    tile === "O" ||
    tile === "X" ||
    tile === "." ||
    tile === undefined
  ) {
    return true;
  } else {
    return false;
  }
}

function turnBotLeft() {
  if (robot.dir === 1) {
    robot.dir = 3;
  } else if (robot.dir === 2) {
    robot.dir = 4;
  } else if (robot.dir === 4) {
    robot.dir = 1;
  } else {
    robot.dir = 2;
  }
}

function resolveMoveStatus(status) {
  var px = robot.px;
  var py = robot.py;
  if (status === 0) {
    gameMap[px][py] = "#";
    if (attemptCount > 1) {
      turnBotLeft();
      attemptCount = 0;
    }
  } else if (status === 1) {
    attemptCount = 0;
    robot.x = px;
    robot.y = py;
    if (gameMap[robot.x][robot.y] !== "X") {
      gameMap[robot.x][robot.y] = " ";
    } else {
      endFlag = true;
    }
    robot.dir = robot.pdir;
  } else if (status === 2) {
    attemptCount = 0;
    robot.x = px;
    robot.y = py;
    endPt = { x: robot.x, y: robot.y };
    gameMap[px][py] = "O";
    robot.dir = robot.pdir;
  }
}

function setRobotPropDir(propDir) {
  if (propDir === 1) {
    robot.px = robot.x;
    robot.py = robot.y - 1;
  } else if (propDir === 2) {
    robot.px = robot.x;
    robot.py = robot.y + 1;
  } else if (propDir === 3) {
    robot.px = robot.x - 1;
    robot.py = robot.y;
  } else if (propDir === 4) {
    robot.px = robot.x + 1;
    robot.py = robot.y;
  }
}

function proposeMove(status) {
  var x = robot.x;
  var y = robot.y;
  var dir = robot.dir;
  var propDir = 0;
  attemptCount++;
  if (dir === 1) {
    if (isClear(gameMap[x + 1][y])) {
      propDir = 4;
      robot.pdir = 4;
    } else {
      robot.pdir = 1;
      propDir = 1;
    }
  } else if (dir === 2) {
    if (isClear(gameMap[x - 1][y])) {
      propDir = 3;
      robot.pdir = 3;
    } else {
      robot.pdir = 2;
      propDir = 2;
    }
  } else if (dir === 3) {
    if (isClear(gameMap[x][y - 1])) {
      propDir = 1;
      robot.pdir = 1;
    } else {
      robot.pdir = 3;
      propDir = 3;
    }
  } else {
    if (isClear(gameMap[x][y + 1])) {
      propDir = 2;
      robot.pdir = 2;
    } else {
      robot.pdir = 4;
      propDir = 4;
    }
  }
  if (endFlag) {
    return 0;
  }
  //console.log(propDir);
  setRobotPropDir(propDir);
  return propDir;
}

function getValue(oa, i) {
  if (oa[i] === undefined) {
    return 0;
  } else {
    return oa[i];
  }
}

function paintSM() {
  for (var y = 0; y < sM.length; y++) {
    var line = "";
    for (var x = 0; x < sM[y].length; x++) {
      line = line + sM[y][x];
    }
    console.log(line);
  }
}

function addToCoords(x, y, coordsList) {
  if (gameMap[x][y] !== "#" && gameMap[x][y] !== "O") {
    bool = true;
    coordsList.push({ x, y });
  }
  return coordsList;
}

function spreadOxygen() {
  //console.log(gameMap.length);
  var newMap = gameMap.slice(0);
  bool = false;
  var coordsList = [];
  console.log("loop");
  for (var y = 0; y < gameMap.length; y++) {
    for (var x = 0; x < gameMap.length; x++) {
      if (gameMap[x][y] === "O") {
        coords = addToCoords(x - 1, y, coordsList);
        coords = addToCoords(x + 1, y, coordsList);
        coords = addToCoords(x, y - 1, coordsList);
        coords = addToCoords(x, y + 1, coordsList);
      }
    }
  }
  console.log(coordsList);
  for (var c = 0; c < coordsList.length; c++) {
    gameMap[coordsList[c].x][coordsList[c].y] = "O";
  }
  if (!bool) {
    console.log("newmap === gameMap");
    return false;
  } else {
    console.log("newmap !== gameMap");
    gameMap = newMap.slice(0);
    return true;
  }
}

function calcJunctionValue(x, y) {
  if (
    sM[y - 1][x] === "#" &&
    sM[y + 1][x] === "#" &&
    sM[y][x - 1] === "#" &&
    sM[y][x + 1] === "#"
  ) {
    console.log(x, y);
    return x * y;
  } else {
    return 0;
  }
}
//Calculate intersections
function calcInter() {
  var value = 0;
  for (var y = 1; y < sM.length - 1; y++) {
    for (var x = 1; x < sM[y].length - 1; x++) {
      if (sM[y][x] === "#") {
        value += calcJunctionValue(x, y);
      }
    }
  }
  return value;
}

function buildCoords(output) {
  //console.log(sM);

  var sMyl = sM.length - 1;
  var sMxl = sM[sMyl].length;
  //console.log("x: ", sMxl, " y: ", sMyl);
  //console.log("Next output is: ", output);
  if (output === 10) {
    sM[sMyl + 1] = [];
  } else {
    sM[sMyl][sMxl] = String.fromCharCode(output);
  }
}

async function computeIt(oa, ind, rb, outarr) {
  return new Promise(async function(resolve, reject) {
    var { inst, i1, i2, i3 } = await getIndexes(oa, ind, rb);
    if (!solved) {
      switch (inst) {
        case 99:
          console.log("99 code");
          resolve({ oa: oa, ind: oa.length, rb: rb });
          paintSM();
          console.log(calcInter());
          break;
        case 1:
          oa[i3] = getValue(oa, i1) + getValue(oa, i2);
          resolve({ oa: oa, ind: ind + 4, rb: rb });
          break;
        case 2:
          oa[i3] = getValue(oa, i1) * getValue(oa, i2);
          resolve({ oa: oa, ind: ind + 4, rb: rb });
          break;
        case 3:
          await sleep(1000);
          console.log("uh oh, it wants input");
          oa[i1] = proposeMove();
          resolve({ oa: oa, ind: ind + 2, rb: rb });
          break;
        case 4:
          //paintSM();
          //await sleep(20);
          buildCoords(getValue(oa, i1));
          resolve({ oa: oa, ind: ind + 2, rb: rb });
          break;
        case 5:
          if (getValue(oa, i1) !== 0) {
            resolve({ oa: oa, ind: getValue(oa, i2), rb: rb });
          } else {
            resolve({ oa: oa, ind: ind + 3, rb: rb });
          }
          break;
        case 6:
          if (getValue(oa, i1) === 0) {
            resolve({ oa: oa, ind: getValue(oa, i2), rb: rb });
          } else {
            resolve({ oa: oa, ind: ind + 3, rb: rb });
          }
          break;
        case 7:
          if (getValue(oa, i1) < getValue(oa, i2)) {
            oa[i3] = 1;
            resolve({ oa: oa, ind: ind + 4, rb: rb });
          } else {
            oa[i3] = 0;
            resolve({ oa: oa, ind: ind + 4, rb: rb });
          }
          break;
        case 8:
          if (getValue(oa, i1) === getValue(oa, i2)) {
            oa[i3] = 1;
            resolve({ oa: oa, ind: ind + 4, rb: rb });
          } else {
            oa[i3] = 0;
            resolve({ oa: oa, ind: ind + 4, rb: rb });
          }
          break;
        case 9:
          resolve({ oa: oa, ind: ind + 2, rb: rb + getValue(oa, i1) });
          break;
        default:
          console.log(
            "Shouldn't have reached here, index is: ",
            ind,
            " and current opcode is: ",
            inst
          );
          resolve({ oa: oa, ind: ind + 4 });
          break;
      }
    } else {
      console.log("solved");
    }
  });
}

async function parseArray(oa) {
  var ind = 0;
  var rb = 0;
  while (ind != oa.length) {
    var { oa, ind, rb } = await computeIt(oa, ind, rb);
  }
}

async function main() {
  var input = fs.createReadStream("input.txt");
  var oa = await splitArray(input);
  oa = await convertToInt(oa);
  //paintMaze(robot);
  parseArray(oa);
}

main();
