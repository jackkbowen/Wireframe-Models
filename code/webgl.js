// Vertex shader program
// Responsible for the position and size
// vec4 Indicates a vector of four floating point numbers 
var VSHADER_SOURCE = 
    'attribute vec4 a_Position;\n' +
    'void main() {\n' +
    '  gl_Position = a_Position;\n' + // Set the vertex coordinates of the point
    '  gl_PointSize = 5.0;\n' +                    // Set the point size
    '}\n';

// Fragment shader program
// Responsible for the color of the drawing
var FSHADER_SOURCE =
    'void main() {\n' +
    '  gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);\n' + // Set the point color
    '}\n';

// The array for the position of a mouse press
var g_points = []; 

// Get a reference to the canvas element
const background = document.getElementById("background");

// Initialize the 2d context
const contextBG = background.getContext("2d");

// Set default values to check if its the first click
let prevX = -1;
let prevY = -1;
let numDots = -1;

// For saving the history of the coordinates to output once right click is pressed
const historyX = [];
const historyY = [];



function main() {
  initBackground();
  
  // Get a reference to the canvas element
  var canvas = document.getElementById('myCanvas');
  //Set the position of the top left of the canvas to be 0,0
  canvasLeft = 8;
  canvasTop = 45


  // Get the rendering context for WebGL
  var gl = getWebGLContext(canvas);

  // getWebGLContext returns null if not available
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // Get the storage location of a_Position
  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }    

  // Adds a dot at every click
  background.addEventListener('click', addDot);

  // Draws a line betwen the click and the previous click
  // Does not draw a line if it is the first click
  background.addEventListener('click', addLine);

    
  // Right click handling
  // Disables the default context menu options
  // Completes the line from the previous click to the right click
  background.addEventListener('contextmenu', endLine);

}

function initBackground() {
  // Grey Background
  contextBG.fillStyle = "#cfcdcd";
  contextBG.fillRect(0, 0, 500, 500);

  // Green Y Axis
  contextBG.fillStyle = "#257724";
  contextBG.fillRect(249,5,2,480);

  // Red X Axis
  contextBG.fillStyle = "#FF0000";
  contextBG.fillRect(5,249,490,2);
}


function addDot(event) {
    // Mouse Position 
    let x = event.clientX - canvasLeft;
    let y = event.clientY - canvasTop;
    
    
    contextBG.beginPath();
    contextBG.arc(x, y, 1, 0, 2*Math.PI);
    contextBG.stroke();
    numDots = numDots + 1;
}

function addLine(event) {
    // Mouse Position 
    let x = event.clientX - canvasLeft;
    let y = event.clientY - canvasTop; 
    
    // Checks for default values
    // Sets initial position equal to the previous click
    if (prevX != -1 || prevY != -1) {
      contextBG.moveTo(prevX, prevY); 
    }
    //console.log(numDots, x, y);

    // Sets initial position equal to the previous click
    prevX = event.clientX - canvasLeft;
    prevY = event.clientY - canvasTop;
    historyX[numDots] = (prevX/500) * 2 - 1;
    historyY[numDots] = -1 *((prevY/500) * 2 - 1);

    // Connects origin to latest click
    contextBG.lineTo(x, y);
    contextBG.stroke();
}

function endLine(event) {
    event.preventDefault();
    //console.log(prevX, prevY);

    // Checks to see if the right click is the first click on the canvas
    // Proceeds if it is not, does nothing if it is
    while (prevX != -1 || prevY != -1) {
        let x = event.clientX - canvasLeft;
        let y = event.clientY - canvasTop; 
        numDots = numDots + 1;
        historyX[numDots] = (x/500) * 2 - 1;
        historyY[numDots] = -1 *((y/500) * 2 - 1);

        contextBG.beginPath();
        contextBG.arc(x, y, 1, 0, 2*Math.PI);
        contextBG.stroke();
        
        contextBG.moveTo(prevX, prevY);
        contextBG.lineTo(x, y);
        contextBG.stroke();
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