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

function getOpCode(opcode) {
  return new Promise(function(resolve, reject) {
    if (opcode === undefined) {
      resolve(0);
    } else {
      resolve(opcode);
    }
  });
}

function getVals(array, index, a, b, c) {
  return new Promise(function(resolve, reject) {
    if (parseInt(a) === 1) {
      var p3 = array[index + 3];
    } else {
      var p3 = array[index + 3];
    }
    if (parseInt(b) === 1) {
      var p2 = array[index + 2];
    } else {
      var p2 = array[array[index + 2]];
    }

    if (parseInt(c) === 1) {
      var p1 = array[index + 1];
    } else {
      var p1 = array[array[index + 1]];
    }
    resolve({ p1: p1, p2: p2, p3: p3 });
  });
}
async function doAddition(array, index, opcodes) {
  var array2 = array;
  var newIndex = index + 4;
  var a = await getOpCode(opcodes.a);
  var b = await getOpCode(opcodes.b);
  var c = await getOpCode(opcodes.c);
  var { p1, p2, p3 } = await getVals(array, index, a, b, c);
  return new Promise(function(resolve, reject) {
    array2[p3] = p1 + p2;
    resolve({ arr: array2, newIndex: newIndex });
  });
}

async function doMultiplication(array, index, opcodes) {
  var array2 = array;
  var newIndex = index + 4;
  var a = await getOpCode(opcodes.a);
  var b = await getOpCode(opcodes.b);
  var c = await getOpCode(opcodes.c);
  var { p1, p2, p3 } = await getVals(array, index, a, b, c);
  return new Promise(function(resolve, reject) {
    array2[p3] = p1 * p2;
    resolve({ arr: array2, newIndex: newIndex });
  });
}

async function saveToAddress(array, index, opcodes, inputVal) {
  var array2 = array;
  var newIndex = index + 2;

  var a = await getOpCode(opcodes.a);
  var b = await getOpCode(opcodes.b);
  var c = await getOpCode(opcodes.c);
  var { p1 } = await getVals(array, index, 1, 1, 1);
  return new Promise(function(resolve, reject) {
    array2[p1] = inputVal;
    resolve({ arr: array2, newIndex: newIndex });
  });
}

async function outputVal(array, index, opcodes) {
  var c = await getOpCode(opcodes.c);
  var { p1, p2, p3 } = await getVals(array, index, c, c, c);
  return new Promise(function(resolve, reject) {
    var newIndex = index + 2;
    resolve({ arr: array, newIndex: newIndex });
  });
}

async function jumpIfEq(array, index, opcodes, eq) {
  var a = await getOpCode(opcodes.a);
  var b = await getOpCode(opcodes.b);
  var c = await getOpCode(opcodes.c);

  var { p1, p2 } = await getVals(array, index, a, b, c);
  return new Promise(function(resolve, reject) {
    if ((p1 !== 0) === eq) {
      var newIndex = p2;
    } else {
      var newIndex = index + 3;
    }
    resolve({ arr: array, newIndex: newIndex });
  });
}

async function storeIfLessThan(array, index, opcodes) {
  var array2 = array;
  var newIndex = index + 4;
  var a = await getOpCode(opcodes.a);
  var b = await getOpCode(opcodes.b);
  var c = await getOpCode(opcodes.c);
  var { p1, p2, p3 } = await getVals(array, index, a, b, c);
  return new Promise(function(resolve, reject) {
    if (p1 < p2) {
      array2[p3] = 1;
    } else {
      array2[p3] = 0;
    }
    resolve({ arr: array2, newIndex: newIndex });
  });
}

async function storeIfEquals(array, index, opcodes) {
  var array2 = array;
  var newIndex = index + 4;

  var a = await getOpCode(opcodes.a);
  var b = await getOpCode(opcodes.b);
  var c = await getOpCode(opcodes.c);
  var { p1, p2, p3 } = await getVals(array, index, a, b, c);
  return new Promise(function(resolve, reject) {
    if (p1 === p2) {
      array2[p3] = 1;
    } else {
      array2[p3] = 0;
    }
    resolve({ arr: array2, newIndex: newIndex });
  });
}

function returnModesAndOpcode(mutableArray) {
  return new Promise(function(resolve, reject) {
    var string = mutableArray.toString();
    var i = string.length - 1;
    let arr = [];
    while (i >= 0) {
      if (i === string.length - 1 && string[i - 1] === undefined) {
        arr.push("0" + string[i]);
        i = i - 2;
      } else if (i === string.length - 1) {
        arr.push(string[i - 1] + string[i]);
        i = i - 2;
      } else {
        arr.push(string[i]);
        i = i - 1;
      }
      if (i < 0) {
        resolve({
          opcode: arr[0],
          modes: { c: arr[1], b: arr[2], a: arr[3] }
        });
        return;
      }
    }
  });
}

async function parseArray(array, inputVal) {
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
        operator.modes
      );
      theMutableArray = arr;
      i = newIndex;
    } else if (parseInt(operator.opcode) === 3) {
      var { arr, newIndex } = await saveToAddress(
        theMutableArray,
        i,
        operator.modes,
        inputVal
      );
      theMutableArray = arr;
      i = newIndex;
    } else if (parseInt(operator.opcode) === 4) {
      var { arr, newIndex } = await outputVal(
        theMutableArray,
        i,
        operator.modes
      );
      theMutableArray = arr;
      i = newIndex;
    } else if (parseInt(operator.opcode) === 5) {
      var { arr, newIndex } = await jumpIfEq(
        theMutableArray,
        i,
        operator.modes,
        true
      );
      theMutableArray = arr;
      i = newIndex;
    } else if (parseInt(operator.opcode) === 6) {
      var { arr, newIndex } = await jumpIfEq(
        theMutableArray,
        i,
        operator.modes,
        false
      );
      theMutableArray = arr;
      i = newIndex;
    } else if (parseInt(operator.opcode) === 7) {
      var { arr, newIndex } = await storeIfLessThan(
        theMutableArray,
        i,
        operator.modes
      );
      theMutableArray = arr;
      i = newIndex;
    } else if (parseInt(operator.opcode) === 8) {
      var { arr, newIndex } = await storeIfEquals(
        theMutableArray,
        i,
        operator.modes
      );
      theMutableArray = arr;
      i = newIndex;
    } else if (parseInt(operator.opcode) === 99) {
      console.log("Test program finished");
      return;
    } else {
      console.log(
        "We should not be here, opcode is: " + parseInt(operator.opcode),
        "index is ",
        i,
        "Current stuff ",
        theMutableArray[i],
        " ",
        theMutableArray[i + 1],
        " ",
        theMutableArray[i + 2],
        " ",
        theMutableArray[i + 3],
        theMutableArray
      );
      return;
    }
  }
}

async function main() {
  var input = fs.createReadStream("input22.txt");
  var inputVal = 5;
  var opcodeArray = await splitArray(input);
  opcodeArray = await convertToInt(opcodeArray);
  //Works up to here
  var blah = parseArray(opcodeArray, inputVal);
}

main();
