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
      resolve(parseInt(val1) + parseInt(val2));
    } else if (operator === "-") {
      resolve(parseInt(val2) - parseInt(val1));
    }
  });
}

async function main() {
  var input = fs.createReadStream("input.txt");
  var splitNewLines = await splitNLToArray(input);
  var value = 0;
  for (i = 0; i < splitNewLines.length; i++) {
    value = await doCalc(
      splitNewLines[i].substring(0, 1),
      splitNewLines[i].substring(1, splitNewLines[i].length),
      value
    );
  }
  console.log(value);
}
main();
