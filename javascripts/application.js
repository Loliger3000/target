function main(){
		// define start game function
		function startGame(){
			window.gameRunning = true;
			createjs.Ticker.addEventListener("tick", handleTick);
		}

		// define stop game function
		function stopGame(){
			window.gameRunning = false;
		}

	// define ball object (function)
		function Ball(x, y, size, speedY, speedX){
		this.x = x;
		this.y = y;
		this.speedY = speedY;
		this.speedX = speedX;
		this.size = size;
		this.hit = false;

		// generate random color
		this.color = function(){
	  		var letters = '0123456789ABCDEF';
   			var color = '#';
    		for (var i = 0; i < 6; i++ ) {
        		color += letters[Math.floor(Math.random() * 16)];
    		};
    		return color;
		}();
		
		// initialize ball (create shape, add to stage and listen to clicks)
		this.init = function() {
			this.shape = new createjs.Shape();

			this.shape.addEventListener("click", function(e) {
				this.hit = true;
				this.hitAt = Date.now();
				var currentPoints = window.points;
				window.points = currentPoints + this.points();
			}.bind(this));

			window.stage.addChild(this.shape);
			this.createdAt = Date.now();
		};
		this.points = function() {
			var timeMultiplicator = 1/(this.hitAt - this.createdAt);
			var sizeMultiplicator = 1/this.size;
			var floatPoints = 10000000 * timeMultiplicator * sizeMultiplicator;
			var roundedPoints = Math.round(floatPoints);
			return roundedPoints;
		};
		// update ball (clear all previous graphics, update position and draw new circle)
		this.update = function(){
			this.shape.graphics.clear();

			if(this.hit == true) { return };

			this.y = this.y + this.speedY;
			this.x = this.x + this.speedX;

			this.shape.graphics.beginFill(this.color).drawCircle(this.x, this.y, this.size);
		};
	};

	// main game loop to draw next frame	
	function handleTick(event) {
		var $points = $('#points');
		$points.html(window.points);

		if(window.gameRunning == false){ return; }

		var hitState = [];

		for( i = 0; i < balls.length; i++) {
			hitState.push(balls[i].hit);
			balls[i].update();
		};

		var allBallsHit = hitState.every(function(element, _, _){ return element == true });
		if(allBallsHit == true) { stopGame(); };

		window.stage.update();
	};

	function hideAllPages() {
		$("#content").find("[data-page]").hide();
	};

	function markAllTabsAsNonActive() {
		var tabs = $("#header").find("[data-show-page]").parent();
		for(i = 0; i < tabs.length; i++) {
			$(tabs[i]).removeClass('active');
		};
	}

	function showPage(pageName) {
		// hide all pages
		hideAllPages();

		// fade in clicked page
		var page = $($("#content").find("[data-page=" + pageName + "]"));
		page.fadeToggle( "slow", "linear" );

		// mark all tabs as non-active
		markAllTabsAsNonActive();

		// mark clicked tab as active
		if(pageName == "play-mode-one" || pageName == "play-mode-two") {
			var li = $($("#header").find("[data-show-page=play]").parent());
		} else {
			var li = $($("#header").find("[data-show-page=" + pageName + "]").parent());
		}

		li.addClass('active');
	};

	function displayPageOnClick() {
		var links = $("#header").find("[data-show-page]");
		for(i = 0; i < links.length; i++) {
			links[i].addEventListener("click", function() {
				var page = $(this).attr("data-show-page");
				showPage(page);
			})					
		};
	};

	// main application
	hideAllPages();
	displayPageOnClick();

	// inital points
	window.points = 0;

	// create stage (draw on canvas)
	window.stage = new createjs.Stage("game");

	// set points to 0
	var $points = $('#points');
	$points.html("0");

	// random ball size
	function randomBallSize() {
		return Math.floor((Math.random() * 10) + 10);
	};

	// create 4 balls
	var ball1 = new Ball(250, 200, randomBallSize(), -1, 0);
	var ball2 = new Ball(250, 300, randomBallSize(), 1, 0);
	var ball3 = new Ball(200, 250, randomBallSize(), 0, -1);
	var ball4 = new Ball(300, 250, randomBallSize(), 0, 1);

	var balls = [ball1, ball2, ball3, ball4];

	// initialize all balls once
	for( i = 0; i < balls.length; i++) {
		balls[i].init();
	};

	// listen to keyboard (Spacebar)
	document.onkeypress = function(e){
		if(e.code == "Space"){
			if(window.gameRunning == true){
				stopGame();
			} else {
				startGame();
			};
		};
	};
};