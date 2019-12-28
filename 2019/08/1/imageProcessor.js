var fs = require("fs");

//Dont touch
function splitData(data, layerLength) {
  var layeredImage = [];
  for (var i = 0; i < data.toString().length; i += layerLength) {
    layeredImage.push(data.toString().substring(i, i + layerLength));
  }
  return layeredImage;
}

//Dont touch
function splitArray(input, layerLength) {
  return new Promise(function(resolve, reject) {
    input.on("data", function(data) {
      resolve(splitData(data, layerLength));
    });
  });
}

function countZeroes(layer) {
  return (layer.match(/0/g) || []).length;
}

function checkSum(layeredImage) {
  return new Promise(function(resolve, reject) {
    var layerRecord = { index: 0, zeroes: 9999999999 };
    for (var i = 0; i < layeredImage.length; i++) {
      var layerAttributes = {
        index: i,
        zeroes: countZeroes(layeredImage[i])
      };
      if (layerAttributes.zeroes < layerRecord.zeroes) {
        layerRecord = layerAttributes;
      }
    }
    resolve(layerRecord);
  });
}

function calcRecord(layerRecord) {
  var oneDigits = 0;
  var twoDigits = 0;
  for (var i = 0; i < layerRecord.length; i++) {
    if (layerRecord[i] === "1") {
      oneDigits += 1;
    } else if (layerRecord[i] === "2") {
      twoDigits += 1;
    }
  }
  console.log("Ones: ", oneDigits, "Twos: ", twoDigits);
  console.log("N of each times together equals... ", oneDigits * twoDigits);
}
async function main() {
  var dimensions = { w: 25, h: 6 };
  var layerLength = dimensions.w * dimensions.h;
  var image = fs.createReadStream("input.txt");
  var layeredImage = await splitArray(image, layerLength);
  var layerRecord = await checkSum(layeredImage);
  calcRecord(layeredImage[layerRecord.index]);
}

main();
