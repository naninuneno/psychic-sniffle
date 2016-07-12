var playerId;
var lastMove = new Object();
var lastPosition = new Object();

var aiPlayer = {

	initialize: function(playerId) {
		this.playerId = playerId;
		this.behave();
		return this;
	},

	behave: function() {
		setInterval((function(thiz) {
	        return function() {
	            thiz.huntPlayer();
	        }
	    })(this), 1000);
	},

	huntPlayer: function() {
		var player = document.getElementById("player1Pos");
		var playerRow = getRowNumber(player);
		var playerCol = getColumnNumber(player);
		var currentPosition = document.getElementById(this.playerId);
		var currentRow = getRowNumber(currentPosition);
		var currentCol = getColumnNumber(currentPosition);

		var differenceX = playerCol - currentCol;
		var differenceY = playerRow - currentRow;
		var moveCoordinates = new Object();
		moveCoordinates.x = calculateMovementTowardPlayer(differenceX);
		moveCoordinates.y = calculateMovementTowardPlayer(differenceY);
		
		// prioritise vert over horizontal movement
		if (moveCoordinates.x == 1 && moveCoordinates.y == 1) {
			moveCoordinates.x = 0;
		}

		/* if (currentRow) {

		}
		
		// set last position for backup strats in tracking player
		lastPosition.x = currentCol;
		lastPosition.y = currentRow;
		// set last move for backup strats in tracking player
		lastMove.x = moveCoordinates.x;
		lastMove.y = moveCoordinates.y; */


		move(document.getElementById(this.playerId), moveCoordinates.x, moveCoordinates.y, this.playerId);
	}
};

function calculateMovementTowardPlayer(cellDifference) {
	var difference;
	if (cellDifference == 0) {
		difference = 0;
	} else if (cellDifference > 0) {
		difference = 1;
	} else {
		difference = -1;
	}
	return difference;
}

function calculateBackupMovement() {

}