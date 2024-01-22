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

function main() {
    initBackground();
    
    // Get a reference to the canvas element
    var canvas = document.getElementById('myCanvas');

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


    // Register function (event handler) to be called on a mouse press
    canvas.onmousedown = function(ev){ click(ev, gl, canvas, a_Position); };
}


var g_points = []; // The array for the position of a mouse press
function click(ev, gl, canvas, a_Position) {
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect() ;

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);
  // Store the coordinates to g_points array
  g_points.push(x); g_points.push(y);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  var len = g_points.length;
  for(var i = 0; i < len; i += 2) {
    // Pass the position of a point to a_Position variable
    gl.vertexAttrib3f(a_Position, g_points[i], g_points[i+1], 0.0);

    // Draw
    gl.drawArrays(gl.POINTS, 0, 1);
  }
}

function initBackground() {
    // Get a reference to the canvas element

  const canvas = document.getElementById("background");

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
  const context = canvas.getContext("2d");

  // Grey Background
  context.fillStyle = "#cfcdcd";
  context.fillRect(0, 0, 500, 500);

  // Green Y Axis
  context.fillStyle = "#257724";
  context.fillRect(249,5,2,480);

  // Red X Axis
  context.fillStyle = "#FF0000";
  context.fillRect(5,249,490,2);
}
