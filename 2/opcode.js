var fs = require("fs");

//Dont touch
function splitData(data) {
  return data.toString().split(",");
}

//Convert to int as promise
function convertToInt(array) {
  return new Promise(function(resolve, reject) {
    for (i in array) {
      array[i] = parseInt(array[i], 10);
    }
    resolve(array);
  });
}

//Dont touch
function splitArray(input) {
  return new Promise(function(resolve, reject) {
    input.on("data", function(data) {
      resolve(splitData(data));
    });
  });
}
function doAddition(array, index) {
  var array2 = array;
  return new Promise(function(resolve, reject) {
    array2[array[index + 3]] =
      array[array[index + 1]] + array[array[index + 2]];
    resolve(array2);
  });
}

function doMultiplication(array, index) {
  var array2 = array;
  return new Promise(function(resolve, reject) {
    array2[array[index + 3]] =
      array[array[index + 1]] * array[array[index + 2]];
    resolve(array2);
  });
}

async function parseArray(array) {
  var theMutableArray = array;
  for (i = 0; i < theMutableArray.length - 3; i = i + 4) {
    var operator = theMutableArray[i];
    //console.log(operator);
    if (parseInt(operator) === 1) {
      theMutableArray = await doAddition(theMutableArray, i);
    } else if (parseInt(operator) === 2) {
      theMutableArray = await doMultiplication(theMutableArray, i);
    }
  }
  console.log(JSON.stringify(theMutableArray));
}

async function main() {
  var input = fs.createReadStream("opcode.txt");
  var opcodeArray = await splitArray(input);
  console.log(JSON.stringify(opcodeArray));
  opcodeArray = await convertToInt(opcodeArray);
  console.log(JSON.stringify(opcodeArray));
  //Works up to here
  var blah = parseArray(opcodeArray);
}

main();
