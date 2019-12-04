var fs = require("fs");

var os = require("os");

//Dont touch
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

async function addToObject(obj, char) {
  return new Promise(function(resolve, reject) {
    if (obj[char] === undefined) {
      obj[char] = 1;
    } else {
      obj[char] = obj[char] + 1;
    }
    resolve(obj);
  });
}

async function countTwosAndThrees(obj) {
  return new Promise(async function(resolve, reject) {
    const values = Object.values(obj);
    twos = values.includes(2);
    threes = values.includes(3);
    //console.log(twos, threes);
    resolve({ res1: twos, res2: threes });
  });
}

function parseLine(line) {
  return new Promise(async function(resolve, reject) {
    var obj = {};
    for (var x = 0; x < line.length; x++) {
      await addToObject(obj, line[x]);
    }
    var { res1, res2 } = await countTwosAndThrees(obj);
    resolve({ res1: res1, res2: res2 });
  });
}

async function main() {
  var input = fs.createReadStream("input.txt");
  var splitNewLines = await splitNLToArray(input);
  var threepeat = 0;
  var twopeat = 0;
  for (i = 0; i < splitNewLines.length; i++) {
    var { res1, res2 } = await parseLine(splitNewLines[i]);
    //console.log(res1, res2);
    twopeat = twopeat + res1;
    threepeat = threepeat + res2;
  }
  console.log(threepeat * twopeat);
}

main();
