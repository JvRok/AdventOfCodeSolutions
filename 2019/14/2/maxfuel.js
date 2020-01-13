var fs = require("fs");
var os = require("os");
var splitNewLines = "";

var fuelMap = new Map();
//Map to hold numbers of each resource
var resourcesMap = new Map();
//counts the resources
var countMap = new Map();

//Variable used for 2nd Part
var oreforged = false;
const TRILLION = 1000000000000;
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
    if (req > 0) {
      oreforged = true;
    }
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

const binarySearch = (array, target) => {
  // Define Start and End Index
  let startIndex = 0;
  let endIndex = array.length - 1;
  // While Start Index is less than or equal to End Index
  while (startIndex <= endIndex) {
    // Define Middle Index (This will change when comparing )
    let middleIndex = Math.floor((startIndex + endIndex) / 2);
    // Compare Middle Index with Target for match
    if (target === array[middleIndex]) {
      return console.log("Target was found at index " + middleIndex);
    }
    // Search Right Side Of Array
    if (target > array[middleIndex]) {
      console.log("Searching the right side of Array");
      // Assign Start Index and increase the Index by 1 to narrow search
      startIndex = middleIndex + 1;
    }
    // Search Left Side Of Array
    if (target < array[middleIndex]) {
      // Assign End Index and increase the Index by 1 to narrow search
      console.log("Searching the left side of array");
      endIndex = middleIndex - 1;
    }
    // Not found in this iteration of the loop. Looping again.
    else {
      console.log("Not Found this loop iteration. Looping another iteration.");
    }
  }
  // If Target Is Not Found
  console.log("Target value not found in array");
};

function doLoopUntilReturn(middleIndex) {
  //Reset all maps
  fuelMap = new Map();
  //Map to hold numbers of each resource
  resourcesMap = new Map();
  resourcesMap.set("ORE", TRILLION);
  oreforged = false;

  for (var i = 0; i < splitNewLines.length; i++) {
    var reactions = splitNewLines[i].split(" => ");
    splitFuel(reactions);
  }

  while (resourcesMap.get("FUEL") < middleIndex) {
    //await sleep(500);
    requirements("FUEL", middleIndex);
    if (oreforged) {
      //console.log("FAILURE");
      return { test: false, fuelNum: 0 };
    }
  }
  //console.log(resourcesMap);
  return { test: true, fuelNum: resourcesMap.get("FUEL") };
}

async function main() {
  var input = fs.createReadStream("tinput.txt");
  splitNewLines = await splitNLToArray(input);
  //Sets up the map to lookup each ingredient
  for (var i = 0; i < splitNewLines.length; i++) {
    var reactions = splitNewLines[i].split(" => ");
    splitFuel(reactions);
  }
  var orePerFuel = 0;
  //Estimate Total Fuel
  while (resourcesMap.get("FUEL") < 1) {
    requirements("FUEL", 1);
  }
  orePerFuel = countMap.get("ORE");
  var estFuel = parseInt(TRILLION / orePerFuel);
  console.log(estFuel);

  var maxFuel = 0;

  // Define Start and End Index
  let startIndex = 0;
  let endIndex = estFuel * 2;
  console.log(endIndex);

  while (startIndex <= endIndex) {
    let middleIndex = Math.floor((startIndex + endIndex) / 2);
    var { test, fuelNum } = doLoopUntilReturn(middleIndex);
    if (test) {
      startIndex = middleIndex + 1;
      maxFuel = fuelNum;
    }
    if (!test) {
      endIndex = middleIndex - 1;
    } else {
      console.log(
        "Not yet found, Starting again with SI: ",
        startIndex,
        " MI: ",
        middleIndex,
        " EI: ",
        endIndex
      );
    }
  }
  console.log("Maximum Fuel is:", maxFuel);
}

main();
