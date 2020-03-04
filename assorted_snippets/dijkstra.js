var graph = {
  A: { B: 2, C: 4, K: 5, val: 0, proc: false, path: "A" },
  B: { C: 1, D: 7, J: 4, G: 1, val: Infinity, proc: false, path: "" },
  C: { B: 1, E: 3, J: 3, val: Infinity, proc: false, path: "" },
  D: { E: 2, F: 4, val: Infinity, proc: false, path: "" },
  E: { D: 2, F: 7, val: Infinity, proc: false, path: "" },
  F: { val: Infinity, proc: false, path: "" },
  G: { D: 6, I: 7, H: 1, val: Infinity, proc: false, path: "" },
  H: { D: 7, val: Infinity, proc: false, path: "" },
  I: { H: 2, F: 4, val: Infinity, proc: false, path: "" },
  J: { D: 7, E: 2, val: Infinity, proc: false, path: "" },
  K: { F: 10, E: 3, val: Infinity, proc: false, path: "" }
};

function getLowestAvailVal() {
  var la = { n: "", val: Infinity };
  for (const obj in graph) {
    if (graph[obj].proc === false && graph[obj].val < la.val) {
      la.n = obj;
      la.val = graph[obj].val;
    }
  }
  return la;
}

function updateNeighbours(la) {
  for (obj in graph[la.n]) {
    if (obj !== "val" && obj !== "proc" && obj !== "path") {
      //console.log(obj, ": ", graph[obj].val);
      //console.log(la.n, ": ", graph[la.n].val + graph[la.n][obj]);

      if (graph[obj].val > graph[la.n][obj] + graph[la.n].val) {
        graph[obj].val = graph[la.n][obj] + graph[la.n].val;
        graph[obj].path = graph[la.n].path + obj;
      }
    }
  }
  graph[la.n].proc = true;
}

var la = getLowestAvailVal();
while (la.val !== Infinity) {
  updateNeighbours(la);
  la = getLowestAvailVal();
}

console.log(graph);
