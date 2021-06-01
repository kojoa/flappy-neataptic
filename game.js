flappy = function(container, dieFunc) {	
	
	var game = new Phaser.Game(320, 480, Phaser.CANVAS, container);
	
	var bird;
	var birdGravity = 800;
	var birdSpeed = 125;
	var birdFlapPower = 300;
	var pipeInterval = 2000;
    var brainInterval = 50;
    var scoreInterval = 50;
	var pipeHole = 120;
	var pipeHolePosition;
	var upperPipe;
	var pipeGroup;
	var score = 0;
	var maxScore = 1000;
	var scoreText;
    var brain;
    var play = function(game){}
     
    play.prototype = {

		preload:function(){
			game.load.image("bird", "bird.png"); 
			game.load.image("pipe", "pipe.png");	
		},
		create:function(){
			pipeGroup = game.add.group();
			score = 0;
			scoreText = game.add.text(10,10,"-",{
				font:"bold 16px Arial"
			});

			game.stage.backgroundColor = "#87CEEB";
			game.stage.disableVisibilityChange = true;
			game.physics.startSystem(Phaser.Physics.ARCADE);
			bird = game.add.sprite(80,240,"bird");
			bird.anchor.set(0.5);
			bird.width = 20;
			bird.height = 20;
			game.physics.arcade.enable(bird);
			bird.body.gravity.y = birdGravity;
			
			//game.input.onDown.add(flap, this);
			
			game.time.events.loop(pipeInterval, addPipe); 
			game.time.events.loop(brainInterval, brainAct, this);
			game.time.events.loop(scoreInterval, updateScore, this);
			addPipe();
		},
		update:function(){

			game.physics.arcade.collide(bird, pipeGroup, die);
			if(bird.y>game.height){
				die();
			}	
			if(bird.y<0){
				die();
			}
			if (score >= maxScore){
				die();
			}
		}
	}
     
    game.state.add("Play",play);
    
    this.start = function() {
    	game.state.start("Play");
    	game.paused = false;
	}
     
	this.setBrain = function(b) {
    	play.prototype.brain = b;
	}

    function brainAct(){
    	const input = [Math.floor(bird.body.y) - Math.floor(pipeHolePosition), Math.floor(upperPipe.body.x - bird.body.x)]
        const output = this.brain.activate(input).map(o => Math.round(o))
  
    	if (output[0]) flap()
    }

    function updateScore(){
     	
     	score += 1;
     	this.brain.score = score;
		scoreText.text = "Score: "+score;	
	}
     
	function flap(){
		bird.body.velocity.y = -birdFlapPower;	
	}

	function addPipe(){
		pipeHolePosition = game.rnd.between(50,430-pipeHole);
		upperPipe = new Pipe(game,320,pipeHolePosition-480,-birdSpeed);
		upperPipe.width = 4;
		game.add.existing(upperPipe);
		pipeGroup.add(upperPipe);
		var lowerPipe = new Pipe(game,320,pipeHolePosition+pipeHole,-birdSpeed);
		lowerPipe.width = 4;
		game.add.existing(lowerPipe);
		pipeGroup.add(lowerPipe);

	}
	
	function die(){
		game.paused = true;
		dieFunc();	
	}
	
	Pipe = function (game, x, y, speed) {
		Phaser.Sprite.call(this, game, x, y, "pipe");
		game.physics.enable(this, Phaser.Physics.ARCADE);
		this.body.velocity.x = speed;
	};
	
	Pipe.prototype = Object.create(Phaser.Sprite.prototype);
	Pipe.prototype.constructor = Pipe;
	
	Pipe.prototype.update = function() {
		if(this.x<-this.width){
			this.destroy();
		}
	};	

}
