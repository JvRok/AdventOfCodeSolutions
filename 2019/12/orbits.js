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


var totalSteps = 1000;
var input = pi;

var moons  = [];

console.log(input.length);

for(var i = 0; i < input.length; i++) {
  moons.push({x:input[i][0], y: input[i][1], z:input[i][2], vx: 0, vy: 0, vz: 0 })
}
for(var st = 0; st < totalSteps; st++) {

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

}

console.log(moons);

var energy = 0;
for(var i = 0; i < moons.length; i++) {
  var px = Math.abs(moons[i].x);
  var py = Math.abs(moons[i].y);
  var pz = Math.abs(moons[i].z)
  var kx = Math.abs(moons[i].vx);
  var ky = Math.abs( moons[i].vy);
  var kz = Math.abs(moons[i].vz);
  var pen = px + py + pz; 
  var ken = kx + ky + kz;
  energy = energy + pen*ken;
}

console.log("Total energy after ", totalSteps, " steps: ", energy);



