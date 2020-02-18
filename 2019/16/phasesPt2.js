/*
iS = Input Signal, tx = test input (+ number), pI = puzzle Input
*/

//The correct answer was to not bother calculating below the offset (cos the sequence does not care about numbers that occur before it)
//The formula for numbers over the halfway mark (which offset always appears to be greater than) is for index i (where I starts at back and iterates backwards)
// first index [i] % 10
//2nd index [i-1 + i] % 10
//3rd index [i-2 + i-1 + i] % 10
//etc
var t1 = "12345678";
var t2 = "80871224585914546619083218645595";
var t3 = "19617804207202209144916044189917";
var t4 = "69317163492948606335995924319873";
var t21 = "03036732577212944063491565474664".repeat(10000);
var m1 = "00000000";
var m2 = "91849201";
var pI =
  "59796332430280528211060657577039744056609636505111313336094865900635343682296702094018432765613019371234483818415934914575717134617783515237300919201989706451524069044921384738930172026234872525254689609787752401342687098918804210494391161531008341329016626922990938854681575317559821067933058630688365067790812341475168200215494963690593873250884807840611487288560291748414160551508979374335267106414602526249401281066501677212002980616711058803845336067123298983258010079178111678678796586176705130938139337603538683803154824502761228184209473344607055926120829751532887810487164482307564712692208157118923502010028250886290873995577102178526942152";
var iS = pI.repeat(10000);
var seqLength = iS.length;
var offset = parseInt(iS.slice(0, 7));
//console.log("sequence length is: ", seqLength);
//console.log("offset is: ", offset);

function main() { 
  for(var phase = 1; phase <= 100; phase++) {
    var progNumber = 0;
    var digits = "";
    var i = seqLength - 1;
    while(i >= offset) {
      progNumber = progNumber + parseInt(iS[i]);
      digits = (progNumber % 10) + digits;
      i--;
    }
    digits = "0".repeat(parseInt(offset)) + digits;
    iS = digits;
  }
  console.log(iS.slice(offset,offset+8));
}

main();
