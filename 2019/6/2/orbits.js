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

function removeDuplicates(arr) {
  var counts = {};
  for (var i = 0; i < arr.length; i++) {
    var item = arr[i];
    counts[item] = (counts[item] || 0) + 1;
  }
  var arr = [];
  for (item in counts) {
    if (counts[item] === 1) {
      arr.push(item);
    }
  }
  return arr;
}

async function main() {
  var map = new Map();
  var arr = [];
  var input = fs.createReadStream("input.txt");
  var splitNewLines = await splitNLToArray(input);

  for (var i = 0; i < splitNewLines.length; i++) {
    var sO = splitNewLines[i].split(")");
    map.set(sO[1], sO[0]);
    arr.push(sO[1]);
  }
  var connections = 0;
  var santasPath = [];
  var yourPath = [];

  for (var i = 0; i < arr.length; i++) {
    var currentIndex = arr[i];
    while (currentIndex !== "COM") {
      connections++;
      currentIndex = map.get(currentIndex);
    }
  }
  console.log(
    "Total existing connections (indirect and direct) in map (including SAN and YOU): ",
    connections
  );
  var sanIndex = "SAN";
  var youIndex = "YOU";
  while (sanIndex !== "COM") {
    santasPath.push(sanIndex);
    sanIndex = map.get(sanIndex);
  }

  while (youIndex !== "COM") {
    yourPath.push(youIndex);
    youIndex = map.get(youIndex);
  }

  var combyArray = santasPath.concat(yourPath);

  var combyArray = removeDuplicates(combyArray);
  console.log(
    "Minimum transfers between the objects SAN and YOU: ",
    combyArray.length
  );

  console.log(
    "Minimum transfers between the objects SAN and YOU are orbiting: ",
    combyArray.length - 2
  );
}

main();
