MainGame.Preloader = function (game) {
	this.background = null;
	this.preloadBar = null;
	this.ready = false;
};

MainGame.Preloader.prototype = {
	preload: function () {
		game.stage.backgroundColor = '#333333';

		var width = Math.ceil(318/2);
		this.background = game.add.sprite(MainGame.worldX-width, MainGame.worldY+10, 'preloader_back');
	    this.preloadBar = game.add.sprite(MainGame.worldX-width, MainGame.worldY+10, 'preloader_bar');
	    game.load.setPreloadSprite(this.preloadBar);

		this.load.image('player', 'assets/player.png?r=1');
	},

	create: function () {

	},

	update: function () {
		if (!this.ready) {
			this.ready = true;
			MainGame.continueGame();
		}
	}
};
