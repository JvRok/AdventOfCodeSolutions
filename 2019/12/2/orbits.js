var math = require("mathjs");
// First test example
var t1 = [
  [ -1,   0,   2],
  [  2, -10,  -7],
  [  4,  -8,   8],
  [  3,   5,  -1]
];
// Second test example

var t2 = [
  [ -8, -10,  0],
  [  5,   5, 10],
  [  2,  -7,  3],
  [  9,  -8, -3]
];



//Puzzle Input
var pi = [
  [   0,   4,   0],
  [ -10,  -6, -14],
  [   9, -16,  -3],
  [   6,  -1,   2]
];

var xstepscount = 0;
var ystepscount = 0;
var zstepscount = 0;
var xdupe = false;
var ydupe = false;
var zdupe = false;
var xyzarr = [];
var input = pi;

var moons  = [];

console.log(input.length);

for(var i = 0; i < input.length; i++) {
  moons.push({x:input[i][0], y: input[i][1], z:input[i][2], vx: 0, vy: 0, vz: 0 })
}

var xinitmoons = [moons[0].x, moons[0].vx, moons[1].x, moons[1].vx, moons[2].x, moons[2].vx, moons[3].x, moons[3].vx];
var yinitmoons = [moons[0].y, moons[0].vy, moons[1].y, moons[1].vy, moons[2].y, moons[2].vy, moons[3].y, moons[3].vy];
var zinitmoons = [moons[0].z, moons[0].vz, moons[1].z, moons[1].vz, moons[2].z, moons[2].vz, moons[3].z, moons[3].vz];


console.log(xinitmoons);


while(xdupe === false || ydupe === false || zdupe === false) {
  xstepscount++;
  ystepscount++;
  zstepscount++;
  for(var i = 0; i < moons.length; i++) {
    for(var n = 0; n< moons.length; n++) {
      if(i !== n) {
        if(moons[i].x > moons[n].x) {
          moons[i].vx--;
        } else if(moons[i].x < moons[n].x) {
          moons[i].vx++;
        }

        if(moons[i].y > moons[n].y) {
          moons[i].vy--;
        } else if(moons[i].y < moons[n].y) {
          moons[i].vy++;
        }

        if(moons[i].z > moons[n].z) {
          moons[i].vz--;
        } else if(moons[i].z < moons[n].z) {
          moons[i].vz++;
        }
      }
    }
  }

  for(var i =0; i < moons.length; i++) {
    moons[i].x = moons[i].x + moons[i].vx;
    moons[i].y = moons[i].y + moons[i].vy;
    moons[i].z = moons[i].z + moons[i].vz;
  }

  //console.log(JSON.stringify(moons).toString());
  if(JSON.stringify(xinitmoons) === JSON.stringify([moons[0].x, moons[0].vx, moons[1].x, moons[1].vx, moons[2].x, moons[2].vx, moons[3].x, moons[3].vx])) {
    if(xdupe !== true) {
      console.log("x Duplicate found after ", xstepscount, " steps.");
      xyzarr.push(xstepscount);
      xdupe = true
    }
  }

  if(JSON.stringify(yinitmoons) === JSON.stringify([moons[0].y, moons[0].vy, moons[1].y, moons[1].vy, moons[2].y, moons[2].vy, moons[3].y, moons[3].vy])) {
    if(ydupe !== true) {
      console.log("y Duplicate found after ", ystepscount, " steps.");
      xyzarr.push(ystepscount);
      ydupe = true
    }
  }

  if(JSON.stringify(zinitmoons) === JSON.stringify([moons[0].z, moons[0].vz, moons[1].z, moons[1].vz, moons[2].z, moons[2].vz, moons[3].z, moons[3].vz])) {
    if(zdupe !== true) {
      console.log("z Duplicate found after ", zstepscount, " steps.");
      xyzarr.push(zstepscount);
      zdupe = true
    }
  }
}

console.log("Steps taken for duplicate are: ", math.lcm(xyzarr[0], xyzarr[1], xyzarr[2]));

console.log(moons);