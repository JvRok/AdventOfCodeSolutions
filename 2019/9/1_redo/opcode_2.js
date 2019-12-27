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


function computeIt(oa, ind) {
  return new Promise(function(resolve, reject) {
    switch(oa[ind]) {
      case 99:
        console.log("Terminating program");
        resolve({oa: oa, ind: oa.length});
        break;
      case 1:
        oa[oa[ind+3]] = oa[oa[ind+1]] + oa[oa[ind+2]];
        resolve({oa: oa, ind: ind+4});
        break;
      case 2: 
      console.log("hit 2");
        oa[oa[ind+3]] = oa[oa[ind+1]] * oa[oa[ind+2]];
        resolve({oa: oa, ind: ind+4});
        break; 
      default:
        console.log("Shouldn't have reached here");
        resolve({oa: oa, ind: ind+4});
        break;
    }
  })
}

async function parseArray(oa) {
  console.log(oa.length);
  var ind = 0;
  while(ind != oa.length) {
    var {oa, ind} = await computeIt(oa, ind);
  }
  console.log(oa);
}

async function main() {

  var input = fs.createReadStream("2_1_input.txt");
  //var inputVal = 1;

  var oa = await splitArray(input);
  oa = await convertToInt(oa);
  parseArray(oa);

}

main();
