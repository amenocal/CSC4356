//Grapher.js (Project4)
//Vertex shader program
var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'uniform mat4 Projection;\n' +
    'uniform mat4 Model;\n' +
    'varying mediump vec4 v_Color;\n' +
    'void main() {\n' +
    '   v_Color = (a_Position + 1.0) / 2.0;\n' +
    '   gl_Position = Projection * Model * a_Position;\n' +
    '}\n';

//Fragment shader program
var FSHADER_SOURCE =
    'varying mediump vec4 v_Color;\n' +
    'void main() {\n' +
    '  gl_FragColor = v_Color;\n' +
    '}\n';

var canvas;
var gl;

var vertexBuffer;
var triangleBuffer;

var triangles;
var vertices;

var rotateY;
var rotateX;

var n;

function init() {

    canvas = document.getElementById('webgl');

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

    createArrays();

    //Set the positions of vertices
    // n = initVertexBuffers(gl);
    // if (n < 0) {
    //     console.log('Failed to set the positions of the vertices');
    //     return;
    // }

    vertexBuffer = gl.createBuffer();
    triangleBuffer = gl.createBuffer();

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

    var a_PositionLocation = gl.getAttribLocation(gl.program, 'a_Position');

    //Assign the buffer object to a_Position variable
    gl.vertexAttribPointer(a_PositionLocation, 3, gl.FLOAT, false, 0, 0);

    //Enable the assignment to a_PositionLocation variable
    gl.enableVertexAttribArray(a_PositionLocation);

    //Set the color for clearing <canvas>
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    //Clear <canvas>

    gl.enable(gl.DEPTH_TEST);

    gl.drawElements(gl.TRIANGLES, triangles.length, gl.UNSIGNED_SHORT, 0);

    rotateX = 0.0;
    rotateY = 0.0;

    draw();

}

function move(event){
    if (event.which == 1) {
        rotateX = rotateX + event.movementY;
        rotateY = rotateY + event.movementX;

        if (rotateX > 90.0) {
            rotateX = 90.0;
        }

        if (rotateX < 90.0) {
            rotateX = -90.0;
        }

        if (rotateY > 180.0) {
            rotateY -= 360.0;
        }

        if (rotateY < -180.0) {
            rotateY += -360.0;
        }
    }
}

function createArrays() {

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

}

function draw() {

    var z = parseFloat(document.getElementById("zinput").value);
    var f = parseFloat(document.getElementById("finput").value);

    document.getElementById("zoutput").innerHTML = z;
    document.getElementById("foutput").innerHTML = f

    //Computing the transform

    var ProjectLocation = gl.getUniformLocation(gl.program, 'Projection');
    var Projection = new Matrix4();
    Projection.setPerspective(f, 1, 1, 10);
    gl.uniformMatrix4fv(ProjectLocation, false, Projection.elements);


    var ModelLocation = gl.getUniformLocation(gl.program, 'Model');
    var Model = new Matrix4();
    Model.setTranslate(0, 0, -z);
    Model.rotate(rotateX, 1, 0, 0);
    Model.rotate(rotateY, 0, 1, 0);
    gl.uniformMatrix4fv(ModelLocation, false, Model.elements);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


    gl.drawElements(gl.TRIANGLES, triangles.length, gl.UNSIGNED_SHORT, 0);

    requestAnimationFrame(draw);
}