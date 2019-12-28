function count(string) {
  var count = {};
  string.split("").forEach(function(s) {
    count[s] ? count[s]++ : (count[s] = 1);
  });
  return count;
}

async function checkHasDoubles(passwd) {
  return new Promise(async function(resolve, reject) {
    var str = passwd.toString();
    var exists = Object.keys(count(str)).some(function(k) {
      return count(str)[k] === 2;
    });
    resolve(exists);
  });
}

function isLeftLowerOrEqThanRight(char1, char2) {
  return new Promise(function(resolve, reject) {
    if (parseInt(char1) <= parseInt(char2)) {
      resolve(true);
    } else {
      resolve(false);
    }
  });
}

async function decreaseIsFalse(str) {
  return new Promise(async function(resolve, reject) {
    for (var i = 0; i < str.length - 1; i++) {
      var boolCheck = await isLeftLowerOrEqThanRight(str[i], str[i + 1]);
      if (!boolCheck) {
        resolve(false);
      }
    }
    resolve(true);
  });
}

async function checkHasDecrease(passwd) {
  return new Promise(async function(resolve, reject) {
    var str = passwd.toString();
    var bool = await decreaseIsFalse(str);
    resolve(!bool);
  });
}

async function assess(passwd) {
  return new Promise(async function(resolve, reject) {
    var checkDecrease = await checkHasDecrease(passwd);
    var checkHasDouble = await checkHasDoubles(passwd);
    if (passwd.toString().length != 6 || !checkHasDouble || checkDecrease) {
      resolve(false);
    } else {
      resolve(true);
    }
  });
}

async function main() {
  var counter = 0;
  for (var i = 254032; i <= 789860; i++) {
    var blah = await assess(i);
    if (blah) {
      counter = counter + 1;
    }
  }
  console.log(counter);
}

main();
