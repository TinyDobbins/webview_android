var game;

window.onload = function () {
	setTimeout(function() {
		window.scrollTo(0, 1);
		initGameStates();
	}, 100);
}

var MainGame = {
	Config: {GAME_WIDTH:640, GAME_HEIGHT:960},
	isAPI: !true,
	isDebug: false,
	isGodMode: false,
	title: "title_v1.0",
	state: null,
	stateName: "",
	orientation:0,//0 - PORTRAIT, 1 - LANDSCAPE
	orientated: false,
	GAME_TEXT: null,
	TEXT_FILE: null,
	old_w: false,
	old_h: false,
	onDesktop:false,
	fadeColor: 0x000000,
	textFPS: null,
	showFPS: false,
	isPaused: false,
	isGoAway:false,
	isMusicMuted: false,
	isMusicPlaying:-1,
	nextState:'',
	gameOver: false,
	firstLoad: true,
	firstTime: true,
	firstGo: true,

	initSettings: function () {
		game.input.maxPointers = 1;
		game.stage.disableVisibilityChange = true;
		game.load.crossOrigin = "anonymous";
		game.stage.smoothed = false;

		game.camera.onFadeComplete.add(MainGame.changeState, this);
		MainGame.worldX = game.world.centerX;
		MainGame.worldY = game.world.centerY;

		MainGame.midX = Math.ceil(MainGame.Config.GAME_WIDTH / 2);
	},

	continueGame: function () {
		game.state.start('Menu');
	},

	addButton: function (link, vLayer, vX, vY, onClick, vText, vW, vH, vSize) {
		if (typeof vW === 'undefined') vW = 200;
		if (typeof vH === 'undefined') vH = 80;
		if (typeof vSize === 'undefined') vSize = 36;
		var btn = MainGame.addFill(vLayer, 0x333333, 0, vW, vH, vX-vW/2, vY-vH/2);
		btn.inputEnabled = true;
		btn.events.onInputDown.add(onClick, link);
		btn.text = MainGame.addText(1, vX, vY, vText, vLayer, vSize, '#FFFFFF', 0.5, 0.5);
		return btn;
	},

	addText: function (vT, vX, vY, vText, vLayer, vSize, vColor, vAnchorX, vAnchorY, vStyle) {
		if (typeof vLayer === 'undefined') vLayer = '';
		if (typeof vSize === 'undefined') vSize = 40;
		if (typeof vColor === 'undefined') vColor = '#000000';
		if (typeof vAnchorX === 'undefined') vAnchorX = 0;
		if (typeof vAnchorY === 'undefined') vAnchorY = 0;
		if (typeof vStyle === 'undefined') {
			vStyle = MainGame.styleText3;
		}

		var text;
		if(vLayer!=''){
			text = vLayer.add(game.add.text(vX, vY, vText, vStyle));
		}else{
			text = game.add.text(vX, vY, vText, vStyle);
		}
		text.anchor.setTo(vAnchorX, vAnchorY);
		text.fontSize = vSize;
		text.fill = vColor;
		text.align = "center";
		return text;
	},

	addLineBreak: function (vText){
		return vText.replace(" ", "\n");
	},

	updateTextWidth: function (vText, vMaxWidth){
		var _txtWidth = vText.width;
		var scale = 1;
		if(_txtWidth > vMaxWidth) {
			scale = vMaxWidth/_txtWidth;
			vText.scale.setTo(scale);
		}
		return scale;
	},

	addPanelka: function (vLayer, vX, vY, vW, vH, vColorF, vColorB, vLine){
		if (typeof vColorF === 'undefined') vColorF = 0x000000;
		if (typeof vColorB === 'undefined') vColorB = 0xffffff;
		if (typeof vLine === 'undefined') vLine = 4;
		var graphics = vLayer.add(game.add.graphics(vX, vY));
		graphics.lineStyle(vLine, vColorB, 0.6);
		graphics.beginFill(vColorF, 0.7);
		graphics.drawRect(0, 0, vW, vH);
		graphics.endFill();
		return graphics;
	},

	goToState: function (pNextState) {
		MainGame.isFadeGame = false;
		MainGame.clearGame();
		game.camera.fade(MainGame.fadeColor, 200);
		MainGame.nextState = pNextState;
	},

	changeState: function () {
		if(!MainGame.isFadeGame) game.state.start(MainGame.nextState);
	},

	fadeOut: function () {
		game.camera.flash(MainGame.fadeColor, 200);
	},

	resizeGame: function () {
		var ratio = window.innerWidth/window.innerHeight;
		var standardWidth = 640;
		var standardHeight = 960;
		var maxWidth = 1920;
		var standardRatio = standardWidth/standardHeight;

		if (ratio > standardRatio) {
			game.scale.setGameSize( Math.min(maxWidth, Math.ceil(standardHeight*ratio)) ,standardHeight);
			game.world.setBounds(Math.ceil((game.width-standardWidth)*-0.5),0,game.width,game.height);
		}else {
			game.scale.setGameSize( standardWidth, standardHeight);
			game.world.setBounds(0,0,Math.ceil((game.height-standardHeight)*-0.5),game.height);
		}
	},

	muteSounds: function (btn) {
		game.add.tween(btn.scale).to({x: 0.9, y: 0.9}, 200, Phaser.Easing.Cubic.Out, true);
		game.add.tween(btn.scale).to({x: 1, y: 1}, 200, Phaser.Easing.Cubic.Out, true, 260);
		if(game.sound.mute) {
			btn.frameName = 'btn_sound_0000';
		}else{
			btn.frameName = 'btn_sound_0001';
		}
		game.sound.mute = !game.sound.mute;
		MainGame.isMusicMuted = game.sound.mute;
	},

	playMusic: function (num) {

	},

	stopMusic: function () {

	},

	stopSfx: function(){

	},

	playSound: function (vNum) {

	},

	showFps: function (vX, vY) {
			if (typeof vX === 'undefined') vX = 20;
			if (typeof vY === 'undefined') vY = 20;
			game.time.advancedTiming = true;
			MainGame.textFPS = game.add.text(vX, vY, "FPS", {
				font: "20px Arial",
				fill: "#FFFFFF",
				align: "center"
			});
			MainGame.textFPS.fixedToCamera = true;
	},

	clickLogo: function (vMoreGames) {
		if (typeof vMoreGames === 'undefined') vMoreGames = true;
		if(MainGame.clickOne) return;

		try{
			if(MainGame.isAPI) GamifiveSDK.goToHome();
		}catch (err) {
			console.log(err);
		}

		MainGame.clickOne = true;
		game.time.events.add(500, MainGame.clickOneBack, this);
	},

	clickOneBack: function () {
		MainGame.clickOne = false;
	},

	addFill: function (vLayer, vColor, vAlpha, vW, vH,posX,posY) {
		if (typeof vAlpha === 'undefined') vAlpha = 1;
		if (typeof posX === 'undefined') posX = 0;
		if (typeof posY === 'undefined') posY = 0;
		if (typeof vW === 'undefined') {
			vW = game.width;
			posX = -vW/2;
		}
		if (typeof vH === 'undefined') {
			vH = game.height;
		}
		var bg = vLayer.add(game.add.graphics(posX, posY));
		bg.beginFill(vColor, vAlpha);
		bg.drawRect(0, 0, vW, vH);
		bg.endFill();
		return bg;
	}
};

SimpleButton = function(game, link, kuda, x, y, key, frame, callback, animationScale, vText, vDx, vDy, vStyle, vIsUpperCase) {
	if (typeof vText === 'undefined') vText = '';
	if (typeof vDx === 'undefined') vDx = 0;
	if (typeof vDy === 'undefined') vDy = 0;
	if (typeof animationScale === 'undefined')animationScale = 0;
	if (typeof vStyle === 'undefined') vStyle = MainGame.styleText3;
	if (typeof vIsUpperCase === 'undefined') vIsUpperCase = true;
	//
	_game = game;
	//
	if(kuda == null) {
		this.buttonC = game.add.group();
	}else{
		this.buttonC = kuda.add(game.add.group());
	}
	this.buttonC.x = x;
	this.buttonC.y = y;
	//
	this.button = this.buttonC.add(_game.add.sprite(0, 0, key, frame));
	this.button.game = _game;
	this.button.anchor.setTo(0.5, 0.5);
	this.button.inputEnabled = true;
	//this.button.keyText = vText;

	//if (_game.device.desktop) this.button.input.useHandCursor = true;

	if(vText != ''){
		if(vIsUpperCase) vText = vText.toUpperCase();
		var text = this.buttonC.add(game.add.text(0+vDx, 0+vDy, vText, vStyle));
		text.anchor.set(0.5);
		text.inputEnabled = false;
		this.text = text;
	}

	this.button.events.onInputDown.add(function() {
		//if (_game.device.webAudio) _game.sound.play("s_tap",2.5);
		if(this.buttonC.alpha<1) return;
		_game.add.tween(this.buttonC.scale).to({x: 0.9, y: 0.9}, 200, Phaser.Easing.Cubic.Out, true);
		_game.add.tween(this.buttonC.scale).to({x: 1, y: 1}, 200, Phaser.Easing.Cubic.Out, true, 260);
		_game.time.events.add(250, callback, link);
	}, this);

	if(animationScale > 1){
		_game.add.tween(this.buttonC.scale).to({ x: animationScale, y: animationScale }, 630, Phaser.Easing.Linear.None)
            .to({ x: 1, y: 1}, 630, Phaser.Easing.Linear.None)
            .loop()
            .start();
	}
};

var MyMath = {
	getRandomInt: function (min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	},

	getRandomBool: function () {
		return Math.random() < 0.5 ? true : false;
	},

	shuffleArr: function (o) {
		for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
		return o;
	},

	distanceTwoPoints: function (x1, x2, y1, y2) {
		var dx = x1-x2;
		var dy = y1-y2;
		return dx * dx + dy * dy;
	},

	parseQuery: function (qstr) {
		var query = {};
		var a = qstr.substr(1).split('&');
		for (var i = 0; i < a.length; i++) {
			var b = a[i].split('=');
			query[decodeURIComponent(b[0])] = decodeURIComponent(b[1] || '');
		}
		return query;
	},

	lerp: function(in_Src, in_Dst, in_Ratio) {
		return (in_Src * (1 - in_Ratio)) + (in_Dst * in_Ratio);
	}
};

function initGameStates(){
	game = new Phaser.Game(MainGame.Config.GAME_WIDTH, MainGame.Config.GAME_HEIGHT, Phaser.AUTO, 'game-container');//AUTO  CANVAS

	game.state.add('Boot', MainGame.Boot, true);
	game.state.add('Preloader', MainGame.Preloader);
	game.state.add('Menu', MainGame.Menu);

	setTimeout(function() {
	window.scrollTo(0, 1)
	}, 100);
}

function trace(a) {console.log(a);}
