var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

app.initialize();




// // // // // /* MY not bomberman STUFF */ // // // // //

var lastBoomTime = 0;

function getCurrentTime() {
    return new Date().getTime();
}

addPlayer();
addBlocks();

function addPlayer() {
    var elem = document.createElement("img");
    elem.src = "img/copyright.gif";
    elem.setAttribute("height", "100%");
    elem.setAttribute("width", "100%");
    document.getElementById("playerPos").appendChild(elem);
}

function addBlocks() {
    for (i = 1; i <= 10; i++) {
        for (j = 1; j <= 25; j++) {
            // random on whether particular cell will hold a block
            if (Math.random() < 0.5) {
                var cell = document
                    .getElementById("row-" + i)
                    .getElementsByClassName("cell-" + j)[0];

                // don't generate block in player position    
                if (!(cell.id.indexOf("playerPos") > -1)) {
                    cell.className += " block";
                }
            }
        }
    }
}

/* listener for key presses */
window.addEventListener("keydown", doSomethingWithKeyInput, false);
 
function doSomethingWithKeyInput(e) {
    switch(e.keyCode) {
        // left key pressed
        case 37:
            move(-1, 0);
            break;
        // up key pressed
        case 38:
            move(0, -1);
            break;
        // right key pressed
        case 39:
            move(1, 0);
            break;
        // down key pressed
        case 40:
            move(0, 1);
            break; 
        // space key pressed - boom!
        case 32:
            boom(3);
            break;
    }   
}

function getPlayerPos() {
    return document.getElementById("playerPos");
}

function move(xMove, yMove) {

    var currentPlayerPos = getPlayerPos();
    var newPlayerPos = getCellWithOffsetFromCurrentPos(xMove, yMove);

    // don't allow movement into a block space
    if (newPlayerPos != null &&
        !(newPlayerPos.className.indexOf("block") > -1)) {
        // remove current player position
        currentPlayerPos.innerHTML = "";
        currentPlayerPos.removeAttribute("id");

        // add new player position        
        newPlayerPos.setAttribute("id", "playerPos");
        addPlayer();
    }
}

function canBoom() {
    return (getCurrentTime() - lastBoomTime) > 1500;
}

function boom(radius) {

    // time restriction between booms
    if (!canBoom()) {
        return;
    }

    // e.g. 5 radius will give 5, -5 for coordinates
    var offset = radius;
    var minusOffset = radius - (2*radius);

    var booms = [];
    for (i = minusOffset; i <= offset; i++) {
        // horizontal
        var boomPosX = getCellWithOffsetFromCurrentPos(i, 0);
        if (boomPosX != null) {
            // booms blow up blocks
            boomPosX.className = boomPosX.className.replace(" block", "");

            booms.push(boomPosX);
            boomPosX.className += " boom";
        }

        // vertical
        var boomPosY = getCellWithOffsetFromCurrentPos(0, i);
        if (boomPosY != null) {
            // booms blow up blocks
            boomPosY.className = boomPosY.className.replace(" block", "");

            booms.push(boomPosY);
            boomPosY.className += " boom";
        }
    }

    lastBoomTime = getCurrentTime();

    setTimeout(function() { clearBooms(booms); }, 500);
}

function clearBooms(booms) {
    booms.forEach(function(boom) {
        var className = boom.className;
        boom.className = className.replace(" boom", "");
    });
}

// TODO : pass in the position of whatever is getting offset of 
    // would allow for enemy stuff etc.
function getCellWithOffsetFromCurrentPos(x, y) {
    var currentPlayerPos = getPlayerPos();

    // find current row & cell
    var rowStr = currentPlayerPos.parentElement.getAttribute("id").substring(4);
    var cellClasses = currentPlayerPos.getAttribute("class").split(" ");
    var cellStr;
    cellClasses.forEach(function(entry) {
        if (entry.startsWith("cell-")) {
            cellStr = entry.substring(5);
        }
    });

    // move to next position
    var oldRow = parseInt(rowStr);
    var oldCell = parseInt(cellStr);
    var newRow = oldRow + y;
    var newCell = oldCell + x;

    var newRowEl = document.getElementById("row-" + newRow);

    // checks that grid boundaries aren't being broken
    if (newRowEl != null) {
        var newCellEls = newRowEl.getElementsByClassName("cell-" + newCell);
        if (newCellEls.length > 0) {
            return newCellEls[0];
        }
    }

    return null;
}