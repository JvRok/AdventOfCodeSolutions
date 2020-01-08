var fs = require("fs");
var os = require("os");

var fuelMap = new Map();
//Map to hold numbers of each resource
var resourcesMap = new Map();
//counts the resources
var countMap = new Map();

countMap.set("ORE", 0);

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

function splitFuel(reactionsLine) {
  var leftSideRequirements = reactionsLine[0].split(", ");
  var rightSideRequirements = reactionsLine[1].split(" ");
  var product = {
    p: rightSideRequirements[1],
    n: parseInt(rightSideRequirements[0])
  };
  var reqList = [];

  for (var i = 0; i < leftSideRequirements.length; i++) {
    var req = {
      n: parseInt(leftSideRequirements[i].split(" ")[0]),
      r: leftSideRequirements[i].split(" ")[1]
    };
    reqList.push(req);
  }
  resourcesMap.set(product.p, 0);
  countMap.set(product.p, 0);
  fuelMap.set(product.p, { fuel: reqList, product: product });
}

function requirements(resource, req) {
  if (resourcesMap.get("FUEL") === 1) {
    console.log("hihihih");
    return;
  } else if (resource === "ORE") {
    console.log("ORA ORA ORA");
    resourcesMap.set("ORE", resourcesMap.get("ORE") + req);
    countMap.set("ORE", countMap.get("ORE") + req);
    requirements(resource, req);
  } else {
    //console.log(fuelMap.get(resource).fuel);
    //console.log(resource);
    console.log(resource);
    var fuelReqList = fuelMap.get(resource).fuel;
    console.log(fuelReqList);
    for (var i = 0; i < fuelReqList.length; i++) {
      if (fuelReqList[i].n > resourcesMap.get(fuelReqList[i].r)) {
        console.log("BLAH BLAH BLAH");
        console.log(fuelReqList[i]);
        requirements(fuelReqList[i].r, fuelReqList[i].n);
      } else {
        console.log(
          fuelReqList[i].n,
          " as compared to ",
          resourcesMap.get(fuelReqList[i].r)
        );

        resourcesMap.set(
          resource,
          resourcesMap.get(resource) + fuelMap.get(resource).product.n
        );
        countMap.set(
          resource,
          countMap.get(resource) + fuelMap.get(resource).product.n
        );
      }
    }
  }
}
async function main() {
  var input = fs.createReadStream("tinput.txt");
  var splitNewLines = await splitNLToArray(input);

  //Sets up the map to lookup each ingredient
  for (var i = 0; i < splitNewLines.length; i++) {
    var reactions = splitNewLines[i].split(" => ");
    splitFuel(reactions);
  }
  //TODO
  for (var i = 0; i < 5; i++) {
    requirements("FUEL", 1);
  }
  //console.log(resourcesMap);
  //requirements("FUEL", 1);
  console.log(countMap.get("ORE"));
  console.log(resourcesMap);
}

main();
