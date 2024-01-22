// Get a reference to the canvas element

const canvas = document.getElementById("myCanvas");

//Set the position of the top left of the canvas to be 0,0
canvasLeft = canvas.offsetLeft + canvas.clientLeft;
canvasTop = canvas.offsetTop + canvas.clientTop;

// Set default values to check if its the first click
let prevX = -1;
let prevY = -1;
let numDots = -1;

// For saving the history of the coordinates to output once right click is pressed
const historyX = [];
const historyY = [];

// Get a reference to the cursorLocation element
const cursor = document.getElementById("cursorLocation");

// Initialize the 2d context
const context = canvas.getContext("webgl");

// Grey Background
context.fillStyle = "#cfcdcd";
context.fillRect(0, 0, 500, 500);

// Green Y Axis
context.fillStyle = "#257724";
context.fillRect(249,5,2,480);

// Red X Axis
context.fillStyle = "#FF0000";
context.fillRect(5,249,490,2);


// Adds a dot at every click
canvas.addEventListener('click', addDot);

function addDot(event) {
    // Mouse Position 
    let x = event.clientX - canvasLeft;
    let y = event.clientY - canvasTop; 
    
    context.beginPath();
    context.arc(x, y, 1, 0, 2*Math.PI);
    context.stroke();
    numDots = numDots + 1;
}

// Draws a line betwen the click and the previous click
// Does not draw a line if it is the first click
canvas.addEventListener('click', addLine);

function addLine(event) {
    // Mouse Position 
    let x = event.clientX - canvasLeft;
    let y = event.clientY - canvasTop; 
    
    // Checks for default values
    // Sets initial position equal to the previous click
    if (prevX != -1 || prevY != -1) {
        context.moveTo(prevX, prevY); 
    }
    //console.log(numDots, x, y);

    // Sets initial position equal to the previous click
    prevX = event.clientX - canvasLeft;
    prevY = event.clientY - canvasTop;
    historyX[numDots] = prevX;
    historyY[numDots] = prevY;

    // Connects origin to latest click
    context.lineTo(x, y);
    context.stroke();
}

// Right click handling
// Disables the default context menu options
// Completes the line from the previous click to the right click
canvas.addEventListener('contextmenu', endLine);

function endLine(event) {
    event.preventDefault();
    //console.log(prevX, prevY);

    // Checks to see if the right click is the first click on the canvas
    // Proceeds if it is not, does nothing if it is
    while (prevX != -1 || prevY != -1) {
        let x = event.clientX - canvasLeft;
        let y = event.clientY - canvasTop; 
        numDots = numDots + 1;
        historyX[numDots] = x;
        historyY[numDots] = y;

        context.beginPath();
        context.arc(x, y, 1, 0, 2*Math.PI);
        context.stroke();
        
        context.moveTo(prevX, prevY);
        context.lineTo(x, y);
        context.stroke();
        printInfo();
        exit();
    }
}

// Waits until a right click to print the info
// Formatted following the doc??? confusing
function printInfo() {
    console.log("right clicked -- last point");
    for(let i = 0; i <= numDots; i++) {
        console.log(i, historyX[i], historyY[i]);
    }
    numDots = -1;
    prevX = -1;
    prevY = -1;
}

/*
//For making the line follow the mouse movement 
//extra work, not required stated by TA


canvas.addEventListener('mousemove', clickEvent);

function clickEvent(event) {
    let x = event.clientX - canvasLeft;
    let y = event.clientY - canvasTop;  
        
    // Display cursor location
   

   
}

*/