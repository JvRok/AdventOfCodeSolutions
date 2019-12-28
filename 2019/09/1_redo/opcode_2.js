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

function calcIndexes(oa, ind, p, rb) {
  return new Promise(function(resolve, reject) {
    switch(p) {
      case undefined:
        resolve(oa[ind])
        break;
      case '0':
        resolve(oa[ind])
        break;
      case '1': 
        resolve(ind)
        break;
      case '2':
        resolve(rb + oa[ind])
        break;
    }
  })
}

function getIndexes(oa, ind, rb) {
  return new Promise(async function(resolve, reject) {
    var opcode = oa[ind].toString();
    var opl = opcode.length;
    var inst = "";
    for(var i = opl-1; i >= 0 && i >=opl-2; i--) {
      inst = opcode[i] + inst;
    }
    inst = parseInt(inst);
    var p1c = opcode[opl-3];
    var p2c = opcode[opl-4];
    var p3c = opcode[opl-5];

    var i1 = await calcIndexes(oa, ind+1, p1c,rb);
    var i2 = await calcIndexes(oa, ind+2, p2c,rb);
    var i3 = await calcIndexes(oa, ind+3, p3c,rb);

    resolve({inst: inst, i1: i1, i2: i2, i3:i3});
  })
}

function getValue(oa, i) {
  if(oa[i] === undefined) {
    return 0;
  } else {
    return oa[i];
  }
}

//oa = opcodeArray, ind = index, iv = input value
function computeIt(oa, ind, iv, rb) {
  return new Promise(async function(resolve, reject) {
    var {inst, i1, i2, i3} = await getIndexes(oa, ind, rb);
    switch(inst) {
      case 99:
        console.log("Terminating program");
        resolve({oa: oa, ind: oa.length, rb: rb});
        break;
      case 1:
        oa[i3] = getValue(oa, i1) + getValue(oa, i2);
        resolve({oa: oa, ind: ind+4, rb: rb});
        break;
      case 2: 
        oa[i3] = getValue(oa, i1) * getValue(oa, i2);
        resolve({oa: oa, ind: ind+4, rb: rb});
        break; 
      case 3:
        oa[i1] = iv;
        resolve({oa: oa, ind: ind+2, rb: rb});
        break;
      case 4:
        console.log("Outputting: ", getValue(oa, i1));
        resolve({oa: oa, ind: ind+2, rb: rb});
        break;
      case 5:
        if(getValue(oa, i1) !== 0) {
          resolve({oa: oa, ind: getValue(oa, i2), rb: rb})
        } else {
          resolve({oa: oa, ind: ind+3, rb: rb})
        }
        break;
      case 6:
        if(getValue(oa, i1) === 0) {
          resolve({oa: oa, ind: getValue(oa, i2), rb: rb})
        } else {
          resolve({oa: oa, ind: ind+3, rb: rb})
        }
        break;
      case 7:
        if(getValue(oa, i1) < getValue(oa, i2)) {
          oa[i3] = 1;
          resolve({oa: oa, ind: ind+4, rb: rb})
        } else {
          oa[i3] = 0;
          resolve({oa: oa, ind: ind+4, rb: rb})
        }
        break;
      case 8:
        if(getValue(oa, i1) === getValue(oa, i2)) {
          oa[i3] = 1;
          resolve({oa: oa, ind: ind+4, rb: rb})
        } else {
          oa[i3] = 0;
          resolve({oa: oa, ind: ind+4, rb: rb})
        }
        break;
      case 9: 
        resolve({oa: oa, ind: ind+2, rb: rb + getValue(oa, i1)})
        break;
      default:
        console.log("Shouldn't have reached here, index is: ", ind, " and current opcode is: ", inst);
        resolve({oa: oa, ind: ind+4});
        break;
    }
  })
}

async function parseArray(oa, iv) {
  var ind = 0;
  var rb = 0;
  while(ind != oa.length) {
    var {oa, ind, rb} = await computeIt(oa, ind, iv, rb);
  }
  console.log(oa);
}

async function main() {

  var input = fs.createReadStream("9_1_input.txt");
  var inputVal = 2;

  var oa = await splitArray(input);
  oa = await convertToInt(oa);
  parseArray(oa, inputVal);

}

main();
