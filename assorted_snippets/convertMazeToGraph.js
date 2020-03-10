var fs = require("fs");
var os = require("os");

function splitData(data) {
  return data.toString().split(os.EOL);
}

function splitArray(input) {
  return new Promise(function(resolve, reject) {
    input.on("data", function(data) {
      resolve(splitData(data));
    });
  });
}

function getMazeVal(mazeObject, y, x) {
  if (mazeObject[0].length > x && x >= 0 && mazeObject.length > y && y >= 0) {
    if (mazeObject[y][x] === "#") {
      return 999999999;
    } else if (mazeObject[y][x] === "S") {
      return 0;
    } else {
      return Infinity;
    }
  } else {
    return -1;
  }
}

function generateLinks(mazeObject, y, x) {
  var links = {};
  links["x" + (x - 1) + "y" + y] = getMazeVal(mazeObject, y, x - 1);
  links["x" + (x + 1) + "y" + y] = getMazeVal(mazeObject, y, x + 1);
  links["x" + x + "y" + (y - 1)] = getMazeVal(mazeObject, y - 1, x);
  links["x" + x + "y" + (y + 1)] = getMazeVal(mazeObject, y + 1, x);
  for (obj in links) {
    if (links[obj] === -1) {
      delete links[obj];
    } else if (links[obj] === Infinity) {
      links[obj] = 1;
    }
  }
  return links;
}

function createObject(mazeObject, y, x) {
  var links = generateLinks(mazeObject, y, x);
  var val = getMazeVal(mazeObject, y, x);
  var coord = { x: x, y: y };
  var path = "";
  if (val === 0) {
    path = "S";
  }
  return {
    val: val,
    symbol: mazeObject[y][x],
    coord: coord,
    links: links,
    proc: false,
    path: path
  };
}

//assumes maze is rectangular - each line is a string of chars
//# = wall, . = open space, S = Start, E = End (goal)
function convertMazeObjectToGraph(mazeObject) {
  var mazeGraph = {};
  for (var x = 0; x < mazeObject[0].length; x++) {
    for (var y = 0; y < mazeObject.length; y++) {
      mazeGraph["x" + x + "y" + y] = createObject(mazeObject, y, x);
    }
  }
  return mazeGraph;
}

async function getMaze() {
  var input = fs.createReadStream("bigInput.txt");
  var mazeObject = await splitArray(input);
  return mazeObject;
}

async function getGraph() {
  var input = fs.createReadStream("bigInput.txt");
  var mazeObject = await splitArray(input);
  var mazeGraph = await convertMazeObjectToGraph(mazeObject);
  return mazeGraph;
}

exports.getGraph = getGraph();
exports.getMaze = getMaze();
