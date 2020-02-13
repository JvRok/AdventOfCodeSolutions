var fs = require("fs");
require("draftlog").into(console);

var gameMap = [];
var solved = false;
var cols = 50;
var line = "";
var startPt = { x: 25, y: 25 };
var endPt;
var update = console.draft(line);
var robot = { x: startPt.x, y: startPt.y };
var proposedMove = 0;
var deadend = false;
//init the grid matrix
for (var i = 0; i < cols; i++) {
  gameMap[i] = [];
}
gameMap[startPt.x][startPt.y] = "X";

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

function getPriority(x, y) {
  var tile = gameMap[x][y];
  //console.log(tile);
  if (tile === undefined || tile === " " || tile === "O" || tile === "X") {
    return 2;
  } else if (tile === "." || tile === "o" || tile === "x") {
    return 1;
  } else {
    return 0;
  }
}

function proposeMove() {
  var dir = 0;
  var prior = 0;
  if (getPriority(robot.x + 1, robot.y) > prior) {
    dir = 4;
    prior = getPriority(robot.x + 1, robot.y);
  }
  if (getPriority(robot.x, robot.y - 1) > prior) {
    dir = 1;
    prior = getPriority(robot.x, robot.y - 1);
  }
  if (getPriority(robot.x, robot.y + 1) > prior) {
    prior = getPriority(robot.x, robot.y + 1);
    dir = 2;
  }
  if (getPriority(robot.x - 1, robot.y) > prior) {
    prior = getPriority(robot.x - 1, robot.y);
    dir = 3;
  }
  if (prior === 1) {
    deadend = true;
  }
  proposedMove = dir;
  return dir;
}

async function makeMove(status) {
  //console.log(status);
  if (status !== 0) {
    if (deadend === true) {
      if (gameMap[robot.x][robot.y] === "O") {
        endPt = { x: robot.x, y: robot.y };
        gameMap[robot.x][robot.y] = "o";
      } else if (gameMap[robot.x][robot.y] === "X") {
        gameMap[robot.x][robot.y] = "x";
      } else if (
        gameMap[robot.x][robot.y] === "o" ||
        gameMap[robot.x][robot.y] === "x"
      ) {
      } else {
        gameMap[robot.x][robot.y] = ",";
      }
      deadend = false;
    }

    if (proposedMove === 4) {
      robot.x++;
    } else if (proposedMove === 3) {
      robot.x--;
    } else if (proposedMove === 2) {
      robot.y++;
    } else if (proposedMove === 1) {
      robot.y--;
    }
    if (status === 2) {
      gameMap[robot.x][robot.y] = "O";
    } else if (
      gameMap[robot.x][robot.y] === "o" ||
      gameMap[robot.x][robot.y] === "x" ||
      gameMap[robot.x][robot.y] === "X"
    ) {
    } else {
      gameMap[robot.x][robot.y] = ".";
    }
  } else {
    if (proposedMove === 4) {
      gameMap[robot.x + 1][robot.y] = "#";
    } else if (proposedMove === 3) {
      gameMap[robot.x - 1][robot.y] = "#";
    } else if (proposedMove === 2) {
      gameMap[robot.x][robot.y + 1] = "#";
    } else if (proposedMove === 1) {
      gameMap[robot.x][robot.y - 1] = "#";
    }
  }
}

function assessMove(status) {
  makeMove(status);
}

function paintMaze(robot) {
  var newLines = "\n";
  //console.log(gameMap.length);
  for (var y = 0; y < gameMap.length; y++) {
    for (var x = 0; x < gameMap.length; x++) {
      if (robot.x === x && robot.y === y && gameMap[x][y] != "O") {
        newLines = newLines + "R";
      } else if (gameMap[x][y] === undefined || gameMap[x][y] === 0) {
        newLines = newLines + " ";
      } else {
        newLines = newLines + gameMap[x][y];
      }
    }
    newLines = newLines + "\n";
  }
  line = newLines;
  console.log(line);
}

function prepareGameMap() {
  for (var y = 0; y < gameMap.length; y++) {
    for (var x = 0; x < gameMap.length; x++) {
      if (gameMap[x][y] === "#") {
        gameMap[x][y] = 1;
      } else {
        gameMap[x][y] = 0;
      }
    }
  }
  paintMaze({ x: 25, y: 25 });
}

function findWay(position, end) {
  var queue = [];
  var validpaths = [];

  // New points, where we did not check the surroundings:
  // remember the position and how we got there
  // initially our starting point and a path containing only this point
  queue.push({ pos: position, path: [position] });

  // as long as we have unchecked points
  while (queue.length > 0) {
    // get next position to check viable directions
    var obj = queue.shift();
    var pos = obj.pos;
    var path = obj.path;

    // all points in each direction
    var direction = [
      [pos[0] + 1, pos[1]],
      [pos[0], pos[1] + 1],
      [pos[0] - 1, pos[1]],
      [pos[0], pos[1] - 1]
    ];

    for (var i = 0; i < direction.length; i++) {
      // check if out of bounds or in a "wall"
      if (direction[i][0] < 0 || direction[i][0] >= gameMap[0].length) continue;
      if (direction[i][1] < 0 || direction[i][1] >= gameMap[0].length) continue;
      if (gameMap[direction[i][0]][direction[i][1]] != 0) continue;

      // check if we were at this point with this path already:
      var visited = false;
      for (var j = 0; j < path.length; j++) {
        if (path[j][0] == direction[i][0] && path[j][1] == direction[i][1]) {
          visited = true;
          break;
        }
      }
      if (visited) continue;

      // copy path
      var newpath = path.slice(0);
      // add new point
      newpath.push(direction[i]);

      // check if we are at end
      if (direction[i][0] != end[0] || direction[i][1] != end[1]) {
        // remember position and the path to it
        queue.push({ pos: direction[i], path: newpath });
      } else {
        // remember this path from start to end
        validpaths.push(newpath);
        // break here if you want only one shortest path
      }
    }
  }
  return validpaths;
}

function getBFSPath(startPt, endPt, gameMap) {
  prepareGameMap(gameMap);

  console.log(startPt, endPt);
  var start = [startPt.x, startPt.y];
  var end = [endPt.x, endPt.y];

  var path = findWay(start, end);
  console.log(path[0].length);
}

function computeIt(oa, ind, rb, outarr) {
  return new Promise(async function(resolve, reject) {
    var { inst, i1, i2, i3 } = await getIndexes(oa, ind, rb);
    if (!solved) {
      switch (inst) {
        case 99:
          //drawImage();
          console.log("99 code");
          resolve({ oa: oa, ind: oa.length, rb: rb });
          paintMaze(robot);

          robot.x = startPt.x;
          robot.y = startPt.y;
          getBFSPath(startPt, endPt, gameMap);
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
          //await sleep(1000);
          oa[i1] = proposeMove();
          //console.log("Case 3 provided ", oa[i1], " as the proposed move");

          resolve({ oa: oa, ind: ind + 2, rb: rb });
          break;
        case 4:
          //console.log("Case 4");
          assessMove(getValue(oa, i1));
          //paintMaze(robot);
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
  parseArray(oa);
}

main();
