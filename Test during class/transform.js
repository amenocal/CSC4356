var vertices = new Float32Array([
    0.0, 1.0, 0.5, -0.5, 0.5, 0.5, -0.5, 0.0, 0.5,
    0.5, 0.0, 0.5,
    0.5, 0.5, 0.5,
    0.0, 1.0, -0.5, -0.5, 0.5, -0.5, -0.5, 0.0, -0.5,
    0.5, 0.0, -0.5,
    0.5, 0.5, -0.5,
]);

var points = new Uint16Array([
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9
]);

var lines = new Uint16Array([
    0, 1,
    1, 2,
    2, 3,
    3, 4,
    4, 0,
    5, 6,
    6, 7,
    7, 8,
    8, 9,
    9, 5,
    0, 5,
    1, 6,
    2, 7,
    3, 8,
    4, 9,
]);

//------------------------------------------------------------------------------

var vertex_shader_source =
    'attribute vec4 vPosition;\n' +
    'uniform mat4 Projection;\n' +
    'uniform   mat4 Model;\n' +
    'void main() {\n' +
    '    gl_Position  = Projection * Model * vPosition;\n' +
    '    gl_PointSize = 8.0;\n' +
    '}\n';

var fragment_shader_source =
    'varying mediump vec3 fColor;\n' +
    'void main() {\n' +
    '    gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);\n' +
    '}\n';

//------------------------------------------------------------------------------

var canvas;
var gl;

var vertexBuffer;
var pointBuffer;
var lineBuffer;

function init() {
    // Initialize the WebGL context.

    canvas = document.getElementById('webgl');
    gl = getWebGLContext(canvas, false);

    // Initialize the program object and its uniforms.

    initShaders(gl, vertex_shader_source, fragment_shader_source);

    // Initialize vertex and index buffer objects.

    vertexBuffer = gl.createBuffer();
    pointBuffer = gl.createBuffer();
    lineBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, lineBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, lines, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, pointBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, points, gl.STATIC_DRAW);

    // Link the shader attributes to the vertex buffer object.

    var vPositionLocation = gl.getAttribLocation(gl.program, 'vPosition');

    gl.vertexAttribPointer(vPositionLocation, 3, gl.FLOAT, false, 0, 0);

    gl.enableVertexAttribArray(vPositionLocation);

    // Set up to render.

    gl.clearColor(1.0, 1.0, 0.8, 1.0);
    gl.enable(gl.DEPTH_TEST);

    draw();
}

function draw() {

    // Handle the GUI.

    var y = parseFloat(document.getElementById("yinput").value);
    var z = parseFloat(document.getElementById("zinput").value);
    var f = parseFloat(document.getElementById("finput").value);

    document.getElementById("youtput").innerHTML = y;
    document.getElementById("zoutput").innerHTML = z;
    document.getElementById("foutput").innerHTML = f;

    // Compute the transform.

    var ProjectionLocation = gl.getUniformLocation(gl.program, 'Projection');
    var Projection = new Matrix4();
    Projection.setPerspective(f, 1, 1, 10);
    gl.uniformMatrix4fv(ProjectionLocation, false, Projection.elements);

    var ModelLocation = gl.getUniformLocation(gl.program, 'Model');
    var Model = new Matrix4();
    Model.setTranslate(0, 0, -z);
    Model.rotate(y, 0, 1, 0);

    gl.uniformMatrix4fv(ModelLocation, false, Model.elements);

    // Clear the screen.

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Draw the points.

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, pointBuffer);
    gl.drawElements(gl.POINTS, points.length, gl.UNSIGNED_SHORT, 0);

    // Draw the lines.

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, lineBuffer);
    gl.drawElements(gl.LINES, lines.length, gl.UNSIGNED_SHORT, 0);
}


//------------------------------------------------------------------------------