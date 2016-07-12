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

var gameMap = map.initialize();

var lastBoomTime = 0;

function getCurrentTime() {
    return new Date().getTime();
}

/* listener for key presses - for browser testing */
window.addEventListener("keydown", doSomethingWithKeyInput, false);

var clickTimeout;
document.addEventListener("mouseup", function() {
    clearInterval(clickTimeout);
});

addSectionClickListener("topSection", 0, -1);
addSectionClickListener("bottomSection", 0, 1);
addSectionClickListener("leftSection", -1, 0);
addSectionClickListener("rightSection", 1, 0);
addBoomListener();

function addSectionClickListener(sectionId, xMove, yMove) {
    var section = document.getElementById(sectionId);

    // single press
    section.addEventListener("mousedown", function() {
        move(xMove, yMove);
    });

    /* needed, but super buggy right now and a fucking headache
    // sustained press to move multiple cells
    section.addEventListener("mousedown", function() {
        clickTimeout = setInterval(function() { 
            move(xMove, yMove); 
        }, 250) 
    });*/

    // stop sustained press on mouseup/mouseout
    document.addEventListener("mouseup", function() {
        clearInterval(clickTimeout);
        return false;
    });
}

function addBoomListener() {
    document.getElementById("bombIcon")
        .addEventListener("click", function() {
            boom(3);
        });
}

// for browser
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

function getplayer1Pos() {
    return document.getElementById("player1Pos");
}

function move(xMove, yMove) {

    var currentplayer1Pos = getplayer1Pos();
    var newplayer1Pos = getCellWithOffsetFromCurrentPos(xMove, yMove);

    // don't allow movement into a block space or another player
    if (newplayer1Pos != null &&
        !(newplayer1Pos.className.indexOf("Block") > -1) &&
        !(newplayer1Pos.id.indexOf("player") > -1)) {
        // remove current player position
        currentplayer1Pos.innerHTML = "";
        currentplayer1Pos.removeAttribute("id");

        // add new player position        
        newplayer1Pos.setAttribute("id", "player1Pos");
        gameMap.generateSprite(1);
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

    // 1 boom line for each direction, separate for loops so they can break on block collision
    // left
    for (i = -1; i >= minusOffset; i--) {
        var boomPos = getCellWithOffsetFromCurrentPos(i, 0);
        if (boomPos != null) {
            var blockCollision = boomPos.className.indexOf("Block") > -1;
            // booms blow up blocks
            boomPos.className = boomPos.className.replace(" softBlock", "");

            booms.push(boomPos);
            boomPos.className += " boom";

            if (blockCollision) {
                break;
            }
        }
    }

    // up
    for (i = -1; i >= minusOffset; i--) {
        var boomPos = getCellWithOffsetFromCurrentPos(0, i);
        if (boomPos != null) {
            var blockCollision = boomPos.className.indexOf("Block") > -1;
            // booms blow up blocks
            boomPos.className = boomPos.className.replace(" softBlock", "");

            booms.push(boomPos);
            boomPos.className += " boom";

            if (blockCollision) {
                break;
            }
        }
    }

    // right
    for (i = 1; i <= offset; i++) {
        var boomPos = getCellWithOffsetFromCurrentPos(i, 0);
        if (boomPos != null) {
            var blockCollision = boomPos.className.indexOf("Block") > -1;
            // booms blow up blocks
            boomPos.className = boomPos.className.replace(" softBlock", "");

            booms.push(boomPos);
            boomPos.className += " boom";

            if (blockCollision) {
                break;
            }
        }
    }

    // down
    for (i = 1; i <= offset; i++) {
        var boomPos = getCellWithOffsetFromCurrentPos(0, i);
        if (boomPos != null) {
            var blockCollision = boomPos.className.indexOf("Block") > -1;
            // booms blow up blocks
            boomPos.className = boomPos.className.replace(" softBlock", "");

            booms.push(boomPos);
            boomPos.className += " boom";

            if (blockCollision) {
                break;
            }
        }
    }

    /*for (i = minusOffset; i <= offset; i++) {
        // horizontal
        var boomPosX = getCellWithOffsetFromCurrentPos(i, 0);
        if (boomPosX != null) {
            // booms blow up blocks
            boomPosX.className = boomPosX.className.replace(" softBlock", "");

            booms.push(boomPosX);
            boomPosX.className += " boom";
        }

        // vertical
        var boomPosY = getCellWithOffsetFromCurrentPos(0, i);
        if (boomPosY != null) {
            // booms blow up blocks
            boomPosY.className = boomPosY.className.replace(" softBlock", "");

            booms.push(boomPosY);
            boomPosY.className += " boom";
        }
    }*/

    // set icon inactive for a while and clear booms 
    //  after time period
    lastBoomTime = getCurrentTime();
    setIconInactive();
    setTimeout(function() { clearBooms(booms); }, 500);
}

function setIconInactive() {
    var bombIcon = document.getElementById("bombIcon");
    bombIcon.className += " bombIconInactive";
    setTimeout(function() {
        bombIcon.className = bombIcon.className.replace(" bombIconInactive", "");
    }, 1500);
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
    var currentplayer1Pos = getplayer1Pos();

    // find current row & cell
    var rowStr = currentplayer1Pos.parentElement.getAttribute("id").substring(4);
    var cellClasses = currentplayer1Pos.getAttribute("class").split(" ");
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