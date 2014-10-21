//HelloTriangle.js
//Vertex shader program
var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'uniform mediump mat4 M;\n' +
    'void main() {\n' +
    '  gl_Position = M * a_Position;\n' +
    '}\n';

//Fragment shader program
var FSHADER_SOURCE =
    'uniform mediump vec3 Color;\n' +
    'void main() {\n' +
    '  gl_FragColor = vec4(Color, 1.0);\n' +
    '}\n';

var gl;
var n;

function main() {

    var canvas = document.getElementById('webgl');
    // Get the rendering context for WebGL
    gl = getWebGLContext(canvas, false);

    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }

    //Initiate shaders
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to initialize shaders.');
        return;

    }

    //Set the positions of vertices
    var n = initVertexBuffers(gl);
    if (n < 0) {
        console.log('Failed to set the positions of the vertices');
        return;
    }
    draw();
}

function draw() {

    var r = parseFloat(document.getElementById("rinput").value);
    var g = parseFloat(document.getElementById("ginput").value);
    var b = parseFloat(document.getElementById("binput").value);
    var z = parseFloat(document.getElementById("zinput").value);

    document.getElementById("routput").innerHTML = r;
    document.getElementById("goutput").innerHTML = g;
    document.getElementById("boutput").innerHTML = b;
    document.getElementById("zoutput").innerHTML = z;

    if (document.getElementById("background").checked) {
        gl.clearColor(1, 1, 0, 0.1);
    } else {
        //Set the color for clearing <canvas>
        gl.clearColor(0.0, 0.5, 0.0, 1.0);
    }

    var ColorLocation = gl.getUniformLocation(gl.program, 'Color');
    gl.uniform3f(ColorLocation, r, g, b);

    var MLocation = gl.getUniformLocation(gl.program, 'M');
    var M = new Matrix4();
    M.setRotate(z,0,0,1);
    gl.uniformMatrix4fv(MLocation, false, M.elements);

    //Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);
    //Draw a triangle
    gl.drawArrays(gl.TRIANGLES, 0, n);
}

function initVertexBuffers(gl) {
    var vertices = new Float32Array([
        0.0, 0.433, -0.25, 0.0,
        0.25, 0.0, -0.25, 0.0, -0.5, -0.433,
        0.0, -0.433,
        0.25, 0.0,
        0.0, -0.433,
        0.5, -0.433

    ]);
    n = 9; //The number of vertices

    //Create buffer object
    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.log('Failed to create the buffer object');
        return -1;
    }

    // Bind the buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    //Write date into the buffer object
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return -1;
    }

    //Assign the buffer object to a_Position variable
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

    //Enable the assignment to a_Position variable
    gl.enableVertexAttribArray(a_Position);

    return n;
}