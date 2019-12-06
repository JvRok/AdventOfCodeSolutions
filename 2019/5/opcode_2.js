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
    var newIndex = index + 4;
    resolve({ arr: array2, newIndex: newIndex });
  });
}

function doMultiplication(array, index) {
  var array2 = array;
  return new Promise(function(resolve, reject) {
    array2[array[index + 3]] =
      array[array[index + 1]] * array[array[index + 2]];
    var newIndex = index + 4;
    resolve({ arr: array2, newIndex: newIndex });
  });
}

function saveToAddress(array, index) {
  var array2 = array;

  return new Promise(function(resolve, reject) {
    array2[array[index + 1]] = array2[array[index]];
    var newIndex = index + 4;
    resolve({ arr: array2, newIndex: newIndex });
  });
}

function returnModesAndOpcode(mutableArray) {
  return new Promise(function(resolve, reject) {
    var string = mutableArray.toString();
    var i = string.length;
    if (string[i - 2] === undefined) {
      opcode = "0" + string[i - 1];
    } else {
      opcode = string[i - 2] + string[i - 1];
    }
    i = i - 2;
    var modea = string[i - 3];
    i--;
    var modeb = string[i - 4];
    i--;
    var modec = string[i - 5];
    i--;
    resolve({ opcode: opcode, modes: { a: modea, b: modeb, c: modec } });
  });
}

async function parseArray(array) {
  var theMutableArray = array;
  var i = 0;
  while (i < theMutableArray.length) {
    var operator = await returnModesAndOpcode(theMutableArray[i]);
    if (parseInt(operator.opcode) === 1) {
      var { arr, newIndex } = await doAddition(
        theMutableArray,
        i,
        operator.modes
      );
      theMutableArray = arr;
      i = newIndex;
    } else if (parseInt(operator.opcode) === 2) {
      var { arr, newIndex } = await doMultiplication(
        theMutableArray,
        i,
        operator.mode
      );
      theMutableArray = arr;
      i = newIndex;
    } else if (parseInt(operator.opcode) === 3) {
      var { arr, newIndex } = await saveToAddress(
        theMutableArray,
        i,
        operator.mode
      );
      theMutableArray = arr;
      i = newIndex;
    } else if (parseInt(operator.opcode) === 99) {
      console.log(theMutableArray);
      return;
    }
  }
}

async function main() {
  var input = fs.createReadStream("input.txt");
  var opcodeArray = await splitArray(input);
  opcodeArray = await convertToInt(opcodeArray);
  //Works up to here
  var blah = parseArray(opcodeArray);
}

main();
