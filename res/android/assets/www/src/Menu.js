MainGame.Menu = function (game) {

};

MainGame.Menu.prototype = {
	create: function () {
		MainGame.state = this;
		MainGame.stateName = 'Menu';

		this.layerMain = game.add.group();

		MainGame.resizeGame();
		MainGame.fadeOut();

		this.playerPos = {x:320, y:400}

		this.player = this.layerMain.add(game.add.image(this.playerPos.x, this.playerPos.y, 'player'));
		this.player.anchor.setTo(0.5);
		this.player.scale.setTo(2.5);

		game.input.onDown.add(this.stageOnDown, this);
		game.input.onUp.add(this.stageOnUp, this);

		this.startX = 0;
		this.startY = 0;
		this.isMoving = false;
	},

	stageOnDown: function(){
		var pX = this.game.input.worldX;
		var pY = this.game.input.worldY;
		this.startX = pX;
		this.startY = pY;
	},

	stageOnUp: function(){
		var endX = this.game.input.worldX;
		var endY = this.game.input.worldY;

		var distX = this.startX - endX;
		var distY = this.startY - endY;
		if(Math.abs(distX)>Math.abs(distY)*2 && Math.abs(distX)>10){
			if(distX>0){
				this.moveHero('LEFT');
			}else{
				this.moveHero('RIGHT');
			}
		}
		if(Math.abs(distY)>Math.abs(distX)*2 && Math.abs(distY)>10){
			if(distY>0){
				this.moveHero('UP');
			}else{
				this.moveHero('DOWN');
			}
		}
	},

	moveHero: function(vDirection){
		if (this.isMoving) return;
		switch (vDirection) {
			case 'LEFT':
				this.playerPos.x -= 100;
				this.isMoving = true;
			break;
			case 'RIGHT':
				this.playerPos.x += 100;
				this.isMoving = true;
			break;
			case 'UP':
				this.playerPos.y -= 100;
				this.isMoving = true;
			break;
			case 'DOWN':
				this.playerPos.y += 100;
				this.isMoving = true;
			break;
		}

		if(this.isMoving){
			game.add.tween(this.player).to({ x: this.playerPos.x, y: this.playerPos.y}, 250,Phaser.Easing.Back.Out,true).onComplete.add(function() {
				MainGame.state.isMoving = false;
			}, this);
		}
	}
};
