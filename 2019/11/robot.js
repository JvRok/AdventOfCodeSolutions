var fs = require("fs");
var coords = [];
var cols = 100;
var robot = {dir: 0, x: 0, y: 0};
var inputVal = 0;
var val1 = undefined, val2 = undefined;
var paintCount = 0;

//init the grid matrix
for ( var i = 0; i < cols; i++ ) {
    coords[i] = []; 
}
coords[robot.x][robot.y] = 1;

console.log(coords[robot.x][robot.y]);

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

function paint() {
  //console.log(robot.x, robot.y, val1, val2, coords[robot.x][robot.y]);
  if (coords[robot.x][robot.y] === undefined) {
    paintCount++;
  }
  coords[robot.x][robot.y] = val1;
  if(val2 === 0) {
    robot.dir--;
  } else {
    robot.dir++;
  }

  if(robot.dir === 4) {
    robot.dir = 0;
  } else if(robot.dir === -1) {
    robot.dir = 3;
  }

  if(robot.dir === 0) {
    robot.y--;
  } else if(robot.dir === 1) {
    robot.x++;
  } else if(robot.dir === 2) {
    robot.y++;
  } else if(robot.dir === 3) {
    robot.x--;
  }
}

function robotVal(val) {
  if(val1 === undefined) {
    val1 = val;
  } else if(val2 === undefined) {
    val2 = val;
    paint();
    val1 = undefined;
    val2 = undefined;
  }
}

function getInputVal() {
  if(coords[robot.x][robot.y] === undefined || coords[robot.x][robot.y] === 0) {
    return 0;
  } else {
    return 1;
  }
}

function drawImage() {
      for(var y = 0; y < cols; y++){
        for(var x = 0; x < cols; x++) {

      if(coords[x][y] === undefined || coords[x][y] === 0) {
        process.stdout.write(" ");
      } else {
        process.stdout.write("#");
      }
    }
    console.log("");
  }
}

//oa = opcodeArray, ind = index
function computeIt(oa, ind, rb, outarr) {
  return new Promise(async function(resolve, reject) {
    var {inst, i1, i2, i3} = await getIndexes(oa, ind, rb);
    switch(inst) {
      case 99:
        console.log("Terminating program");
        console.log("Painted ", paintCount, " unique tiles.")
        drawImage();
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
        oa[i1] = getInputVal();
        resolve({oa: oa, ind: ind+2, rb: rb});
        break;
      case 4:
        //console.log("Outputting: ", getValue(oa, i1));
        robotVal(getValue(oa, i1));
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

async function parseArray(oa) {
  var ind = 0;
  var rb = 0;
  while(ind != oa.length) {
    var {oa, ind, rb} = await computeIt(oa, ind, rb);
  }
  //console.log(oa);
}

async function main() {

  var input = fs.createReadStream("input.txt");

  var oa = await splitArray(input);
  oa = await convertToInt(oa);
  parseArray(oa);

}

main();
