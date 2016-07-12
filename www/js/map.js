var rows = 10;
var columns = 25;
var softBlockProbability = 0.4;
var hardBlockProbability = 0.2;

var map = {

	initialize: function() {
		this.addPlayer(1);
		this.addPlayer(2);
		this.addBlocks();
		return this;
	},

	// add blocks that can block player's path
	addBlocks: function() {
		this.addSoftBlocks();
		this.addHardBlocks();
	},

	// add player
	addPlayer: function(playerno) {
		var playerRow = Math.floor(Math.random() * 10) + 1;
		var playerColumn = Math.floor(Math.random() * 25) + 1;
        var cell = document
            .getElementById("row-" + playerRow)
            .getElementsByClassName("cell-" + playerColumn)[0];

        cell.setAttribute("id", "player"+playerno+"Pos");

        this.generateSprite(playerno);
	},

	generateSprite: function(playerno) {
		var sprite = document.createElement("img");
	    sprite.src = "img/copyright.gif";
	    sprite.setAttribute("height", "100%");
	    sprite.setAttribute("width", "100%");
	    document.getElementById("player"+playerno+"Pos").appendChild(sprite);
	},

	// add 'soft' blocks - that the player can destroy
	addSoftBlocks: function() {
		for (i = 1; i <= rows; i++) {
		    for (j = 1; j <= columns; j++) {
		        // random on whether particular cell will hold a block
		        if (Math.random() < softBlockProbability) {
		            var cell = document
		                .getElementById("row-" + i)
		                .getElementsByClassName("cell-" + j)[0];

		            // don't generate block in player position    
		            if (!(cell.id.indexOf("player1Pos") > -1)) {
		                cell.className += " softBlock";
		            }
		        }
		    }
    	}
	},

	// add 'hard' blocks, that are immune to explosions
	addHardBlocks: function() {
		for (i = 1; i <= rows; i++) {
		    for (j = 1; j <= columns; j++) {
		        // random on whether particular cell will hold a block
		        if (Math.random() < hardBlockProbability) {
		            var cell = document
		                .getElementById("row-" + i)
		                .getElementsByClassName("cell-" + j)[0];

		            if (cell.className.indexOf("softBlock") > -1) {
		            	continue;
		            }

		            // don't generate block in player position    
		            if (!(cell.id.indexOf("player1Pos") > -1)) {
		                cell.className += " hardBlock";
		            }
		        }
		    }
    	}
	}
};