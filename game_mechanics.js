/* 
    The querySelector method lets you retrieve an element using a CSS selector query.
    The getElementById method retrieves an element by its DOM ID.
*/

// canvas. vamos a jalar el canvas de css y no de html
const gameBoard = document.querySelector("#gameBoard");

/* to paint in the canvas, we need to give context */
const ctx = gameBoard.getContext("2d");

// vamos a jalar el scoretext del css y no del html
const scoreText = document.querySelector("#scoreText");

// vamos a jalar el boton del css y no del html
const resetButton = document.querySelector("#resetButton");

// anchura y altura los vamos a jalar del html y no del css
const gameWidth = gameBoard.width;
const gameHeight = gameBoard.height;

// comenzamos a pintar el tablero de juego
const boardBackground = "white";

// color  de la serpiente
const snakeColor = "purple";

// color de borde de la serpiente
const snakeBorder = "white";

// color para la comida
const foodColor = "green";

// el tamaño de todo lo que está dentro de nuestro juego
const unitSize = 25;

// para determinar si nuestro juego estâ corriendo o no
let running = false;

// AL INICIAR EL JUEGO
// velocidad sobre el eje X: vamos a escoger el mismo que unitSize, si el valor es positivo,
// entonces nos movemos hacia la derecha, si es negativo entonces hacia la izquierda.
// Al inciar el juego, la serpiente se mueve hacia la derecha por default
let xVelocity = unitSize;

// velocidad eje Y, por defecto al inciar el juego la serpiente no se mueve hacia arriba ni abajo
// si fuera para arriba sería unitSize, para abajo -unitSize
let yVelocity = 0;

//the coordinates for our food. We'll calculate them later with a function
let foodX;
let foodY;

// score
let score = 0;

// the snake itself. It's going to be an array of objects.
// each object represents a body part.
//each object will have a x and y coordinate.
// el primer objeto es la cabeza, luego el cuerpo y el ûltimo es la cola de la serpiente
let snake = [
    {x:unitSize * 4, y:0}, // head
    {x:unitSize * 3, y:0}, // body
    {x:unitSize * 2, y:0}, // body
    {x:unitSize, y:0}, //body
    {x:0, y:0},    // the tail. Begins in the top left corner
];

//vamos a agregar Listeners para ejecutar una acciôn al momento de escuchar
// el evento determinado (entre parêntesis)
// en este caso es la flecha para abajo, que escuche cuando se oprima le tecla hacia
// abajo y que ejecute la acciôn (funciôn) que se le pone al lado
window.addEventListener("keydown", changeDirection);

// agregamos un Listener yuna acciôn al botôn de reset
resetButton.addEventListener("click", resetGame);

//invocamos la funciôn que incia el juego
gameStart();

//llegô el momento de declarar y definir las funciones que necesitaremos
function gameStart() {
    running = true; // our game is currently running
    scoreText.textContent = score;
    createFood();
    drawFood();
    nextTick();
};

// this is what we want to do every round, es la recursiva que hace que haya loop tars loop
//y llama a todas las funciones
function nextTick() {
    // we are going to check if our game is currently running
    if (running) {
        setTimeout(()=>{
            clearBoard();
            drawFood();
            moveSnake();
            drawSnake();
            checkGameOver();
            nextTick();
        }, 75) // decrease fot faster speed
    } else { // si el juego no estâ corriendo entonces ya terminô
        displayGameOver();
    }
};

// To repaint the board
function clearBoard() {
    // para volver a poner la pantalla como al inicio
    ctx.fillStyle = boardBackground; // color we picked
    ctx.fillRect(0, 0, gameWidth, gameHeight); // we start left top corner (0,0) we end on the opposite corner with the values bien the max (the size)
};

// Funciôn that will find a random place in the board to place the food item
function createFood() {

    function randomFood(min, max) {
        // Math.round es para redondear
        // para crear un numero aleatorio, el mâximo es width 500...    
        // luego los 500 van divididos entre 25 = nos da 25 casillas de 0 al 24, en el tablero, eje X o Y
        // pero para poder situar la comida bien, vamos a multiplicar por 25 (queremos mûltiplos de 25)
        // (cada casilla tiene 25 de ancho). Ahora los nûmeros random son 0,25, 50, 75, 100, 125, etc.
        const randomNumber = Math.round((Math.random() * (max - min) + min) / unitSize) * unitSize;
        return randomNumber;
    }

    // en el eje X (horizontal) hay 25 casillas
    foodX = randomFood(0, gameWidth - unitSize);
    // en el eje Y (vertical) tambiên hay 25 casillas
    foodY = randomFood(0, gameHeight - unitSize);

};

// to paint the food that will appear in the gameboard
function drawFood() {
    ctx.fillStyle = foodColor;
    ctx.fillRect(foodX, foodY, unitSize, unitSize);
    // la comida tiene una ubicaciôn X/Y en el plano, y luego las medidas de longitud y anchura
};

// para mover la serpiente. Es el primer elemento del array que se desaparece y se anade uno mas al final
function moveSnake() {
    //definiendo el que se va a eliminar
    const head = {x: snake[0].x + xVelocity, 
                  y: snake[0].y + yVelocity};
    snake.unshift(head);
    // hasta aquî la serpiente crece hacia la derecha pero no se elimina nada de la izq, sôlo
    // parece que crece. Es momento de eliminar al de atrâs para que parezca que va avanzando
    
    // vamos a revisar si la serpiente se comio la comidita o no, si sî pues va a crecer
    if (snake[0].x === foodX && snake[0].y === foodY) {
        score += 1; // score++ ???
        scoreText.textContent = score;
        createFood();
    } else {
        snake.pop(); // quitar el ûltimo
    }
};

// para pintar la serpiente en el tablero
function drawSnake() {
    ctx.fillStyle = snakeColor; // color de la serpiente
    ctx.strokeStyle = snakeBorder; // para el borde
    // para el cuerpo, usamos el array que declaramos antes y le pasamos un forEach
    snake.forEach(snakePart => {
        // el cuerpo de la serpiente tiene coordenadas X y Y del plano, y luego la longitud/anchura
        ctx.fillRect(snakePart.x, snakePart.y, unitSize, unitSize); // si modifico unitSize * 4 se cambia el tamano de la serpiente
        ctx.strokeRect(snakePart.x, snakePart.y, unitSize, unitSize);
    });
};

// para darle dirección a la culebra. Allá hasta arriba le dijimos a la computadora que esté
// en alerta, que esté escuchando siempre un evento: Keydown (presionar una tecla)
// esta función necesita un evento
function changeDirection(event) {
    // .keyCode  es una funciôn que te da la tecla presionada
    const keyPressed = event.keyCode;
    // las teclas (del teclado) ya tienen un nûmero asignado, por ejemplo: 37 es flecha izquierda
    //entonces lo que vamos a hacer es que vamos a loguear las 4 teclas de flechas para saber
    // quê nûmero tienen cada una de ellas y luego poderles asignar una consecuencia
    // console.log(keyPressed); // revisamos el explorador F12
    const LEFT = 37;
    const UP = 38;
    const RIGHT = 39;
    const DOWN = 40;
    // para determinar hacia dônde va la serpiente. Todos en boolean
    const goingUP = (yVelocity === -unitSize);
    const goingDOWN = (yVelocity === unitSize);
    const goingRIGHT = (xVelocity === unitSize);
    const goingLEFT = (xVelocity === -unitSize);

    // if we,re going left, then we can continue to the left or up and down, but not right.
    // para darle finalmente el cambio de direcciôn a la serpiente y asegurarnos de que 
    // no pueda regresar sobre su eje e ir hacia el otro sentido
    switch(true) {
        case(keyPressed === LEFT && !goingRIGHT):
            xVelocity = -unitSize;
            yVelocity = 0;
            break;
        case(keyPressed === UP && !goingDOWN):
            xVelocity = 0;
            yVelocity = -unitSize;
            break;
        case(keyPressed === RIGHT && !goingLEFT):
            xVelocity = unitSize;
            yVelocity = 0;
            break;
        case(keyPressed === DOWN && !goingUP):
            xVelocity = 0;
            yVelocity = unitSize;
            break;
    }

};

// para terminar el juego
function checkGameOver() {

    // para que la serpiente no pueda salir del borde del tablero
    switch(true) {
        // si la cabeza de la serpiente en x es menor a 0, se termina el juego porque
        // quiere decir que la serpiente sobrepasô el borde izquierdo. el derecho es
        // gamewidth
        case (snake[0].x < 0):
            running = false;
            break;
        case (snake[0].x >= gameWidth):
            running = false;
            break;
        case (snake[0].y < 0):
            running = false;
            break;
        case (snake[0].y >= gameHeight):
            running = false;
            break;
    }

    // para evitar que la serpiente pueda tocarse asî misma 
    // un loop que NO empieza con la cabeza de la serpiente
    // si cualquier parte de la serpiente que no sea la cabeza, estâ en las coordenadas
    // X y Y de la cabeza (o sea si la cabeza es igual a cualquier parte de su cuerpo)
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            running = false; // se acaba el juego
        }
        
    }
};

function displayGameOver() {
    ctx.font = "50px sans-serif";
    ctx.fillStyle = "purple";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER!", gameWidth / 2, gameHeight / 2);
    running = false;
};

function resetGame() {
    // reseteamos todo a su valor inicial
    score = 0;
    xVelocity = unitSize;
    yVelocity = 0;

    snake = [
        {x:unitSize * 4, y:0}, // head
        {x:unitSize * 3, y:0}, // body
        {x:unitSize * 2, y:0}, // body
        {x:unitSize, y:0}, //body
        {x:0, y:0},    // the tail. Begins in the top left corner
    ];

    gameStart();
};








