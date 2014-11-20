/*Interaction */
var modelRotationX = 0;
var modelRotationY = 0;
var modelTranslationZ = 0;
var dragging = false;
var lastClientX;
var lastClientY;

function onmousedown(event) {
    dragging = true;
    lastClientX = event.ClientX;
    lastClientY = event.ClientY;
}

function onmouseup(event) {
    dragging = false;
}

function onmousemove(event) {
    if (dragging) {
        modelRotationY = modelRotationY + event.ClientX - lastClientX;
        modelRotationX = modelRotationX + event.ClientY - lastClientY;
    }

    if (modelRotationX > 90.0) {
        modelRotationX = 90.0;
    }
    if (modelRotationY < -90.0) {
        modelRotationX = -90.0;
    }

    requestAnimationFrame(draw);
    lastClientX = event.ClientX;
    lastClientY = event.ClientY;
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
        gl = getWebGLContext(canvas, false);

        /*Normal Calculation*/
        var normals = new Array();
        var n = [0, 0, 0]
        var i0, i1, i2;

        //Check to see if the limit is vertices or vertices.length
        for (i = 0; i < vertices.length; i++) {
            normals.push(n);
        }

        for (i = 0; i < triangles.length; i++){
        	i0 = triangles[i][0];
        	i1 = triangles[i][1];
        	i2 = triangles[i][2];
        }

        for (i = 0; i < triangles.length; i++) {
            a = normalize(vertices[i1] - vertices[i0]);
            b = normalize(vertices[i2] - vertices[i0]);

            n = normalize(cross(a, b));

            normals[i0] = normals[i0] + n;
            normals[i1] = normals[i1] + n;
            normals[i2] = normals[i2] + n;
        }

        for (i = 0; i < normals.length; i++) {
            n = normalize(n);
        }
        /*Normal Calculation*/

        /*Shader Initialization*/
        initShaders(gl, document.getElementById("vertexShader").text, document.getElementById("fragmentShader").text);
        var projectionMatrixLocation = gl.getUniformLocation(gl.program, "projectionMatrix");
        var modelMatrixLocation = gl.getUniformLocation(gl.program, "modelMatrix");
        var lightDirectionLocation = gl.getUniformLocation(gl.program, "lightDirection");
        var lightColorLocation = gl.getUniformLocation(gl.program, "lightColor");
        var objectColorLocation = gl.getUniformLocation(gl.program, "objectColor");
        /*Shader Initialization*/

        /*Buffer Initialization*/
        var vertexPositionLocation = gl.getAttribLocation(gl.program, "vertexPosition");
        var vertexNormalLocation = gl.getAttribLocation(gl.program, "vertexNormal");

        gl.enableVertexAttribArray(vertexPositionLocation);
        gl.enableVertexAttribArray(vertexNormalLocation);

        positionArray = new Float32Array(flatten(vertices));
        normalArray = new Float32Array(flatten(normals));
        triangleArray = new UInt16Array(flatten(triangles));

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
        //gl.clearColor(0.0, 0.0, 0.0, 1.0);

        //gl.enable(gl.DEPTH_TEST);

        requestAnimationFrame(draw);
    }
    /*Initialization*/

/*Rendering*/
function draw() {
    projectionMatrix = perspective(45, 1, 1, 10);
    modelMatrix = dot(translation(0, 0, -modelTranslationZ), dot(rotation(modelRotationX, 1, 0, 0), rotation(modelRotationY, 0, 1, 0)));

    gl.uniformMatrix4(projectionMatrixLocation, false, projectionMatrix);
    gl.uniformMatrix4(modelMatrixLocation, false, modelMatrix);

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