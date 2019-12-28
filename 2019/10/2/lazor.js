var fs = require("fs");
var os = require("os");



function splitData(data) {
  return data.toString().split(os.EOL);
}


function splitNLToArray(array) {
  return new Promise(function(resolve, reject) {
    array.on("data", function(data) {
      resolve(splitData(data));
    });
  });
}

function countAsteroids(x1, y1, array) {
  var used = new Map();
  var count = 0;

  for(var y = 0; y < array.length; y++) {
    for(var x = 0; x < array[y].length; x++) {
      if(array[y][x] === '#' && (x !== x1 ||  y !== y1)) {
        var a = Math.atan2(y - y1, x - x1) * 180 / Math.PI;
        if(used.get(a) === undefined) {
          used.set(a, true);
            count++;
        }
      } 
    }
  }

  return count;
}

async function main() {
  var mapStream = fs.createReadStream("tmap.txt");
  var splitNewLines = await splitNLToArray(mapStream);
  var xc = 0, yc = 0, max = 0;

  for(var y = 0; y < splitNewLines.length; y++) {
    for(var x = 0; x < splitNewLines[y].length; x++) {
      if(splitNewLines[y][x] === '#') {
        var mv = countAsteroids(x, y, splitNewLines);
        if(mv > max) {
          max = mv;
          xc = x;
          yc = y;
        }
      }
    }
  }

  console.log("Coordinate of prime location for station is x: ", xc,  " y: ", yc, ".");
  console.log("Number of asteroids viewable from this location are: ", max);

}

main();