var fs = require("fs");

require('draftlog').into(console)

var gameMap = [];
var cols = 37;
var val1 = undefined, val2 = undefined, val3 = undefined;
var score = 0;
var line = "";

var update = console.draft(line);

//init the grid matrix
for ( var i = 0; i < cols; i++ ) {
  gameMap[i] = []; 
}


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

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

function draw() {
  if(val1 === -1) {
    score = val3;
  }
  else {
    if (gameMap[val1][val2] === 2) {
      blockCount--;
    }
    if(val3===2) {
      blockCount++;
    }
    gameMap[val1][val2] = val3;
  }
}

function robotVal(val) {
  if(val1 === undefined) {
    val1 = val;
  } else if(val2 === undefined) {
    val2 = val;
  } else if(val3 === undefined) {
    val3 = val;
    draw();
    val1 = undefined;
    val2 = undefined;
    val3 = undefined;
  }
}

function getInputVal() {
  var paddlex;
  var ballx;
  for(var y = 0; y < gameMap[y].length; y++){
    for(var x = 0; x < gameMap.length; x++) {
      if(gameMap[x][y] === 3) {
        paddlex = x;
      } else if(gameMap[x][y] === 4) {
        ballx = x;
      }
    }
  }
  if(paddlex < ballx) {
    return 1;
  }
  if(paddlex === ballx) {
    return 0;
  } else if(paddlex > ballx) {
    return -1
  }
}

function drawImage() {
  var newLines = "CURRENT SCORE: " + score + '\n';
  for(var y = 0; y < gameMap[y].length; y++){
    for(var x = 0; x < gameMap.length; x++) {
      if(gameMap[x][y] === undefined || gameMap[x][y] === 0) {
        newLines = newLines+' ';
      } else {
        newLines = newLines + gameMap[x][y].toString()
      }
    }
    newLines = newLines + '\n';
  }
  line = newLines;
  update(line);
}

function computeIt(oa, ind, rb, outarr) {
  return new Promise(async function(resolve, reject) {
    var {inst, i1, i2, i3} = await getIndexes(oa, ind, rb);
    switch(inst) {
      case 99:
        console.log(score);
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
        drawImage();
        await sleep(10);
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
}

async function main() {

  var input = fs.createReadStream("input.txt");

  var oa = await splitArray(input);
  oa = await convertToInt(oa);
  parseArray(oa);

}

main();
