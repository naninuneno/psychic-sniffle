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
aiPlayer.initialize("player2Pos");

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
        movePlayer1(xMove, yMove);
    });

    /* needed, but super buggy right now and a fucking headache
    // sustained press to move multiple cells
    section.addEventListener("mousedown", function() {
        clickTimeout = setInterval(function() { 
            movePlayer1(xMove, yMove); 
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
            placeBomb(3);
        });
}

// for browser
function doSomethingWithKeyInput(e) {
    switch(e.keyCode) {
        // left key pressed
        case 37:
            movePlayer1(-1, 0);
            break;
        // up key pressed
        case 38:
            movePlayer1(0, -1);
            break;
        // right key pressed
        case 39:
            movePlayer1(1, 0);
            break;
        // down key pressed
        case 40:
            movePlayer1(0, 1);
            break; 
        // space key pressed - boom!
        case 32:
            placeBomb(3);
            break;
    }   
}

function getplayer1Pos() {
    return document.getElementById("player1Pos");
}

function movePlayer1(xMove, yMove) {
    move(getplayer1Pos(), xMove, yMove, "player1Pos");
}

// todo: remove playerpos, use helper method like
//  getPlayerPos(playerId) to get it
function move(playerPos, xMove, yMove, playerId) {

    var newplayer1Pos = getCellWithOffsetFromOtherCell(playerPos, xMove, yMove);

    // don't allow movement into a block space or another player
    if (canMoveIntoCell(newplayer1Pos)) {
        // remove current player position
        playerPos.innerHTML = "";
        playerPos.removeAttribute("id");

        // add new player position        
        newplayer1Pos.setAttribute("id", playerId);
        gameMap.generateSprite(playerId);
    }
}

function canMoveIntoCell(cell) {
    return (cell != null &&
        !(cell.className.indexOf("Block") > -1) &&
        !(cell.className.indexOf("placedBomb") > -1) &&
        !(cell.id.indexOf("player") > -1));
}

function canBoom() {
    return (getCurrentTime() - lastBoomTime) > 1500;
}

function placeBomb(radius) {
    // time restriction between booms
    if (!canBoom()) {
        return;
    }

    var bombPlacedPos = getplayer1Pos();
    bombPlacedPos.className += " placedBomb";

    // deactivate ability to set bombs for a while
    lastBoomTime = getCurrentTime();
    setIconInactive();

    // let bomb sit for short while before boom
    setTimeout(function() { boom(radius, bombPlacedPos); }, 1500);
}

function boom(radius, bombPlacedPos) {
    // e.g. 5 radius will give 5, -5 for coordinates
    var offset = radius;
    var minusOffset = radius - (2*radius);

    var booms = [];

    // 1 boom line for each direction, separate for loops so they can break on block collision
    // left
    for (i = 0; i >= minusOffset; i--) {
        var boomPos = getCellWithOffsetFromOtherCell(bombPlacedPos, i, 0);
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
        var boomPos = getCellWithOffsetFromOtherCell(bombPlacedPos, 0, i);
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
        var boomPos = getCellWithOffsetFromOtherCell(bombPlacedPos, i, 0);
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
        var boomPos = getCellWithOffsetFromOtherCell(bombPlacedPos, 0, i);
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

    bombPlacedPos.className = bombPlacedPos.className.replace(" placedBomb", "");

    // clear booms after short while
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

function getCellWithOffsetFromCurrentPos(x, y) {
    return getCellWithOffsetFromOtherCell(getplayer1Pos(), x, y);
}

function getCellWithOffsetFromOtherCell(otherCell, x, y) {

    // find row & cell
    var rowStr = getRowNumber(otherCell);
    var cellStr = getColumnNumber(otherCell);

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

function getRowNumber(cell) {
    return cell.parentElement.getAttribute("id").substring(4);
}

function getColumnNumber(cell) {
    var cellClasses = cell.getAttribute("class").split(" ");
    var cellStr;
    cellClasses.forEach(function(entry) {
        if (entry.startsWith("cell-")) {
            cellStr = entry.substring(5);
        }
    });
    return cellStr;
}