var fs = require("fs");

function readLines(input, func) {
  var remaining = "";
  var sumOfTotalFuel = 0;

  input.on("data", function(data) {
    remaining += data;
    var index = remaining.indexOf("\n");
    while (index > -1) {
      var line = remaining.substring(0, index);
      remaining = remaining.substring(index + 1);
      sumOfTotalFuel = sumOfTotalFuel + calculateWeight(line);
      index = remaining.indexOf("\n");
    }
  });

  input.on("end", function() {
    if (remaining.length > 0) {
      sumOfTotalFuel = sumOfTotalFuel + calculateWeight(remaining);
      console.log(sumOfTotalFuel);
    }
  });
}

function func(data) {
  console.log("Progressive Sum of Fuel: " + data);
}

function calculateWeight(mass) {
  var requiredFuel = parseInt(mass / 3) - 2;
  return requiredFuel;
}

var input = fs.createReadStream("mass.txt");
readLines(input, func);
