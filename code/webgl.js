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

function main() {
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

    // Write the positions of vertices to a vertex shader
    var n = initVertexBuffers(gl);
    if (n < 0) {
        console.log('Failed to set the positions of the vertices');
        return;
    }
    
    // Get the storage location of a_Position
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return;
    }

    // Get the number of sides (n) that was entered by the user.
    var numSides = document.getElementById('numSides').value;
    var endCaps = document.getElementById('endcapsTF').checked;
   
    if (!endCaps){
        console.log("Not clicked");
    }
            
    // Register function (event handler) to be called on a mouse press
    canvas.onmousedown = function(ev){ click(ev, gl, canvas, a_Position); };

    // red green blue alpha
    gl.clearColor(0.5, 0.5, 0.5, 0.65);

    // clears the drawing area with the specified clear color
    // gl.COLOR_BUFFER_BIT Specifies the color buffer.
    // gl.DEPTH_BUFFER_BIT Specifies the depth buffer.
    // gl.STENCIL_BUFFER_BIT Specifies the stencil buffer.  
    gl.clear(gl.COLOR_BUFFER_BIT);

     // Draw a point
    gl.drawArrays(gl.LINES, 0, n);
}



function initVertexBuffers(gl) {
    var vertices = new Float32Array([
        0, .97,   0, -0.97, .97, 0,  -.97, 0
    ]);
    var n = 5; // The number of vertices
  
    var xAxis = new Float32Array([
        0, .97,   0, -0.97,   0.0, 0.0
      ]);
    // Create a buffer object
    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
      console.log('Failed to create the buffer object');
      return -1;
    }
  
  　// Bind the buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  　// Write date into the buffer object
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
      console.log('Failed to get the storage location of a_Position');
      return -1;
    }
    // Assign the buffer object to a_Position variable
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
  
    // Enable the assignment to a_Position variable
    gl.enableVertexAttribArray(a_Position);
  
    return n;
  }
