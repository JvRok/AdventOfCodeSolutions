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
  //await sleep(1000);
  //console.log(resourcesMap);
  //console.log("#############################");
  var reactionMap = fuelMap.get(resource);
  if (resource !== "ORE") {
    var num_of_reactions = Math.ceil(req / reactionMap.product.n);
  }
  var breakGate = true;
  //console.log(resource, reactionMap);
  if (resourcesMap.get("FUEL") === req) {
    return;
  } else if (resource === "ORE") {
    //console.log("In with the ore loop");
    //Work out how much ore you need
    var requiredOre = req;
    //console.log("requiredOre", requiredOre);
    resourcesMap.set(resource, resourcesMap.get(resource) + requiredOre);
    countMap.set(resource, countMap.get(resource) + requiredOre);
  } else {
    for (var i = 0; i < reactionMap.fuel.length; i++) {
      //console.log("num_of_reactions: ", num_of_reactions);
      var roundUpRequired = num_of_reactions * reactionMap.fuel[i].n;
      //console.log("Reaction Map: ", reactionMap.fuel[i]);
      /*console.log(
        "reaction map fuel for ",
        reactionMap.fuel[i].r,
        " needed for reaction = ",
        reactionMap.fuel[i].n,
        " required amount of product ",
        reactionMap.product.p,
        " needed = ",
        req,
        " which means requird amount of input equals: ",
        roundUpRequired
      );*/
      if (
        reactionMap.fuel[i].n * num_of_reactions <=
        resourcesMap.get(reactionMap.fuel[i].r)
      ) {
      } else {
        /*console.log(
          "We didnt have enough resources for the reaction, lets recurse"
        );*/
        breakGate = false;
        requirements(
          reactionMap.fuel[i].r,
          roundUpRequired - resourcesMap.get(reactionMap.fuel[i].r)
        );
      }
    }
    if (breakGate) {
      //console.log(reactionMap.product.n);
      resourcesMap.set(
        resource,
        resourcesMap.get(resource) + reactionMap.product.n * num_of_reactions
      );
      for (var i = 0; i < reactionMap.fuel.length; i++) {
        //console.log("num_of_reactions: ", num_of_reactions);
        var roundUpRequired = num_of_reactions * reactionMap.fuel[i].n;
        resourcesMap.set(
          reactionMap.fuel[i].r,
          resourcesMap.get(reactionMap.fuel[i].r) - roundUpRequired
        );
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
  while (resourcesMap.get("FUEL") < 1) {
    //await sleep(500);
    requirements("FUEL", 1);
  }
  console.log(resourcesMap);
  //requirements("FUEL", 1);
  console.log(countMap.get("ORE"));
}

main();
