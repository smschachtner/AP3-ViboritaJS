var fps;
var nivel;
var puntaje;

var snake_array; //an array of cells to make arriba the snake

// width y height (en pixeles)
var w = $("#canvas").width();
var h = $("#canvas").height();

//Lets save the cell width in a variable for easy control
var cw = 10;

var d;	//dir de la viborita

var food;


var nx;
var ny;

$(document).ready(function () {
	//Canvas stuff
	var canvas = $("#canvas")[0];
	var ctx = canvas.getContext("2d");

	function init() {
		d = "derecha"; //default direction
		create_snake();
		create_food(); //Now we can see the food particle
		//finally lets display the puntaje
		puntaje = 0;
		nivel = 1;
		fps = 10;

		//Lets move the snake now using a timer which will trigger the paint function
		if (typeof game_loop != "undefined")
			clearInterval(game_loop);
		game_loop = setInterval(paint, 1000 / fps);
	}
	init();

	function create_snake() {
		var length = 5; //Length of the snake
		snake_array = []; //Empty array to start with
		for (var i = length - 1; i >= 0; i--) {
			//This will create a horizontal snake starting from the top izquierda
			snake_array.push({ x: i, y: 0 });
		}
	}

	//Lets create the food now
	function create_food() {
		food = {
			x: Math.round(Math.random() * (w - cw) / cw),
			y: Math.round(Math.random() * (h - cw) / cw),
		};
		//This will create a cell with x/y between 0-44
		//Because there are 45(450/10) positions accross the rows and columns
	}

	//Lets paint the snake now
	function paint() {
		//To avoid the snake trail we need to paint the BG on every frame
		//Lets paint the canvas now
		ctx.fillStyle = "white";
		ctx.fillRect(0, 0, w, h);
		ctx.strokeStyle = "black";
		ctx.strokeRect(0, 0, w, h);

		//The movement code for the snake to come here.
		//The logic is simple
		//Pop out the tail cell and place it infront of the head cell
		nx = snake_array[0].x;
		ny = snake_array[0].y;
		//These were the position of the head cell.
		//We will increment it to get the new head position
		//Lets add proper direction based movement now
		if (d == "derecha") nx++;
		else if (d == "izquierda") nx--;
		else if (d == "arriba") ny--;
		else if (d == "abajo") ny++;


		//Lets add the game over clauses now
		//This will restart the game if the snake hits the wall
		//Lets add the code for body collision
		//Now if the head of the snake bumps into its body, the game will restart
		//if (nx == -1 || nx == w / cw || ny == -1 || ny == h / cw || check_collision(nx, ny, snake_array)) {


		if (typeof perdio === "function") {
			if (perdio(snake_array) == true) {
				//restart game
				init();
				//Lets organize the code a bit now.
				return;
			}
		}


		//Lets write the code to make the snake eat the food
		//The logic is simple
		//If the new head position matches with that of the food,
		//Create a new head instead of moving the tail
		//if (nx == food.x && ny == food.y) {
		if (typeof viboritaPuedeComerManzana === "function" && viboritaPuedeComerManzana()) {
			var tail = { x: nx, y: ny };

			if (typeof aumentarPuntaje === "function")
				aumentarPuntaje();

			//Create new food
			create_food();

			if (typeof game_loop != "undefined")
				clearInterval(game_loop);
			game_loop = setInterval(paint, 1000 / fps);
		}
		else {
			var tail = snake_array.pop(); //pops out the last cell
			tail.x = nx;
			tail.y = ny;
		}

		//The snake can now eat the food.

		snake_array.unshift(tail); //puts back the tail as the first cell

		for (var i = 0; i < snake_array.length; i++) {
			var c = snake_array[i];
			//Lets paint 10px wide cells
			paint_cell(c.x, c.y, "blue");
		}

		//Lets paint the food
		paint_cell(food.x, food.y, "red");
		//Lets paint the puntaje
		var puntaje_text = "Puntaje: " + puntaje;
		var nivel_text = "Nivel: " + nivel;
		var fps_text = "FPS: " + fps;

		ctx.font = '15px arial';
		ctx.fillText(puntaje_text, 5, h - 5);
		ctx.fillText(nivel_text, 100, h - 5);
		ctx.fillText(fps_text, 200, h - 5);
	}

	//Lets first create a generic function to paint cells
	function paint_cell(x, y, color) {
		ctx.fillStyle = color;
		ctx.fillRect(x * cw, y * cw, cw, cw);
		ctx.strokeStyle = "white";
		ctx.strokeRect(x * cw, y * cw, cw, cw);
	}

	//Lets add the keyboard controls now
	$(document).keydown(function (e) {
		var key = e.which;

		if (typeof establecerDireccion === "function") {
			d = establecerDireccion(key);
		}
	})

})

function direccionViborita() {
	return d;
}

function check_collision(x, y, array) {
	//This function will check if the provided x/y coordinates exist
	//in an array of cells or not
	for (var i = 0; i < array.length; i++) {
		if (array[i].x == x && array[i].y == y) {
			return true;
		}
	}
	return false;
}

function seEnredo(viborita) {
	return check_collision(posicionEnXDeLaViborita(), posicionEnYDeLaViborita(), viborita);
}

function posicionEnXDeLaViborita() {
	return nx;
}

function posicionEnYDeLaViborita() {
	return ny;
}

function anchoDeLaVentana() {
	return w / cw;
}

function altoDeLaVentana() {
	return h / cw;
}

function posicionEnXDeLaManzana() {
	return food.x;
}

function posicionEnYDeLaManzana() {
	return food.y;
}