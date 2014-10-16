//HelloTriangle.js
//Vertex shader program
var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'varying mediump vec4 v_Color;\n' +
    'void main() {\n' +
    '	v_Color = (a_Position + 1.0) / 2.0;\n' +
    '  gl_Position = a_Position;\n' +
    '}\n';

//Fragment shader program
var FSHADER_SOURCE =
    'varying mediump vec4 v_Color;\n' +
    'void main() {\n' +
    '  gl_FragColor = v_Color;\n' +
    '}\n';

function main() {

    var canvas = document.getElementById('webgl');
    // Get the rendering context for WebGL
    var gl = getWebGLContext(canvas, false);

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

    //Set the color for clearing <canvas>
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    //Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);
    //Draw a triangle
    gl.drawArrays(gl.TRIANGLES, 0, n);

    gl.enable(gl.DEPTH_TEST);
}

function initVertexBuffers(gl) {

    var i, r, c, x, y, z,k;
    var verarray = new Array();
    var triarray = new Array();

    var n = 4;
    k=0;
    for (r = 0; r <= n; r++) {
        for (c = 0; c <= n; c++) {
            x = 2 * (c / (n - 1)) - 1;
            z = 2 * (r / (n - 1)) - 1;
            y = 1 - x*x - z*z;
            console.log("x=" + x + " y=" + y + " z=" + z);

            verarray[k] = x;
            //console.log(k)
            k++;
            verarray[k] = z;
            console.log(k)
            k++;
            verarray[k] = y;
            console.log(k);
            //console.log("array[" + k + "] = " + verarray[k]);
            k++;

            //console.log("array[" + i + "] = " + verarray[i]);
           //console.log("array" + verarray);
        }
    }

    var j = 0;
    for (j = 0; j <= verarray.length; j++){
        console.log(verarray[j]);
    }
    for (r = 0; r <= n - 1; r++) {
        for (c = 0; c <= n - 1; c++) {
            i = r * n + c;
            //console.log(i + "=" + r + "*" + n + "+" + c);
            //triarray[0] = 0;
            triarray[j] = i;
            //console.log("triarray[" + j + "] = " + triarray[j]);
            j+=3;

        }
    }

    var vertices = new Float32Array(
        verarray
    );
     //The number of vertices

    var triangles = new Uint16Array(
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
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, triangles, gl.STATIC_DRAW);

    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');

    //Assign the buffer object to a_Position variable
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

    //Enable the assignment to a_Position variable
    gl.enableVertexAttribArray(a_Position);

    return n;
}
