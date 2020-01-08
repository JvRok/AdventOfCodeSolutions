var fs = require("fs");
var os = require("os");

var fuelMap = new Map();
//Map to hold numbers of each resource
var resourcesMap = new Map();
//counts the resources
var countMap = new Map();

countMap.set("ORE", 0);
resourcesMap.set("ORE", 0);

function splitData(data) {
  return data.toString().split(os.EOL);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
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

  //This variable is the map 
  var reactionMap = fuelMap.get(resource);
  var breakGate = true;
  //console.log(resource, reactionMap);
  if(resourcesMap.get("FUEL") === 1) {
    return;
  } else if (resource === "ORE" ) {
    //console.log("In with the ore loop");
    //Work out how much ore you need
    var requiredOre = req - resourcesMap.get("ORE")
    //console.log("requiredOre", requiredOre);
    resourcesMap.set(resource, resourcesMap.get(resource) + requiredOre); 
    countMap.set(resource, countMap.get(resource) + requiredOre);
  } else {
    for(var i = 0; i < reactionMap.fuel.length; i++) {
      if(reactionMap.fuel[i].n <= resourcesMap.get(reactionMap.fuel[i].r)) {
      } else {
        //console.log("We didnt have enough resources for the reaction, lets recurse");
        breakGate = false;
        requirements(reactionMap.fuel[i].r,reactionMap.fuel[i].n);
      }
    }
    if(breakGate) {
      resourcesMap.set(resource, resourcesMap.get(resource) + reactionMap.product.n);
      for(var i = 0; i < reactionMap.fuel.length; i++) {
        resourcesMap.set(reactionMap.fuel[i].r, resourcesMap.get(reactionMap.fuel[i].r) - reactionMap.fuel[i].n) 
      }
    }
  }




}
async function main() {
  var input = fs.createReadStream("input.txt");
  var splitNewLines = await splitNLToArray(input);

  //Sets up the map to lookup each ingredient
  for (var i = 0; i < splitNewLines.length; i++) {
    var reactions = splitNewLines[i].split(" => ");
    splitFuel(reactions);
  }
  //TODO
  while(resourcesMap.get("FUEL") < 1) {
    //console.log(resourcesMap);
    //console.log("#############################");
    //await sleep(2000);
    requirements("FUEL", 1);
  }
  console.log(resourcesMap);
  //requirements("FUEL", 1);
  console.log(countMap.get("ORE"));
}

main();
