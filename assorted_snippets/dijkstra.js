var mc = require("./convertMazeToGraph");

//Empty object to load graph into
var graph = {};

//Example Graph
var exgraph = {
  A: { links: { B: 2, C: 4, K: 5 }, val: 0, proc: false, path: "A" },
  B: {
    links: { C: 1, D: 7, J: 4, G: 1 },
    val: Infinity,
    proc: false,
    path: ""
  },
  C: { links: { B: 1, E: 3, J: 3 }, val: Infinity, proc: false, path: "" },
  D: { links: { E: 2, F: 4 }, val: Infinity, proc: false, path: "" },
  E: { links: { D: 2, F: 7 }, val: Infinity, proc: false, path: "" },
  F: { links: {}, val: Infinity, proc: false, path: "" },
  G: { links: { D: 6, I: 7, H: 1 }, val: Infinity, proc: false, path: "" },
  H: { links: { D: 7 }, val: Infinity, proc: false, path: "" },
  I: { links: { H: 2, F: 4 }, val: Infinity, proc: false, path: "" },
  J: { links: { D: 7, E: 2 }, val: Infinity, proc: false, path: "" },
  K: { links: { F: 10, E: 3 }, val: Infinity, proc: false, path: "" }
};

function getLowestAvailVal() {
  var la = { n: "", val: Infinity };
  for (const obj in graph) {
    if (graph[obj].proc === false && graph[obj].val < la.val) {
      la.n = obj;
      la.val = graph[obj].val;
    }
  }
  //console.log(la);
  return la;
}

function updateNeighbours(la) {
  for (obj in graph[la.n].links) {
    //console.log(graph[obj].val, ">", graph[la.n].links[obj] + graph[la.n].val);
    if (graph[obj].val > graph[la.n].links[obj] + graph[la.n].val) {
      graph[obj].val = graph[la.n].links[obj] + graph[la.n].val;
      graph[obj].path = graph[la.n].path + " -> " + obj;
    }
  }
  graph[la.n].proc = true;
}

function getFinishCoord() {
  for (const obj in graph) {
    if (graph[obj].symbol === "E") {
      return obj;
    }
  }
}

function parsePathToCoordinateArray(path) {
  var path = path.trim();
  var pathCoords = path.split("->");
  pathCoords.shift();
  for (var i = 0; i < pathCoords.length; i++) {
    pathCoords[i] = pathCoords[i].trim();
    pathCoords[i] = pathCoords[i].slice(1);
    pathCoords[i] = pathCoords[i].split("y");
    pathCoords[i] = {
      y: parseInt(pathCoords[i][1]),
      x: parseInt(pathCoords[i][0])
    };
  }
  console.log(pathCoords);
  return pathCoords;
}

function drawMaze(maze, path) {
  var coordArray = parsePathToCoordinateArray(path);
  var mazeArray = maze;
  for (var i = 0; i < coordArray.length - 1; i++) {
    var x = coordArray[i].x;
    var y = coordArray[i].y;

    mazeArray[y] = mazeArray[y].slice(0, x) + "*" + mazeArray[y].slice(x + 1);
    console.log(mazeArray[y][x]);
  }
  console.log(mazeArray);
}

async function main() {
  graph = await mc.getGraph;
  maze = await mc.getMaze;
  var finishCoord = getFinishCoord();
  console.log(finishCoord);
  //console.log(graph);

  var la = getLowestAvailVal();
  while (la.val !== Infinity) {
    updateNeighbours(la);
    la = getLowestAvailVal();
  }
  //console.log(graph);
  drawMaze(maze, graph[finishCoord].path);
  console.log(
    "Optimal Path is: ",
    graph[finishCoord].path,
    " which has a total path weight of: ",
    graph[finishCoord].val
  );
}

main();
