class Reaction{
  constructor(formula){
      this.reset();
      var split, subsplit, a;
      this.reagents = [];
      this.formula=formula;
      split = formula.match(/(.*)\s=>\s(\d+)\s([A-Z]+)/);
      this.product=(new Component(split[3],parseInt(split[2])));
      split = split[1].split(', ');
      for(a=0;a<split.length;a++){
          subsplit=split[a].match(/(\d+)\s([A-Z]+)/);
          this.reagents.push(new Component(subsplit[2],parseInt(subsplit[1])));
      }
  }

  addReqQty(qty){
      var prevreq;

      prevreq=this.totreq;
      this.req+=qty;
      this.totreq=Math.ceil(this.req/this.product.qty)*this.product.qty;
      this.waste=this.totreq-this.req;
      
      return this.totreq-prevreq;
  }

  reset(){
      this.req=0;
      this.totreq=0;
      this.waste=0;
  }
}

class Component{
  constructor(molecule,qty){
      this.molecule=molecule;
      this.qty=qty;
  }
}

function oreReq(molecule, reqqty){
  var retval=0;
  var ix;
  var pqty;
  var r;
  var a;
  
  ix=prodix.indexOf(molecule);
  pqty=reactions[ix].product.qty;
  reqqty=reactions[ix].addReqQty(reqqty);

  for(a=0;a<reactions[ix].reagents.length;a++){
      r=reactions[ix].reagents[a];
      if(r.molecule=='ORE'){
          retval+=r.qty*(reqqty/pqty);
      } else {
          retval+=oreReq(r.molecule,r.qty*(reqqty/pqty))
      };
  }
  return retval;
}

const fs = require('fs');
var data = fs.readFileSync('input.txt').toString().split('\n');
if(data[data.length-1]==''){data.pop();}

var ret;
var reactions = [];
var prodix=[];

for(i=0;i<data.length;i++){
  reactions.push(new Reaction(data[i]));
  prodix.push(reactions[i].product.molecule)
}

ret=oreReq('FUEL',1);
console.log('Part 1: '+ret);

//PART 2
var maxore=1000000000000;
var inc=maxore/100;
var fuel=Math.ceil(maxore/ret);

while(inc>=1){
  ore=0;
  while(ore<maxore){
      fuel+=inc;
      //reset quantities
      for(i=0;i<reactions.length;i++){
          reactions[i].reset();
      }

      ore=oreReq('FUEL',fuel);
  }
  fuel-=inc;
  inc=inc/10;
}

ret=fuel;

console.log('Part 2: '+ret);