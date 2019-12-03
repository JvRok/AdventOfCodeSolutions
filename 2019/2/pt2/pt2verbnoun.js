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
  if (theMutableArray[0] === 19690720) {
    console.log(
      "The verb is: " +
        theMutableArray[1] +
        ". The noun is: " +
        theMutableArray[2] +
        "."
    );
    var answer = 100 * theMutableArray[1] + theMutableArray[2];

    console.log("The answer to the question 100*noun+verb = " + answer);
  }
}

async function replaceVerbNoun(i, x, opcodeArray) {
  var newArray = [...opcodeArray];
  return new Promise(function(resolve, reject) {
    newArray[1] = i;
    newArray[2] = x;
    resolve(newArray);
  });
}

async function main() {
  var input = fs.createReadStream("opcode.txt");
  var opcodeArray = await splitArray(input);
  //console.log(JSON.stringify(opcodeArray));
  opcodeArray = await convertToInt(opcodeArray);
  //console.log(JSON.stringify(opcodeArray));

  for (var i = 0; i < 100; i++) {
    for (var x = 0; x < 100; x++) {
      var array = await replaceVerbNoun(i, x, opcodeArray);
      //console.log(JSON.stringify(array));
      await parseArray(array);
    }
  }

  //Works up to here
}

main();
