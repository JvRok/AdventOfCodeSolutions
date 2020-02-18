/*
iS = Input Signal, tx = test input (+ number), pI = puzzle Input
*/

String.prototype.replaceAt = function(index, replacement) {
  return (
    this.substr(0, index) +
    replacement +
    this.substr(index + replacement.length)
  );
};

var t1 = "12345678";
var t2 = "80871224585914546619083218645595";
var t3 = "19617804207202209144916044189917";
var t4 = "69317163492948606335995924319873";
var pI =
  "59796332430280528211060657577039744056609636505111313336094865900635343682296702094018432765613019371234483818415934914575717134617783515237300919201989706451524069044921384738930172026234872525254689609787752401342687098918804210494391161531008341329016626922990938854681575317559821067933058630688365067790812341475168200215494963690593873250884807840611487288560291748414160551508979374335267106414602526249401281066501677212002980616711058803845336067123298983258010079178111678678796586176705130938139337603538683803154824502761228184209473344607055926120829751532887810487164482307564712692208157118923502010028250886290873995577102178526942152";
var iS = pI;
var iS = iS.repeat(10000);
var offset = iS.slice(0, 8);
var seqLength = iS.length;
//console.log(seqLength);

var iPN = 0;
var ph = 1;
var pattern = [0, 1, 0, -1];

function iteratorPattern(n2, n1) {
  n2++;
  n1++;
  var number = Math.floor(n2 / n1) % 4;
  //console.log(n2, " ", n1, " ", number, " ", pattern[number]);
  return pattern[number];
}

function main() {
  for (var i = 1; i <= 1; i++) {
    var digits = "";
    for (var digitPos = offset; digitPos < seqLength; digitPos++) {
      //console.log("n1 iterated");
      var number = 0;
      var innerDigitPos = 0;
      while (innerDigitPos < seqLength) {
        if (digitPos < seqLength / 2) {
          //console.log(parseInt(number), iS[n2], iteratorPattern(n2, n1));

          number =
            parseInt(number) +
            iS[innerDigitPos] * iteratorPattern(innerDigitPos, digitPos);
        } else {
          //console.log(parseInt(number), parseInt(iS[n2]));
          for (var sumInt = digitPos; sumInt < seqLength; sumInt++) {
            number += parseInt(iS[sumInt]);
          }
          innerDigitPos = seqLength;
        }
        //console.log("Progressive number addition: ", number);
        innerDigitPos++;
      }
      var nL = number.toString().length;
      //console.log(number);
      digits = digits + number.toString()[nL - 1];
    }
    //console.log(".");
    iS = digits;
    //console.log(iS);
    //iS = iS.replaceAt(0, "1");
    //iS = iS.replaceAt(20, "1");
  }
  console.log(iS);
}
main();
