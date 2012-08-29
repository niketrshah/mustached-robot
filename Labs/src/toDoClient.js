function getPendingTbl() {
    return document.getElementsByClassName('pendingToDoTable')[0];
}

function getDoneTbl() {
    return document.getElementsByClassName('doneToDoTable')[0];
}

function createToDoClickListener() {
    cleanupPendingToDos();
    createPendingToDos();
}

function createDoneToDoClickListener(id) {
    cleanupDoneToDos();
    createDoneToDos(id);

    cleanupPendingToDos();
    getPendingToDos();
}

function createPendingToDos() {
    var name = document.getElementsByClassName('toDoName')[0].value;
    var xmlHttpReq = new XMLHttpRequest();
    xmlHttpReq.open("POST", "http://localhost:8124/createPending", true);
    xmlHttpReq.send("name=" + name);
    xmlHttpReq.onreadystatechange = function refreshPendingTaskList() {
        updatePendingToDos(xmlHttpReq);
    };
}

function createDoneToDos(id) {
    var xmlHttpReq = new XMLHttpRequest();
    xmlHttpReq.open("POST", "http://localhost:8124/createDone", true);
    xmlHttpReq.send("id=" + id);
    xmlHttpReq.onreadystatechange = function refreshPendingTaskList() {
        updateDoneToDos(xmlHttpReq);
    };
}

function getPendingToDos() {
    var xmlHttpReq = new XMLHttpRequest();
    xmlHttpReq.open("GET", "http://localhost:8124/getPending", true);
    xmlHttpReq.send();
    xmlHttpReq.onreadystatechange = function refreshPendingTaskList() {
        updatePendingToDos(xmlHttpReq);
    };
}

function getDoneToDos() {
    var xmlHttpReq = new XMLHttpRequest();
    xmlHttpReq.open("GET", "http://localhost:8124/getDone", true);
    xmlHttpReq.send();
    xmlHttpReq.onreadystatechange = function refreshDoneTaskList() {
        updateDoneToDos(xmlHttpReq);
    };
}

function updatePendingToDos(xmlHttpReq) {
    if (xmlHttpReq.readyState == 4) {
        var toDos = eval('(' + xmlHttpReq.response + ')');
        for (i in toDos) {
            var name = toDos[i].name;
            var id = toDos[i].id;
            var rowEle = document.createElement("tr");
            var td2Ele = document.createElement("td");

            var td1Ele = document.createElement("td");
            td1Ele.innerHTML = name;

            var markDoneToDoButton = document.createElement("input");
            markDoneToDoButton.setAttribute("type", 'button');
            markDoneToDoButton.setAttribute("value", 'Done');
            markDoneToDoButton.setAttribute("class", 'toDoDoneButton');
            markDoneToDoButton.setAttribute("onclick", 'createDoneToDoClickListener('+ id + ')');

            var toDoId = document.createElement("input");
            toDoId.setAttribute("type", 'hidden');
            toDoId.setAttribute("value", i);
            toDoId.setAttribute("class", 'toDoId');

            rowEle.appendChild(td1Ele);
            rowEle.appendChild(td2Ele);
            rowEle.appendChild(toDoId);
            td2Ele.appendChild(markDoneToDoButton);
            getPendingTbl().appendChild(rowEle);
        }
    }
}

function updateDoneToDos(xmlHttpReq) {
    if (xmlHttpReq.readyState == 4) {
        var toDos = eval('(' + xmlHttpReq.response + ')');
        for (i in toDos) {
            var name = toDos[i].name;
            var rowEle = document.createElement("tr");

            var tdEle = document.createElement("td");
            tdEle.innerHTML = name;

            rowEle.appendChild(tdEle);
            getDoneTbl().appendChild(rowEle);
        }
    }
}

function cleanupPendingToDos() {
    for(var i = getPendingTbl().rows.length; i > 0; i--) {
        getPendingTbl().deleteRow(i -1);
    }
}

function cleanupDoneToDos() {
    for(var i = getDoneTbl().rows.length; i > 0; i--) {
        getDoneTbl().deleteRow(i -1);
    }
}

getPendingToDos();
getDoneToDos();
