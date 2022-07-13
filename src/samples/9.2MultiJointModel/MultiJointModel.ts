import { Matrix4 } from "../../../libs/cuon/cuon-matrix.js";
import { initWebGL } from "../../utils/util.js";

/**
 * @author 雪糕
 * @description 
 */
window.onload = async function () {
    const { gl, program, canvas } = await initWebGL("MultiJointModel", 0, -50);

    gl.enable(gl.DEPTH_TEST);

    const n = initVertexBuffers(gl, program);

    const viewProjMatrix = new Matrix4();
    viewProjMatrix.setPerspective(50.0, canvas.width / canvas.height, 1.0, 100.0);
    viewProjMatrix.lookAt(20.0, 10.0, 30.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0);

    const u_MvpMatrix = gl.getUniformLocation(program, 'u_MvpMatrix');
    const u_NormalMatrix = gl.getUniformLocation(program, 'u_NormalMatrix');

    // 注册键盘事件响应函数
    document.onkeydown = function (ev) {
        keyDown(ev, gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix);
    };

    draw(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix);
};

function initVertexBuffers(gl: WebGLRenderingContext, program: WebGLProgram) {
    //顶点坐标
    const vertices = new Float32Array([
        0.5, 1.0, 0.5, -0.5, 1.0, 0.5, -0.5, 0.0, 0.5, 0.5, 0.0, 0.5, // v0-v1-v2-v3 front
        0.5, 1.0, 0.5, 0.5, 0.0, 0.5, 0.5, 0.0, -0.5, 0.5, 1.0, -0.5, // v0-v3-v4-v5 right
        0.5, 1.0, 0.5, 0.5, 1.0, -0.5, -0.5, 1.0, -0.5, -0.5, 1.0, 0.5, // v0-v5-v6-v1 up
        -0.5, 1.0, 0.5, -0.5, 1.0, -0.5, -0.5, 0.0, -0.5, -0.5, 0.0, 0.5, // v1-v6-v7-v2 left
        -0.5, 0.0, -0.5, 0.5, 0.0, -0.5, 0.5, 0.0, 0.5, -0.5, 0.0, 0.5, // v7-v4-v3-v2 down
        0.5, 0.0, -0.5, -0.5, 0.0, -0.5, -0.5, 1.0, -0.5, 0.5, 1.0, -0.5  // v4-v7-v6-v5 back
    ]);
    const vertexBuffer = gl.createBuffer();//创建缓冲区对象
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);//将缓冲区对象绑定到目标
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);//向缓冲区对象写入数据
    const a_Position = gl.getAttribLocation(program, 'a_Position');//获取 a_Position 存储地址
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);//将缓冲区对象分配给 a_Position 变量
    gl.enableVertexAttribArray(a_Position);//连接 a_Position 变量与分配给它的缓冲区对象

    //顶点法向量
    const normals = new Float32Array([
        0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, // v0-v1-v2-v3 front
        1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, // v0-v3-v4-v5 right
        0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, // v0-v5-v6-v1 up
        -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, // v1-v6-v7-v2 left
        0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, // v7-v4-v3-v2 down
        0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0  // v4-v7-v6-v5 back
    ]);
    const normalBuffer = gl.createBuffer();//创建缓冲区对象
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);//将缓冲区对象绑定到目标
    gl.bufferData(gl.ARRAY_BUFFER, normals, gl.STATIC_DRAW);//向缓冲区对象写入数据
    const a_Normal = gl.getAttribLocation(program, 'a_Normal');//获取 a_Normal 存储地址
    gl.vertexAttribPointer(a_Normal, 3, gl.FLOAT, false, 0, 0);//将缓冲区对象分配给 a_Normal 变量
    gl.enableVertexAttribArray(a_Normal);//连接 a_Normal 变量与分配给它的缓冲区对象

    //顶点索引
    const indices = new Uint8Array([
        0, 1, 2, 0, 2, 3,    // front
        4, 5, 6, 4, 6, 7,    // right
        8, 9, 10, 8, 10, 11,    // up
        12, 13, 14, 12, 14, 15,    // left
        16, 17, 18, 16, 18, 19,    // down
        20, 21, 22, 20, 22, 23     // back
    ]);
    const indexBuffer = gl.createBuffer();//创建缓冲区对象
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);//将缓冲区对象绑定到目标
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);//向缓冲区对象写入数据

    return indices.length;
}

const ANGLE_STEP = 3.0;    // 每次按键转动的角度
let g_arm1Angle = 90.0; // arm1的当前角度
let g_joint1Angle = 45.0; // joint1的当前角度
let g_joint2Angle = 0.0; // joint2的当前角度
let g_joint3Angle = 0.0; // joint3的当前角度

function keyDown(ev: KeyboardEvent, gl: WebGLRenderingContext, n: number, viewProjMatrix: Matrix4, u_MvpMatrix: WebGLUniformLocation, u_NormalMatrix: WebGLUniformLocation) {
    switch (ev.key) {
        case "ArrowUp":
            if (g_joint1Angle < 135) {
                g_joint1Angle += ANGLE_STEP;
            }
            break;
        case "ArrowDown":
            if (g_joint1Angle > -135) {
                g_joint1Angle -= ANGLE_STEP;
            }
            break;
        case "ArrowLeft":
            g_arm1Angle = (g_arm1Angle - ANGLE_STEP) % 360;
            break;
        case "ArrowRight":
            g_arm1Angle = (g_arm1Angle + ANGLE_STEP) % 360;
            break;
        case "z":
            g_joint2Angle = (g_joint2Angle + ANGLE_STEP) % 360;
            break;
        case "x":
            g_joint2Angle = (g_joint2Angle - ANGLE_STEP) % 360;
            break;
        case "v":
            if (g_joint3Angle < 60) {
                g_joint3Angle = (g_joint3Angle + ANGLE_STEP) % 360;
            }
            break;
        case "c":
            if (g_joint3Angle > -60) {
                g_joint3Angle = (g_joint3Angle - ANGLE_STEP) % 360;
            }
            break;
        default:
            return;
    }

    draw(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix);
}


// 坐标变换矩阵
let g_modelMatrix = new Matrix4();
const g_mvpMatrix = new Matrix4();
const g_normalMatrix = new Matrix4(); // Coordinate transformation matrix for normals

function draw(gl: WebGLRenderingContext, n: number, viewProjMatrix: Matrix4, u_MvpMatrix: WebGLUniformLocation, u_NormalMatrix: WebGLUniformLocation) {
    // Clear color and depth buffer
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    //base 绘制
    const baseHeight = 2.0;
    g_modelMatrix.setTranslate(0.0, -12.0, 0.0);
    drawBox(gl, n, 10.0, baseHeight, 10.0, viewProjMatrix, u_MvpMatrix, u_NormalMatrix);

    // Arm1
    const arm1Length = 10.0; // Length of arm1
    g_modelMatrix.setTranslate(0.0, -12.0, 0.0);
    g_modelMatrix.rotate(g_arm1Angle, 0.0, 1.0, 0.0);    // Rotate around the y-axis
    drawBox(gl, n, 3.0, arm1Length, 3.0, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

    // Arm2
    const arm2Length = 10.0; // Length of arm2
    g_modelMatrix.translate(0.0, arm1Length, 0.0); // Move to joint1 这里用到translate，是在之前的基础上向上平移一个arm1的高度
    g_modelMatrix.rotate(g_joint1Angle, 0.0, 0.0, 1.0);  // Rotate around the z-axis
    drawBox(gl, n, 4.0, arm2Length, 4.0, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

    //A palm
    const palmLength = 2.0;
    g_modelMatrix.translate(0.0, arm2Length, 0.0); // Move to palm
    g_modelMatrix.rotate(g_joint2Angle, 0.0, 1.0, 0.0);  // Rotate around the y-axis
    drawBox(gl, n, 2.0, palmLength, 6.0, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

    // Move to the center of the tip of the palm
    g_modelMatrix.translate(0.0, palmLength, 0.0);

    // Draw finger1
    pushMatrix(g_modelMatrix);
    g_modelMatrix.translate(0.0, 0.0, 2.0);
    g_modelMatrix.rotate(g_joint3Angle, 1.0, 0.0, 0.0);  // Rotate around the x-axis
    drawBox(gl, n, 1.0, 2.0, 1.0, viewProjMatrix, u_MvpMatrix, u_NormalMatrix);
    g_modelMatrix = popMatrix();

    // Draw finger2
    g_modelMatrix.translate(0.0, 0.0, -2.0);
    g_modelMatrix.rotate(-g_joint3Angle, 1.0, 0.0, 0.0);  // Rotate around the x-axis
    drawBox(gl, n, 1.0, 2.0, 1.0, viewProjMatrix, u_MvpMatrix, u_NormalMatrix);
}

const g_matrixStack = []; // Array for storing a matrix
function pushMatrix(m) { // Store the specified matrix to the array
    const m2 = new Matrix4(m);
    g_matrixStack.push(m2);
}

function popMatrix() { // Retrieve the matrix from the array
    return g_matrixStack.pop();
}

// 绘制立方体
function drawBox(gl: WebGLRenderingContext, n: number, width: number, height: number, depth: number, viewProjMatrix: Matrix4, u_MvpMatrix: WebGLUniformLocation, u_NormalMatrix: WebGLUniformLocation) {
    pushMatrix(g_modelMatrix);
    g_modelMatrix.scale(width, height, depth);
    // Calculate the model view project matrix and pass it to u_MvpMatrix
    g_mvpMatrix.set(viewProjMatrix);
    g_mvpMatrix.multiply(g_modelMatrix);
    gl.uniformMatrix4fv(u_MvpMatrix, false, g_mvpMatrix.elements);
    // Calculate the normal transformation matrix and pass it to u_NormalMatrix
    g_normalMatrix.setInverseOf(g_modelMatrix);
    g_normalMatrix.transpose();
    gl.uniformMatrix4fv(u_NormalMatrix, false, g_normalMatrix.elements);
    // Draw
    gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
    g_modelMatrix = popMatrix();
}