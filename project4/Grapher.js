//Grapher.js (Project4)
//Vertex shader program
var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'varying mediump vec4 v_Color;\n' +
    'void main() {\n' +
    '   v_Color = (a_Position + 1.0) / 2.0;\n' +
    '   gl_Position = a_Position;\n' +
    '}\n';

//Fragment shader program
var FSHADER_SOURCE =
    'varying mediump vec4 v_Color;\n' +
    'void main() {\n' +
    '  gl_FragColor = v_Color;\n' +
    '}\n';

var triangles;
var vertices;
var gl;
var n;

function main() {

    var canvas = document.getElementById('webgl');

    // Get the rendering context for WebGL
    gl = getWebGLContext(canvas);

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
    n = initVertexBuffers(gl);
    if (n < 0) {
        console.log('Failed to set the positions of the vertices');
        return;
    }

    //Set the color for clearing <canvas>
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    //Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.enable(gl.DEPTH_TEST);

    //Draw a triangle
    gl.drawArrays(gl.triangles, 0, n);

    gl.drawElements(gl.TRIANGLES, triangles.length, gl.UNSIGNED_SHORT, 0);

}

function initVertexBuffers(gl) {

    var i0, i1, i2, i3, i4, i5, r, c, x, y, z;
    var verarray = new Array();
    var triarray = new Array();

    n = 16;

    //Adding vertices [x,y,z] at row r, column c
    for (r = 0; r < n; r++) {
        for (c = 0; c < n; c++) {
            x = 2 * (c / (n - 1)) - 1;
            z = 2 * (r / (n - 1)) - 1;
            y = 1 - Math.pow(x, 2) - Math.pow(z, 2);

            verarray.push(x, y, z);
        }
    }
    //Adding indeces [i0,i1,i2] and [i3,i4,i5] at row r, column c
    for (r = 0; r < n - 1; r++) {
        for (c = 0; c < n - 1; c++) {
            i0 = (r + 0) * n + (c + 0);
            i1 = (r + 1) * n + (c + 0);
            i2 = (r + 0) * n + (c + 1);
            i3 = (r + 0) * n + (c + 1);
            i4 = (r + 1) * n + (c + 0);
            i5 = (r + 1) * n + (c + 1);

            triarray.push(i0, i1, i2);
            triarray.push(i3, i4, i5);
        }
    }

    vertices = new Float32Array(
        verarray
    );

    triangles = new Uint16Array(
        triarray
    );

    //Create buffer object
    var vertexBuffer = gl.createBuffer();
    var triangleBuffer = gl.createBuffer();

    if (!vertexBuffer) {
        console.log('Failed to create the buffer object');
        return -1;
    }

    if (!triangleBuffer) {
        console.log('Failed to create the buffer triangle object');
        return -1;
    }

    // Bind the buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    //Write date into the buffer object
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, triangleBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, triangles, gl.STATIC_DRAW, 0);

    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');

    //Assign the buffer object to a_Position variable
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);

    //Enable the assignment to a_Position variable
    gl.enableVertexAttribArray(a_Position);

    return n;
}
