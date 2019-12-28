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
    array2[p3] = parseInt(p1) + parseInt(p2);
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
    array2[p3] = parseInt(p1) * parseInt(p2);
    resolve({ arr: array2, newIndex: newIndex });
  });
}

async function saveToAddress(array, index, opcodes, inputVal, phase) {
  var array2 = array;
  var newIndex = index + 2;
  var ret = phase;
  var a = await getOpCode(opcodes.a);
  var b = await getOpCode(opcodes.b);
  var c = await getOpCode(opcodes.c);
  var { p1 } = await getVals(array, index, 1, 1, 1);
  return new Promise(function(resolve, reject) {
    if (phase === "USED") {
      array2[p1] = inputVal;
    } else {
      array2[p1] = phase;
      ret = "USED";
    }
    resolve({ arr: array2, newIndex: newIndex, ret: ret });
  });
}

async function outputValue(array, index, opcodes) {
  var a = await getOpCode(opcodes.a);
  var b = await getOpCode(opcodes.b);
  var c = await getOpCode(opcodes.c);
  //console.log(index, a, b, c);
  var { p1, p2, p3 } = await getVals(array, index, 1, 1, 1);
  return new Promise(function(resolve, reject) {
    //console.log("p1 ", p1, " p2 ", p2, " p3 ", p3);
    //console.log(array);
    //console.log("Output Array Index: ", p1, " Output signal: ", array[p1]);
    var newIndex = index + 2;
    resolve({ arr: array, newIndex: newIndex, outputVal: array[p1] });
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

async function parseArray(array, inputVal, phase, ampIndex) {
  //console.log("asjdioasjd", array, inputVal, phase);
  return new Promise(async function(resolve, reject) {
    var theMutableArray = array;
    var i = ampIndex;
    var output = inputVal;
    var loopContinue = true;
    var nphase = phase;
    while (i < theMutableArray.length && loopContinue) {
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
        //console.log(nphase);
        var { arr, newIndex, ret } = await saveToAddress(
          theMutableArray,
          i,
          operator.modes,
          inputVal,
          nphase
        );
        nphase = ret;
        theMutableArray = arr;
        i = newIndex;
      } else if (parseInt(operator.opcode) === 4) {
        loopContinue = false;
        var { arr, newIndex, outputVal } = await outputValue(
          theMutableArray,
          i,
          operator.modes
        );
        //console.log("OV: ", outputVal);
        theMutableArray = arr;
        i = newIndex;
        output = outputVal;
        resolve({
          currentOutput: output,
          newAmpArr: {
            finsig: false,
            index: i,
            opcode: theMutableArray,
            phase: nphase
          }
        });
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
        //console.log("Test program finished");
        //console.log(theMutableArray, i);
        loopContinue = false;
        //console.log("Should not be appending" + output);
        resolve({
          currentOutput: output,
          newAmpArr: {
            finsig: true,
            index: i,
            opcode: theMutableArray,
            phase: nphase
          }
        });
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
        resolve(console.log("ERRORRRRR"));
        loopContinue = false;
      }
    }
  });
}

function permutator(inputArr) {
  var results = [];

  function permute(arr, memo) {
    var cur,
      memo = memo || [];

    for (var i = 0; i < arr.length; i++) {
      cur = arr.splice(i, 1);
      if (arr.length === 0) {
        results.push(memo.concat(cur));
      }
      permute(arr.slice(), memo.concat(cur));
      arr.splice(i, 0, cur[0]);
    }

    return results;
  }

  return permute(inputArr);
}

function doSet(set, opcodeArray) {
  ampAop = opcodeArray.slice(0);
  ampBop = opcodeArray.slice(0);
  ampCop = opcodeArray.slice(0);
  ampDop = opcodeArray.slice(0);
  ampEop = opcodeArray.slice(0);

  return new Promise(async function(resolve, reject) {
    var ampA = { finsig: false, index: 0, opcode: ampAop, phase: set[0] };
    var ampB = { finsig: false, index: 0, opcode: ampBop, phase: set[1] };
    var ampC = { finsig: false, index: 0, opcode: ampCop, phase: set[2] };
    var ampD = { finsig: false, index: 0, opcode: ampDop, phase: set[3] };
    var ampE = { finsig: false, index: 0, opcode: ampEop, phase: set[4] };
    var ampArr = [ampA, ampB, ampC, ampD, ampE];
    //console.log(ampArr);

    var ongoingOutput = 0;
    var index = 0;
    while (
      !ampArr[0].finsig ||
      !ampArr[1].finsig ||
      !ampArr[2].finsig ||
      !ampArr[3].finsig ||
      !ampArr[4].finsig

      //index < 5
    ) {
      var { currentOutput, newAmpArr } = await parseArray(
        ampArr[index].opcode,
        ongoingOutput,
        ampArr[index].phase,
        ampArr[index].index
      );
      ongoingOutput = currentOutput;
      //console.log("Curr ongoingoutput in while loop is: ", ongoingOutput);
      ampArr[index] = newAmpArr;
      index++;

      if (index === 5) {
        //console.log(ampArr);
        index = 0;
      }

      if (
        ampArr[0].finsig &&
        ampArr[1].finsig &&
        ampArr[2].finsig &&
        ampArr[3].finsig &&
        ampArr[4].finsig
      ) {
        //console.log("Resolving, value is : ", ongoingOutput);
        resolve({ outputForSet: ongoingOutput, permSet: set });
      }
    }
  });
}

async function main() {
  var phaseArray = [9, 8, 7, 6, 5];
  var permutations = permutator(phaseArray);
  var input = fs.createReadStream("input.txt");
  var highestOutput = 0;
  var highestPhase = [];
  var opcodeArray = await splitArray(input);
  opcodeArray = await convertToInt(opcodeArray);
  for (var x = 0; x < permutations.length; x++) {
    var { outputForSet, permSet } = await doSet(permutations[x], opcodeArray);
    console.log(outputForSet, permSet);
    if (outputForSet > highestOutput) {
      highestPhase = permSet;
      highestOutput = outputForSet;
    }
  }
  console.log("Highest possible output is: ", highestOutput);
  console.log("Highest Phase set is: ", highestPhase);
}

main();
