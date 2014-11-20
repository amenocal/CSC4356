/*Interaction */
var modelRotationX = 0;
var modelRotationY = 0;
var modelTranslationZ = 3;
var dragging = false;
var lastClientX;
var lastClientY;

var projectionMatrixLocation;
var modelMatrixLocation;
var lightDirectionLocation;
var lightColorLocation;
var objectColorLocation;
var vertexPositionLocation;
var vertexNormalLocation;

var positionArray;
var normalArray;
var triangleArray;

var projectionMatrix;
var modelMatrix;

function onmousedown(event) {
    dragging = true;
    lastClientX = event.clientX;
    lastClientY = event.clientY;
}

function onmouseup(event) {
    dragging = false;
}

function onmousemove(event) {
    if (dragging) {
        modelRotationY = modelRotationY + event.clientX - lastClientX;
        modelRotationX = modelRotationX + event.clientY - lastClientY;


        if (modelRotationX > 90.0) {
            modelRotationX = 90.0;
        }
        if (modelRotationY < -90.0) {
            modelRotationX = -90.0;
        }

        requestAnimationFrame(draw);
    }

    lastClientX = event.clientX;
    lastClientY = event.clientY;
}

/*Interaction*/

/*Initialization*/
var canvas;
var gl;

/*Vector Operators*/
function addition(a, b) {
    return [a[0] + b[0],
        a[1] + b[1],
        a[2] + b[2]
    ];
}

function subtract(a, b) {
    return [a[0] - b[0],
        a[1] - b[1],
        a[2] - b[2]
    ];
}

function dot(a, b) {
    return a[0] * b[0] +
        a[1] * b[1] +
        a[2] * b[2]
}

function cross(a, b) {
    return [a[1] * b[2] - a[2] * b[1],
        a[2] * b[0] - a[0] * b[2],
        a[0] * b[1] - a[1] * b[0]
    ];
}

function normalize(a) {
        var len = Math.sqrt(dot(a, a));

        return [a[0] / len,
            a[1] / len,
            a[2] / len
        ];
    }
/*Vector Operators*/

function flatten(a) {
    return a.reduce(function(b, v) {
        b.push.apply(b, v);
        return b
    }, [])
}

function init() {
        canvas = document.getElementById('webgl');
        canvas.onmousemove = onmousemove;
        canvas.onmouseup = onmouseup;
        canvas.onmousedown = onmousedown;
        gl = getWebGLContext(canvas, false);

        /*Normal Calculation*/
        var normals = new Array();
        var n = [0, 0, 0]
        var i0, i1, i2;

        for (i = 0; i < vertices.length; i++) {
            normals.push(n);
        }

        for (i = 0; i < triangles.length; i++) {
            i0 = triangles[i][0];
            i1 = triangles[i][1];
            i2 = triangles[i][2];
            a = normalize(subtract(vertices[i1], vertices[i0]));
            b = normalize(subtract(vertices[i2], vertices[i0]));

            n = normalize(cross(a, b));

            normals[i0] = addition(normals[i0], n);
            normals[i1] = addition(normals[i1], n);
            normals[i2] = addition(normals[i2], n);
        }

        for (i = 0; i < normals.length; i++) {
            normals[i] = normalize(normals[i]);
        }
        /*Normal Calculation*/

        /*Shader Initialization*/
        initShaders(gl, document.getElementById("vertexShader").text, document.getElementById("fragmentShader").text);

        projectionMatrixLocation = gl.getUniformLocation(gl.program, "projectionMatrix");
        modelMatrixLocation = gl.getUniformLocation(gl.program, "modelMatrix");
        lightDirectionLocation = gl.getUniformLocation(gl.program, "lightDirection");
        lightColorLocation = gl.getUniformLocation(gl.program, "lightColor");
        objectColorLocation = gl.getUniformLocation(gl.program, "objectColor");
        /*Shader Initialization*/

        /*Buffer Initialization*/
        vertexPositionLocation = gl.getAttribLocation(gl.program, "vertexPosition");
        vertexNormalLocation = gl.getAttribLocation(gl.program, "vertexNormal");

        gl.enableVertexAttribArray(vertexPositionLocation);
        gl.enableVertexAttribArray(vertexNormalLocation);

        positionArray = new Float32Array(flatten(vertices));
        normalArray = new Float32Array(flatten(normals));
        triangleArray = new Uint16Array(flatten(triangles));

        positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, positionArray, gl.STATIC_DRAW);

        normalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, normalArray, gl.STATIC_DRAW);

        triangleBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, triangleBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, triangleArray, gl.STATIC_DRAW);
        /*Buffer Initialization*/
        gl.clearColor(0.54, 0.28, 0.62, 1.0);

        requestAnimationFrame(draw);
    }
/*Initialization*/
/*Translation down Z*/
function transZ() {

	modelTranslationZ = parseFloat(document.getElementById("zinput").value);

    document.getElementById("zoutput").innerHTML = modelTranslationZ;

    requestAnimationFrame(draw);
}
/*Translation down Z*/
/*Rendering*/
function draw() {
    projectionMatrix = new Matrix4();
    modelMatrix = new Matrix4();

    projectionMatrix.setPerspective(45, 1, 1, 10);
    modelMatrix.setTranslate(0, 0, -modelTranslationZ);
    modelMatrix.rotate(modelRotationX, 1, 0, 0);
    modelMatrix.rotate(modelRotationY, 0, 1, 0);

    gl.uniformMatrix4fv(projectionMatrixLocation, false, projectionMatrix.elements);
    gl.uniformMatrix4fv(modelMatrixLocation, false, modelMatrix.elements);

    gl.uniform3f(lightDirectionLocation, 0.0, 1.0, 1.0);
    gl.uniform3f(lightColorLocation, 1.0, 1.0, 1.0);
    gl.uniform3f(objectColorLocation, 0.8, 0.8, 0.8);

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(vertexPositionLocation, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer)
    gl.vertexAttribPointer(vertexNormalLocation, 3, gl.FLOAT, false, 0, 0);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.enable(gl.DEPTH_TEST);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, triangleBuffer)

    gl.drawElements(gl.TRIANGLES, triangleArray.length, gl.UNSIGNED_SHORT, 0);
}
/*Rendering*/