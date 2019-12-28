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

function paint(picture, layeredImage, dimensions) {
  var i = 0;
  var iteration = dimensions.h * dimensions.w;
  console.log(iteration);
  console.log(layeredImage.length);
  while (i < layeredImage.length) {
    for (var x = 0; x < picture.length; x++) {
      if (picture[x] === "2") {
        picture[x] = layeredImage[i][x];
      } else {
      }
    }
    i++;
  }
  return picture;
}

function drawImage(picture, dimensions) {
  for (var h = 0; h < dimensions.h; h++) {
    for (var w = 0; w < dimensions.w; w++) {
      if (picture[h * dimensions.w + w] === "0") {
        process.stdout.write(" ");
      } else {
        process.stdout.write("#");
      }
      if (w === dimensions.w - 1) {
        console.log("");
      }
    }
  }
}

async function main() {
  var dimensions = { w: 25, h: 6 };
  var layerLength = dimensions.w * dimensions.h;
  var imageReadStream = fs.createReadStream("input.txt");
  var layeredImage = await splitArray(imageReadStream, layerLength);
  var picture = Array(dimensions.w * dimensions.h).fill("2");
  var picture = paint(picture, layeredImage, dimensions);
  //console.log(picture);
  drawImage(picture, dimensions);
  //process.stdout.write("Blah");
  //process.stdout.write("Downloading bytes");
}

main();
