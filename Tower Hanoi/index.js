let input = document.getElementById("input");
let start = document.getElementById("start");
let add = document.getElementById("add");
let reset = document.getElementById("reset");
let tower1 = document.getElementById("tower1")
let tower2 = document.getElementById("tower2")
let tower3 = document.getElementById("tower3")

function create(n) {
    let width = 25 + (n - 1) * 20;
    for (let i = 0; i < n; i++) {
        let pos = i * 20;
        let elem = document.createElement('div');
        elem.classList.add("plate");
        elem.style.width = width + 'px';
        elem.style.backgroundColor = "rgb(" + Math.floor(Math.random() * 256) + "," + Math.floor(Math.random() * 256) + "," + Math.floor(Math.random() * 256) + ")";
        elem.style.bottom = pos + "px";
        width -= 20;
        tower1.appendChild(elem);
        tower11.push(elem);
    }

}

let tower11 = [];
let tower22 = [];
let tower33 = [];

let extra_space = [];


async function hanoi(n, start, end) {
    if (n == 1) {
        await print(start, end);
        let temp = ""+n+start+end;
        extra_space.push(temp);
        return;
    }
    else {
        let other = 6 - (start + end);
        await hanoi(n - 1, start, other);
        await print(start, end);
        let diff = n-1;
        let temp = ""+diff+other+end;
        if(!extra_space.includes(temp))
        await hanoi(n - 1, other, end);
        else{
            await print(other, end);
        }
    }
}

async function print(start, end) {
    console.log(start + " -> " + end);
    await move(start, end);
}

async function move(start, end) {
    if (start == 1 && end == 2) {
        tower22.push(tower11.pop());
        await build(tower11, tower22, end);
    }
    else if (start == 1 && end == 3) {
        tower33.push(tower11.pop());
       await build(tower11, tower33, end)
    }
    else if (start == 2 && end == 3) {
        tower33.push(tower22.pop());
       await build(tower22, tower33, end)
    }
    else if (start == 2 && end == 1) {
        tower11.push(tower22.pop());
        await build(tower22, tower11, end)
    }
    else if (start == 3 && end == 1) {
        tower11.push(tower33.pop());
        await build(tower33, tower11, end)
    }
    else if (start == 3 && end == 2) {
        tower22.push(tower33.pop());
        await build(tower33, tower22, end)
    }
}


async function build(arr1, arr2, end) {
    var bottomPosition = (arr2.length - 1) * 20;
    let elem = arr2[arr2.length - 1];
    elem.style.bottom = bottomPosition + "px";



    if (end == 1) {
        await tower1.appendChild(elem);
    }

    else if (end == 2)
        await tower2.appendChild(elem);
    else if (end == 3)
        await tower3.appendChild(elem);

    await sleep();

}

async function sleep() {
    return new Promise((res, rej) => {
        setTimeout((res) => res("done"), 1000, res);
    })
}
start.onclick = function () {
    hanoi(+input.value, 1, 3);
}

add.onclick = function () {
    if(+input.value >10){
        alert("please enter number less than or equal to 10")
    }
    else{
        tower11 = [];
        tower1.innerHTML = "";
        start.disabled = false;
        reset.disabled = false;
        create(+input.value)
    }
}

reset.onclick = function () {
    start.disabled = true;
    reset.disabled = true;
    location.reload();
}

