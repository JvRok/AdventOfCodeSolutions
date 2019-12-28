var fs = require("fs");

var os = require("os");

const MultiKeyMap = require("multikeymap");
const maze = new MultiKeyMap();
maze.set(["x0", "y0"], "O");
var wire1index = { x: 0, y: 0 };
var wire2index = { x: 0, y: 0 };
var shortestDistance = 999999999;
var counter = 0;
var count1store = new MultiKeyMap();
var count2store = new MultiKeyMap();
var lowestSteps = 99999999999;

//Split original data to individual wire lines (2)
function splitData(data) {
  return data.toString().split(os.EOL);
}

//Split the comma separated line into an array
function splitLines(data) {
  return data.toString().split(",");
}

function splitNLToArray(array) {
  return new Promise(function(resolve, reject) {
    array.on("data", function(data) {
      resolve(splitData(data));
    });
  });
}

function splitCommaLineToArray(array) {
  return new Promise(function(resolve, reject) {
    resolve(splitLines(array));
  });
}

function setWire(maze, identifier, wireindex, countStore) {
  return new Promise(function(resolve, reject) {
    var currIdent = maze.get([
      "x" + wireindex.x.toString(),
      "y" + wireindex.y.toString()
    ]);
    if (currIdent === "O" || currIdent === identifier) {
      counter++;
      resolve();
    } else if (currIdent === "X") {
      counter++;
      var currentCount =
        countStore.get([wireindex.x.toString(), wireindex.y.toString(), "w2"]) +
        counter;
      console.log(currentCount);
      if (currentCount < lowestSteps) {
        lowestSteps = currentCount;
        resolve();
      } else {
        resolve();
      }
    } else if (currIdent !== undefined && currIdent !== identifier) {
      counter++;
      currDistance = Math.abs(wireindex.x) + Math.abs(wireindex.y);
      if (
        countStore.get([
          wireindex.x.toString(),
          wireindex.y.toString(),
          identifier
        ]) === undefined
      ) {
        countStore.set(
          [wireindex.x.toString(), wireindex.y.toString(), identifier],
          counter
        );
      }
      if (currDistance < shortestDistance) {
        shortestDistance = currDistance;
        maze.set(
          ["x" + wireindex.x.toString(), "y" + wireindex.y.toString()],
          "X"
        );
        resolve();
      } else {
        resolve();
      }
    } else {
      counter++;

      resolve(
        maze.set(
          ["x" + wireindex.x.toString(), "y" + wireindex.y.toString()],
          identifier
        )
      );
    }
  });
}

async function putDownWire1(
  operator,
  distance,
  identifier,
  existingMaze,
  wireindex,
  countStore
) {
  return new Promise(async function(resolve, reject) {
    if (operator === "R") {
      for (var i = 0; i < distance; i++) {
        wireindex.x = wireindex.x + 1;
        await setWire(existingMaze, identifier, wireindex, countStore);
      }
    } else if (operator === "L") {
      for (var i = 0; i < distance; i++) {
        wireindex.x = wireindex.x - 1;
        await setWire(existingMaze, identifier, wireindex, countStore);
      }
    } else if (operator === "U") {
      for (var i = 0; i < distance; i++) {
        wireindex.y = wireindex.y - 1;
        await setWire(existingMaze, identifier, wireindex, countStore);
      }
    } else if (operator === "D") {
      for (var i = 0; i < distance; i++) {
        wireindex.y = wireindex.y + 1;
        await setWire(existingMaze, identifier, wireindex, countStore);
      }
    }
    return resolve(existingMaze);
  });
}

function layWireLoop(wire, wireindex, identifier, countStore) {
  return new Promise(async function(resolve, reject) {
    for (var i = 0; i < wire.length; i++) {
      var operator = wire[i].substring(0, 1);
      var distance = wire[i].substring(1, wire[i].length);
      await putDownWire1(
        operator,
        distance,
        identifier,
        maze,
        wireindex,
        countStore
      );
    }

    resolve();
  });
}

async function main() {
  var input = fs.createReadStream("input.txt");
  var splitNewLines = await splitNLToArray(input);
  var wire1 = await splitCommaLineToArray(splitNewLines[0]);
  var wire2 = await splitCommaLineToArray(splitNewLines[1]);
  counter = 0;
  await layWireLoop(wire1, wire1index, "w1", count1store);
  counter = 0;
  await layWireLoop(wire2, wire2index, "w2", count2store);
  counter = 0;
  var newIndex = { x: 0, y: 0 };
  await layWireLoop(wire1, newIndex, "w1", count2store);
  console.log(
    "Shortest manhattan distance from origin is: " + shortestDistance
  );
  console.log("Total steps: " + lowestSteps);
}

main();
