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

function populateAsteroids(x1, y1, array) {
  var asteroids = [];
  for(var y = 0; y < array.length; y++) {
    for(var x = 0; x < array[y].length; x++) {
      if(array[y][x] === '#' && (x !== x1 ||  y !== y1)) {
        var a = Math.atan2(y - y1,x - x1) * 180 / Math.PI;
        asteroids.push({x: x, y: y, angle: a, distance: Math.abs(x-x1+y-y1)})
      }
    } 
  }
  asteroids.sort(
    function(a,b) {
      if(a.angle === b.angle) {
        return a.distance - b.distance;
      }
        return a.angle < b.angle ? -1 : 1;
    }
  )
  return asteroids;
}

function getUpwardsIndex(asteroids) {
  for(var i = 0; i < asteroids.length; i++) {
    if(asteroids[i].angle >= -90) {
      return i;
    }
  }
}

function vaporise(asteroids) {
  var count = 0;
  var index = 0;
  var angle = 1000;
  while(count <= 200) {
    if(index >= asteroids.length) {
      index = 0;
    }
    if(asteroids[index].angle !== angle) {
      angle = asteroids[index].angle;
      count++;
      if(count === 200) {
        return {x: asteroids[index].x, y: asteroids[index].y}
        break;
      }
      asteroids.splice(index,1);
    } else {
      index++;
    }
  }
}

async function main() {
  var mapStream = fs.createReadStream("map.txt");
  var splitNewLines = await splitNLToArray(mapStream);
  var asteroids = populateAsteroids(20,19,splitNewLines); //20,19 for main //11,13 for test
  var index = getUpwardsIndex(asteroids);
  asteroids = asteroids.slice(index,asteroids.length).concat(asteroids.slice(0,index));
  var {x, y} = vaporise(asteroids);
  console.log("200th asteroid's x & y: ", x, ' ', y);
  console.log(x * 100 + y);
}

main();