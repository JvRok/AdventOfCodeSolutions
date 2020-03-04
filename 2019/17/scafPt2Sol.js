var fs = require("fs");
require("draftlog").into(console);

var sM = []; //sM = scaffolding map
sM[0] = [];
var entry = [
  65,
  44,
  66,
  44,
  65,
  44,
  66,
  44,
  65,
  44,
  67,
  44,
  66,
  44,
  67,
  44,
  65,
  44,
  67,
  10,
  76,
  44,
  49,
  48,
  44,
  76,
  44,
  49,
  50,
  44,
  82,
  44,
  54,
  10,
  82,
  44,
  49,
  48,
  44,
  76,
  44,
  52,
  44,
  76,
  44,
  52,
  44,
  76,
  44,
  49,
  50,
  10,
  76,
  44,
  49,
  48,
  44,
  82,
  44,
  49,
  48,
  44,
  82,
  44,
  54,
  44,
  76,
  44,
  52,
  10,
  110,
  10
];

var solved = false;
var startPt = { x: 23, y: 23 };
var robot = { x: startPt.x, y: startPt.y, dir: 1, pdir: 0, px: 0, py: 0 };
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
    //console.log(line);
  }
}

function calcJunctionValue(x, y) {
  if (
    sM[y - 1][x] === "#" &&
    sM[y + 1][x] === "#" &&
    sM[y][x - 1] === "#" &&
    sM[y][x + 1] === "#"
  ) {
    //console.log(x, y);
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
  var sMyl = sM.length - 1;
  var sMxl = sM[sMyl].length;
  if (output === 10) {
    sM[sMyl + 1] = [];
  } else {
    var c = String.fromCharCode(output);
    sM[sMyl][sMxl] = c;
    if (c !== "." && c !== "#") {
      if (c === "<") {
        robot.dir = "W";
      } else if (c === ">") {
        robot.dir = "E";
      } else if (c === "^") {
        robot.dir = "N";
      } else {
        robot.dir = "S";
      }
      robot.x = sMxl;
      robot.y = sMyl;
    }
  }
}

function turnRobot() {
  if (robot.dir === "N") {
    if (sM[robot.y][robot.x - 1] === "#") {
      robot.dir = "W";
      return "L";
    } else if (sM[robot.y][robot.x + 1] === "#") {
      robot.dir = "E";
      return "R";
    } else {
      return "D";
    }
  } else if (robot.dir === "S") {
    if (sM[robot.y][robot.x - 1] === "#") {
      robot.dir = "W";
      return "R";
    } else if (sM[robot.y][robot.x + 1] === "#") {
      robot.dir = "E";
      return "L";
    } else {
      return "D";
    }
  } else if (robot.dir === "E") {
    console.log(robot.y, robot.x, robot);
    if (robot.y !== 0 && sM[robot.y - 1][robot.x] === "#") {
      robot.dir = "N";
      return "L";
    } else if (sM[robot.y + 1][robot.x] === "#") {
      robot.dir = "S";
      return "R";
    } else {
      return "D";
    }
  } else {
    if (sM[robot.y - 1][robot.x] === "#") {
      robot.dir = "N";
      return "R";
    } else if (robot.y < sM[0].length - 2 && sM[robot.y + 1][robot.x] === "#") {
      robot.dir = "S";
      return "L";
    } else {
      return "D";
    }
  }
}

function makeUncompPath() {
  var path = turnRobot();
  var bounds = { y: sM.length - 2, x: sM[0].length };
  var deadEnd = false;
  while (!deadEnd) {
    var timeToTurn = false;
    var currentLength = 0;
    while (!timeToTurn) {
      if (robot.dir === "N") {
        if (robot.y > 0 && sM[robot.y - 1][robot.x] === "#") {
          robot.y = robot.y - 1;
          currentLength++;
        } else {
          var turnRobotRes = turnRobot();
          timeToTurn = true;
          if (turnRobotRes != "D") {
            path = path + currentLength + "," + turnRobotRes;
          } else {
            path = path + currentLength;
            deadEnd = true;
          }
        }
      } else if (robot.dir === "S") {
        if (robot.y < bounds.y && sM[robot.y + 1][robot.x] === "#") {
          robot.y = robot.y + 1;
          currentLength++;
        } else {
          var turnRobotRes = turnRobot();
          timeToTurn = true;
          if (turnRobotRes !== "D") {
            path = path + currentLength + "," + turnRobotRes;
          } else {
            path = path + currentLength;
            deadEnd = true;
          }
        }
      } else if (robot.dir === "E") {
        if (robot.x < bounds.x && sM[robot.y][robot.x + 1] === "#") {
          robot.x = robot.x + 1;
          currentLength++;
        } else {
          var turnRobotRes = turnRobot();
          timeToTurn = true;
          if (turnRobotRes !== "D") {
            path = path + currentLength + "," + turnRobotRes;
          } else {
            path = path + currentLength;
            deadEnd = true;
          }
        }
      } else if (robot.dir === "W") {
        if (robot.x > 0 && sM[robot.y][robot.x - 1] === "#") {
          robot.x = robot.x - 1;
          currentLength++;
        } else {
          var turnRobotRes = turnRobot();
          timeToTurn = true;
          if (turnRobotRes !== "D") {
            path = path + currentLength + "," + turnRobotRes;
          } else {
            path = path + currentLength;
            deadEnd = true;
          }
        }
      }
    }
  }
}

function enterLine() {
  return entry.shift();
}
var record = 0;
async function computeIt(oa, ind, rb, outarr) {
  return new Promise(async function(resolve, reject) {
    var { inst, i1, i2, i3 } = await getIndexes(oa, ind, rb);
    if (!solved) {
      switch (inst) {
        case 99:
          console.log(record);
          console.log("99 code");
          resolve({ oa: oa, ind: oa.length, rb: rb });
          //paintSM();
          //console.log(calcInter());
          //makeUncompPath();
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
          await sleep(50);
          oa[i1] = enterLine();
          resolve({ oa: oa, ind: ind + 2, rb: rb });
          break;
        case 4:
          record = getValue(oa, i1);
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
  var input = fs.createReadStream("mazeMovement.txt");
  var oa = await splitArray(input);
  oa = await convertToInt(oa);
  //paintMaze(robot);
  parseArray(oa);
}

main();
