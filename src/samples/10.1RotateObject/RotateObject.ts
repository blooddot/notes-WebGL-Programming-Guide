/**
 * @author hong.guo
 * @description 
 */
import { Matrix4 } from "../../../libs/cuon/cuon-matrix.js";
import { initWebGL } from "../../utils/util.js";

window.onload = async function () {
    const { gl, program, canvas } = await initWebGL("RotateObject");

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    const n = initVertexBuffers(gl, program);

    const u_MvpMatrix = gl.getUniformLocation(program, 'u_MvpMatrix');

    // Register the event handler
    const currentAngle = [0.0, 0.0]; // Current rotation angle ([x-axis, y-axis] degrees)
    initEventHandlers(canvas, currentAngle);

    initTextures(gl, program);


    // Calculate the view projection matrix
    const viewProjMatrix = new Matrix4();
    viewProjMatrix.setPerspective(30.0, canvas.width / canvas.height, 1.0, 100.0);
    viewProjMatrix.lookAt(3.0, 3.0, 7.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0);
    const tick = function () {   // Start drawing
        draw(gl, n, viewProjMatrix, u_MvpMatrix, currentAngle);
        requestAnimationFrame(tick);
    };
    tick();
};


function initEventHandlers(canvas: HTMLCanvasElement, currentAngle: number[]) {
    let dragging = false;         // Dragging or not
    let lastX = -1, lastY = -1;   // Last position of the mouse

    canvas.onmousedown = function (ev: MouseEvent) {   // Mouse is pressed
        const x = ev.clientX; const y = ev.clientY;
        // Start dragging if a moue is in <canvas>
        const rect = (ev.target as HTMLElement).getBoundingClientRect();
        if (rect.left <= x && x < rect.right && rect.top <= y && y < rect.bottom) {
            lastX = x; lastY = y;
            dragging = true;
        }
    };

    canvas.onmouseup = function (ev: MouseEvent) { dragging = false; }; // Mouse is released

    canvas.onmousemove = function (ev: MouseEvent) { // Mouse is moved
        const x = ev.clientX; const y = ev.clientY;
        if (dragging) {
            const factor = 100 / canvas.height; // The rotation ratio
            const dx = factor * (x - lastX);
            const dy = factor * (y - lastY);
            // Limit x-axis rotation angle to -90 to 90 degrees
            currentAngle[0] = Math.max(Math.min(currentAngle[0] + dy, 90.0), -90.0);
            currentAngle[1] = currentAngle[1] + dx;
        }
        lastX = x;
        lastY = y;
    };
}

const g_MvpMatrix = new Matrix4(); // Model view projection matrix
function draw(gl: WebGLRenderingContext, n: number, viewProjMatrix: Matrix4, u_MvpMatrix: WebGLUniformLocation, currentAngle: number[]) {
    // Calculate The model view projection matrix and pass it to u_MvpMatrix
    g_MvpMatrix.set(viewProjMatrix);
    g_MvpMatrix.rotate(currentAngle[0], 1.0, 0.0, 0.0); // Rotation around x-axis
    g_MvpMatrix.rotate(currentAngle[1], 0.0, 1.0, 0.0); // Rotation around y-axis
    gl.uniformMatrix4fv(u_MvpMatrix, false, g_MvpMatrix.elements);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);     // Clear buffers
    gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);   // Draw the cube
}

function initVertexBuffers(gl: WebGLRenderingContext, program: WebGLProgram) {
    // Create a cube
    //    v6----- v5
    //   /|      /|
    //  v1------v0|
    //  | |     | |
    //  | |v7---|-|v4
    //  |/      |/
    //  v2------v3
    //顶点坐标
    const vertices = new Float32Array([   // Vertex coordinates
        1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0,    // v0-v1-v2-v3 front
        1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0,    // v0-v3-v4-v5 right
        1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0,    // v0-v5-v6-v1 up
        -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0,    // v1-v6-v7-v2 left
        -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0,    // v7-v4-v3-v2 down
        1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0     // v4-v7-v6-v5 back
    ]);

    const texCoords = new Float32Array([   // Texture coordinates
        1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,    // v0-v1-v2-v3 front
        0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0,    // v0-v3-v4-v5 right
        1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0,    // v0-v5-v6-v1 up
        1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,    // v1-v6-v7-v2 left
        0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,    // v7-v4-v3-v2 down
        0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0     // v4-v7-v6-v5 back
    ]);

    //顶点索引
    const indices = new Uint8Array([  //(Uint8Array)是无符号8位整型数
        0, 1, 2, 0, 2, 3,    // front
        4, 5, 6, 4, 6, 7,    // right
        8, 9, 10, 8, 10, 11,    // up
        12, 13, 14, 12, 14, 15,    // left
        16, 17, 18, 16, 18, 19,    // down
        20, 21, 22, 20, 22, 23     // back
    ]);

    initArrayBuffer(gl, program, vertices, 3, gl.FLOAT, 'a_Position');
    initArrayBuffer(gl, program, texCoords, 2, gl.FLOAT, 'a_TexCoord');

    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    return indices.length;
}

function initArrayBuffer(gl: WebGLRenderingContext, program: WebGLProgram, data: Float32Array, size: number, type: number, attribute: string) {
    // Create a buffer object
    const buffer = gl.createBuffer();
    // Write date into the buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    // Assign the buffer object to the attribute variable
    const a_attribute = gl.getAttribLocation(program, attribute);
    gl.vertexAttribPointer(a_attribute, size, type, false, 0, 0);
    // Enable the assignment to a_attribute variable
    gl.enableVertexAttribArray(a_attribute);
}

function initTextures(gl: WebGLRenderingContext, program: WebGLProgram) {
    // Create a texture object
    const texture = gl.createTexture();

    // Get the storage location of u_Sampler
    const u_Sampler = gl.getUniformLocation(program, 'u_Sampler');

    // Create the image object
    const image = new Image();
    // Register the event handler to be called when image loading is completed
    image.onload = function () { loadTexture(gl, texture, u_Sampler, image); };
    // Tell the browser to load an Image
    image.src = '../../../resources/sky.jpg';
}

function loadTexture(gl: WebGLRenderingContext, texture: WebGLTexture, u_Sampler: WebGLUniformLocation, image: HTMLImageElement) {
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);  // Flip the image Y coordinate
    // Activate texture unit0
    gl.activeTexture(gl.TEXTURE0);
    // Bind the texture object to the target
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Set texture parameters
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    // Set the image to texture
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

    // Pass the texture unit 0 to u_Sampler
    gl.uniform1i(u_Sampler, 0);
}