
function search(id){
    let child = [];
    for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
        let value = JSON.parse(localStorage.getItem(key));
         if(value.parentId==id){
          child.push([key,value.value,value.parentId]);
         }
    }
    return child;
}

function starting(id){
  let child = [];

  
  if(!id)
  return;
  child = search(id);

  let parent = document.getElementById(id).parentNode;
  let ul = document.createElement('ul');
  for(let i = 0;i<child.length;i++){
    let newNode = document.createElement('li');
    newNode.innerHTML = `<span class="node" id="${child[i][0]}">${child[i][1]} ${child[i][0]}</span>`;
    ul.appendChild(newNode);
  }
  parent.appendChild(ul);

  return child;
}


if (typeof (Storage) !== "undefined") {
    function callme(id){
        let child = [];
        child = starting(id);
        if(child.length==0) return;
     
       
        for (let i = 0; i < child.length; i++) {
            callme(child[i][0]);
        }
    } callme(1);
    
}

let count = localStorage.getItem("count");
if(!count)
localStorage.setItem("count",1);


document.addEventListener('click', function (e) {
    const target = e.target;

    if (target.classList.contains('node')) {

        const btnContainer = target.querySelector('.btn-container');
        if (!btnContainer) {
            const dataId = target.getAttribute('id');
            let btn1 = document.createElement('button');
            let btn2 = document.createElement('button');
            let btn3 = document.createElement('button');
            
            btn1.textContent = 'Add';
            btn2.textContent = 'del';
            btn3.textContent = 'move';

            //---------------------------------------------------------->
            btn1.onclick = function () {
                let newNodeText = prompt("enter the node value",);
                
                if (newNodeText){
                    let id = JSON.parse(localStorage.getItem("count"));
                    id+=1;
                    console.log(id)
                    localStorage.setItem("count",JSON.stringify(id));
                    localStorage.setItem(id,JSON.stringify({value:newNodeText,parentId:target.id}));
                    
                    newNodeText += " " + id;
                    const newNode = document.createElement('li');
                    newNode.innerHTML = `<span class="node" id="${id}">${newNodeText}</span>`;
                    if (target.nextElementSibling) {
                        target.nextElementSibling.appendChild(newNode);
                    } else {
                        const newUl = document.createElement('ul');
                        newUl.appendChild(newNode);
                        target.parentNode.appendChild(newUl);
                    }
                }
                btnContainer.remove();
                
            };
            //------------------------------------------------------------------------------------------------------>
            btn2.onclick = function () {
                if (dataId !== '1') {
                 
                    const parentNode = target.parentNode;
                    parentNode.parentNode.removeChild(parentNode);
                    btnContainer.remove();
                    localStorage.removeItem(target.id);
                    let arr = [];
                    arr.push(target.id);
                    
                        for (let i = 0; i < localStorage.length; i++) {
                            let key = localStorage.key(i);
                            let value = JSON.parse(localStorage.getItem(key));
                             if(arr.includes(value.parentId)){
                               arr.push(value.parentId);
                               localStorage.removeItem(key);
                             }
                        }
                
                }

            };
            //-------------------------------------------------------------------------------------------------------------->
            btn3.onclick = function () {
                let id = prompt("Enter the target ID:", '');
                let arr = document.getElementsByClassName('node');

                let targetNode;
                for (let i = 0; i < arr.length; i++) {
                    if (arr[i].getAttribute('id') == id) {
                        targetNode = arr[i];
                        break;
                    }
                }


                if (targetNode) {


                    if (targetNode.nextElementSibling) {
                        let currentParent = target.parentNode
                        targetNode.nextElementSibling.appendChild(currentParent);
                    }
                    else {

                        let targetParent = targetNode.parentNode;
                        let currentParent = target.parentNode;
                        const newUl = document.createElement('ul');
                        newUl.appendChild(currentParent);
                        targetParent.appendChild(newUl);
                    }

                    btnContainer.remove();
                   
                  let obj = JSON.parse(localStorage.getItem(target.id));
                  obj.parentId = id;
                  localStorage.setItem(target.id,JSON.stringify(obj));

                   
                } else {
                    alert("Node with ID " + id + " not found.");
                }
            }
            //------------------------------------------------------------------------------------------->
            const btnContainer = document.createElement('div');
            btnContainer.classList.add('btn-container');
            btnContainer.appendChild(btn1);
            if (dataId !== '1') {
                btnContainer.appendChild(btn2);
                btnContainer.appendChild(btn3);
            }

            target.appendChild(btnContainer);

        } else {
            btnContainer.remove();
        }

    }
});










