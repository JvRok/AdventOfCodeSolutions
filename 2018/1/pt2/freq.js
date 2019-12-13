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

function doCalc(operator, val1, val2) {
  return new Promise(function(resolve, reject) {
    if (operator === "+") {
      return resolve(parseInt(val1) + parseInt(val2));
    } else if (operator === "-") {
      return resolve(parseInt(val2) - parseInt(val1));
    }
  });
}

function checkIfRepeat(value, map, repeat) {
  return new Promise(function(resolve, reject) {
    if (map.get(value) === true && repeat === undefined) {
      repeat = value;
      resolve(value);
    } else {
      map.set(value, true);
      resolve(repeat);
    }
  });
}

async function main() {
  var input = fs.createReadStream("testinput.txt");
  var splitNewLines = await splitNLToArray(input);
  var value = 0;
  var repeatVal;
  var map = new Map();
  while (repeatVal === undefined) {
    for (i = 0; i < splitNewLines.length; i++) {
      value = await doCalc(
        splitNewLines[i].substring(0, 1),
        splitNewLines[i].substring(1, splitNewLines[i].length),
        value
      );
      //console.log(value, map, repeatVal);
      repeatVal = await checkIfRepeat(value, map, repeatVal);
      //console.log(repeatVal);
    }
  }
  console.log(value);
  console.log("First repeat is: " + repeatVal);
}
main();
