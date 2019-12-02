var fs = require("fs");

function splitArray(input) {
  return new Promise(function(resolve, reject) {
    input.on("data", function(data) {
      resolve(data.toString().split(","));
    });
  });
}

function doCalculations(array) {
  for (i = 0; i < array.length; i = i + 4) {
    var operator = array[i];
    if ((operator = 99)) {
      return;
    }
    console.log(array[i]);
  }
}

var input = fs.createReadStream("opcode2.txt");

var opcodeArray = splitArray(input);

opcodeArray.then(function(value) {
  console.log(value);
});

doCalculations(opcodeArray);
