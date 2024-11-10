let extra_space = [];

let opCount = 0;

 function pOhanoi(n, start, end) {
    opCount++;
    if (n == 1) {
        let temp = ""+n+start+end;
        extra_space.push(temp);
        return;
    }
    else {
        let other = 6 - (start + end);
        pOhanoi(n - 1, start, other);
        let diff = n-1;
        let temp = ""+diff+other+end;
        if(!extra_space.includes(temp))8
         pOhanoi(n - 1, other, end);
       
    }
}

let count = 0;

function hanoi(n, start, end) {
    count++;
    if (n == 1) {
        return;
    }
    else {
        let other = 6 - (start + end);
        hanoi(n - 1, start, other);
         hanoi(n - 1, other, end);
    }
}

pOhanoi(15,1,3);
hanoi(15,1,3);
console.log("optimal count: "+opCount);
console.log("count: "+count);