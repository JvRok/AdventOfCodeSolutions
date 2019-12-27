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

function calcIndexes(oa, ind, p) {
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
      }
  })
}

function getIndexes(oa, ind) {
  return new Promise(async function(resolve, reject) {
    var opcode = oa[ind].toString();
    var opl = opcode.length;
    var inst = "";
    for(var i = opl-1; i >= 0 && i >=opl-2; i--) {
      inst = opcode[i] + inst;
    }
    inst = parseInt(inst);
    console.log(opcode);
    console.log(inst);
    var p1c = opcode[opl-3];
    var p2c = opcode[opl-4];
    var p3c = opcode[opl-5];

    var i1 = await calcIndexes(oa, ind+1, p1c);
    var i2 = await calcIndexes(oa, ind+2, p2c);
    var i3 = await calcIndexes(oa, ind+3, p3c);

    resolve({inst: inst, i1: i1, i2: i2, i3:i3});
  })
}

//oa = opcodeArray, ind = index, iv = input value
function computeIt(oa, ind, iv) {
  return new Promise(async function(resolve, reject) {
    var {inst, i1, i2, i3} = await getIndexes(oa, ind);
    switch(inst) {
      case 99:
        console.log("Terminating program");
        resolve({oa: oa, ind: oa.length});
        break;
      case 1:
        oa[i3] = oa[i1] + oa[i2];
        resolve({oa: oa, ind: ind+4});
        break;
      case 2: 
        oa[i3] = oa[i1] * oa[i2];
        resolve({oa: oa, ind: ind+4});
        break; 
      case 3:
        oa[i1] = iv;
        resolve({oa: oa, ind: ind+2});
        break;
      case 4:
        console.log("Outputting: ", oa[i1]);
        resolve({oa: oa, ind: ind+2});
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
  while(ind != oa.length) {
    var {oa, ind} = await computeIt(oa, ind, iv);
  }
  console.log(oa);
}

async function main() {

  var input = fs.createReadStream("5_1_input.txt");
  var inputVal = 1;

  var oa = await splitArray(input);
  oa = await convertToInt(oa);
  parseArray(oa, inputVal);

}

main();
