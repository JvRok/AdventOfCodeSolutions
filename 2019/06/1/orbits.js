var fs = require("fs");
var os = require("os");

function splitData(data) {
  return data.toString().split(os.EOL);
}

function splitNLToArray(array) {
  return new Promise(function(resolve, reject) {
    array.on("data", function(data) {
      resolve(splitData(data));
    });
  });
}

async function main() {
  var map = new Map();
  var arr = [];
  var input = fs.createReadStream("input.txt");
  var splitNewLines = await splitNLToArray(input);
  //console.log(splitNewLines);

  for (var i = 0; i < splitNewLines.length; i++) {
    var sO = splitNewLines[i].split(")");
    map.set(sO[1], sO[0]);
    arr.push(sO[1]);
  }
  var connections = 0;
  for (var i = 0; i < arr.length; i++) {
    var currentIndex = arr[i];
    while (currentIndex !== "COM") {
      connections++;
      currentIndex = map.get(currentIndex);
    }
  }
  console.log(connections);
}

main();
