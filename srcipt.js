var form = document.getElementById("form");
var name1 = document.getElementById("itemName");
var cate = document.getElementById("Category");
var list = document.getElementsByClassName("list");
var img = document.getElementById("idimg");

var itemList = [];
var lastImgString = "";
var editting = false;

form.addEventListener("submit", function (e) {
    e.preventDefault();
    addNewItem();
});

function checkInput() {
    var nameItem = name1.value;
    if (nameItem.length >= 10 || Number(nameItem[0])) {
        document.getElementById("invalid").innerHTML = "Name is invalid";
        return false;
    } else if (nameItem.length < 1) {
        document.getElementById("invalid").innerHTML = "Name is required";
        return false;
    }

    var category = cate.value;
    if (category == "Category 0") {
        document.getElementById("invalid2").innerHTML = "Category is required";
        return false;
    }
    return true;
}

function readURL(input) {
    if (input.files && input.files[0]) {
        reader = new FileReader();
        reader.onload = function (e) {
            lastImgString = reader.result
                .replace("data:", "")
                .replace(/^.+,/, "");
            img.src = e.target.result;
            img.width = 200;
            img.height = 200;
        };
        reader.readAsDataURL(input.files[0]);
    }
}

function renderTable() {
    if (localStorage.getItem("item-list") !== null ) {
        var table = document
            .getElementsByClassName("list")[0]
            .getElementsByTagName("tbody")[0];
        table.innerHTML = null;
        itemList = JSON.parse(localStorage.getItem("item-list"));
        for (let i = 0; i < itemList.length; i++) {
            var newRow = table.insertRow(i);
            cell0 = newRow.insertCell(0);
            cell0.innerHTML = itemList[i].id;
            cell1 = newRow.insertCell(1);
            cell1.innerHTML = `<input type="text" value="${itemList[i].name}" id="${"uniqueName"+itemList[i].id}" disabled> `;
            cell2 = newRow.insertCell(2);
            cell2.innerHTML = `<select id="${"uniqueSelect"+itemList[i].id}" disabled>
                                    <option value="Category 1">Category 1</option>
                                    <option value="Category 2">Category 2</option>
                                    <option value="Category 3">Category 3</option>
                                </select> `;
            let select = document.getElementById("uniqueSelect"+itemList[i].id);
            select.value = itemList[i].category
            
            cell3 = newRow.insertCell(3)
            cell3.innerHTML = `
                <img id=${"idimg" + i} src="" alt=" "> 
            `;
            let img = document.getElementById("idimg" + i);
            img.setAttribute(
                "src",
                "data:image/png;base64," + itemList[i].image
            );
            cell4 = newRow.insertCell(4);
            cell4.innerHTML = `
                <div id="${"action"+itemList[i].id}"> 
                    <button class="button edit" onclick="ChangeState(${itemList[i].id})">Update</button>
                    <button class="button delete" onclick="DeleteItem(${itemList[i].id})">Delete</button> 
                </div> 
                    `;
        }
    }
}
function ChangeState(id){
    var action = document.getElementById(`action${id}`)
    var unqName = document.getElementById(`uniqueName${id}`)
    var unqCate = document.getElementById(`uniqueSelect${id}`)

    this.editting = !this.editting
    if(!this.editting) {
        unqName.disabled = !unqName.disabled
        unqCate.disabled = !unqCate.disabled
        action.innerHTML = `
                <div id="${"action"+id}"> 
                    <button class="button edit" onclick="ChangeState(${id})">Update</button>
                    <button class="button delete" onclick="DeleteItem(${id})">Delete</button> 
                </div> 
        `;
    } else {
        unqName.disabled = !unqName.disabled
        unqCate.disabled = !unqCate.disabled
        action.innerHTML = `
                <div id="${"action"+id}"> 
                    <button class="button saveUpdate" onclick="UpdateItem(${id})">Save</button> 
                    <button class="button cancel" onclick="ChangeState(${id})">Cancel</button>
                </div> 
            `;
    }
}

function addNewItem() {
    if (checkInput()) {
        var nameItem = name1.value;
        var category = cate.value;
        var id = Math.floor((Math.random() * 100) + 1);
        var imageString = lastImgString
        itemList.push({
            id: id,
            name: nameItem,
            category: category,
            image: imageString,
        });
        localStorage.setItem("item-list", JSON.stringify(itemList));
        renderTable();
        form.reset();
    }
}

function UpdateItem(id) {
    var unqName = document.getElementById(`uniqueName${id}`)
    var unqCate = document.getElementById(`uniqueSelect${id}`)
    itemList.forEach(item => {
        if(item.id == id) {
            item.name = unqName.value
            item.category = unqCate.value
        }
    })
    localStorage.setItem("item-list", JSON.stringify(itemList));
    renderTable();
    ChangeState(id);
}
function DeleteItem(id) {
    itemList = itemList.filter((item) => item.id != id);
    localStorage.setItem("item-list", JSON.stringify(itemList));
    renderTable();
}
