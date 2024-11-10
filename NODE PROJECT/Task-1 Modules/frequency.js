const map = new Map();

function fre(data){
let i = 0;
let j = data.length-1;

while(i<=j){

if(map.has(data[i])){
   let currfre = map.get(data[i]);
   currfre+=1;
   map.set(data[i],currfre);
}
else
  map.set(data[i],1);

if(i!==j&&map.has(data[j])){
    let currfre = map.get(data[j]);
   currfre+=1;
   map.set(data[j],currfre);
}
else
  map.set(data[j],1);  

  i++;
  j--;
}

return map;

}

module.exports = {fre, map};