var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Matrix4 } from "../../../libs/cuon/cuon-matrix.js";
import { initWebGL } from "../../utils/util.js";
/**
 * @author 雪糕
 * @description
 */
window.onload = function () {
    return __awaiter(this, void 0, void 0, function* () {
        const { gl, program, canvas } = yield initWebGL("MultiJointModel_segment", 0, -50);
        gl.enable(gl.DEPTH_TEST);
        const n = initVertexBuffers(gl, program);
        const viewProjMatrix = new Matrix4();
        viewProjMatrix.setPerspective(50.0, canvas.width / canvas.height, 1.0, 100.0);
        viewProjMatrix.lookAt(20.0, 10.0, 30.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0);
        const a_Position = gl.getAttribLocation(program, 'a_Position');
        const u_MvpMatrix = gl.getUniformLocation(program, 'u_MvpMatrix');
        const u_NormalMatrix = gl.getUniformLocation(program, 'u_NormalMatrix');
        // 注册键盘事件响应函数
        document.onkeydown = function (ev) {
            keyDown(ev, gl, n, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix);
        };
        draw(gl, n, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix);
    });
};
let g_baseBuffer = null; //base 的缓冲区对象
let g_arm1Buffer = null; //arm1 的缓冲区对象
let g_arm2Buffer = null; //arm2 的缓冲区对象
let g_palmBuffer = null; //palm 的缓冲区对象
let g_fingerBuffer = null; //finger1 和 finger2 的缓冲区对象
function initVertexBuffers(gl, program) {
    //顶点坐标
    const vertices_base = new Float32Array([
        5.0, 2.0, 5.0, -5.0, 2.0, 5.0, -5.0, 0.0, 5.0, 5.0, 0.0, 5.0,
        5.0, 2.0, 5.0, 5.0, 0.0, 5.0, 5.0, 0.0, -5.0, 5.0, 2.0, -5.0,
        5.0, 2.0, 5.0, 5.0, 2.0, -5.0, -5.0, 2.0, -5.0, -5.0, 2.0, 5.0,
        -5.0, 2.0, 5.0, -5.0, 2.0, -5.0, -5.0, 0.0, -5.0, -5.0, 0.0, 5.0,
        -5.0, 0.0, -5.0, 5.0, 0.0, -5.0, 5.0, 0.0, 5.0, -5.0, 0.0, 5.0,
        5.0, 0.0, -5.0, -5.0, 0.0, -5.0, -5.0, 2.0, -5.0, 5.0, 2.0, -5.0 // v4-v7-v6-v5 back
    ]);
    g_baseBuffer = initArrayBufferForLaterUse(gl, vertices_base, 3, gl.FLOAT);
    const vertices_arm1 = new Float32Array([
        1.5, 10.0, 1.5, -1.5, 10.0, 1.5, -1.5, 0.0, 1.5, 1.5, 0.0, 1.5,
        1.5, 10.0, 1.5, 1.5, 0.0, 1.5, 1.5, 0.0, -1.5, 1.5, 10.0, -1.5,
        1.5, 10.0, 1.5, 1.5, 10.0, -1.5, -1.5, 10.0, -1.5, -1.5, 10.0, 1.5,
        -1.5, 10.0, 1.5, -1.5, 10.0, -1.5, -1.5, 0.0, -1.5, -1.5, 0.0, 1.5,
        -1.5, 0.0, -1.5, 1.5, 0.0, -1.5, 1.5, 0.0, 1.5, -1.5, 0.0, 1.5,
        1.5, 0.0, -1.5, -1.5, 0.0, -1.5, -1.5, 10.0, -1.5, 1.5, 10.0, -1.5 // v4-v7-v6-v5 back
    ]);
    g_arm1Buffer = initArrayBufferForLaterUse(gl, vertices_arm1, 3, gl.FLOAT);
    const vertices_arm2 = new Float32Array([
        2.0, 10.0, 2.0, -2.0, 10.0, 2.0, -2.0, 0.0, 2.0, 2.0, 0.0, 2.0,
        2.0, 10.0, 2.0, 2.0, 0.0, 2.0, 2.0, 0.0, -2.0, 2.0, 10.0, -2.0,
        2.0, 10.0, 2.0, 2.0, 10.0, -2.0, -2.0, 10.0, -2.0, -2.0, 10.0, 2.0,
        -2.0, 10.0, 2.0, -2.0, 10.0, -2.0, -2.0, 0.0, -2.0, -2.0, 0.0, 2.0,
        -2.0, 0.0, -2.0, 2.0, 0.0, -2.0, 2.0, 0.0, 2.0, -2.0, 0.0, 2.0,
        2.0, 0.0, -2.0, -2.0, 0.0, -2.0, -2.0, 10.0, -2.0, 2.0, 10.0, -2.0 // v4-v7-v6-v5 back
    ]);
    g_arm2Buffer = initArrayBufferForLaterUse(gl, vertices_arm2, 3, gl.FLOAT);
    const vertices_palm = new Float32Array([
        1.0, 2.0, 3.0, -1.0, 2.0, 3.0, -1.0, 0.0, 3.0, 1.0, 0.0, 3.0,
        1.0, 2.0, 3.0, 1.0, 0.0, 3.0, 1.0, 0.0, -3.0, 1.0, 2.0, -3.0,
        1.0, 2.0, 3.0, 1.0, 2.0, -3.0, -1.0, 2.0, -3.0, -1.0, 2.0, 3.0,
        -1.0, 2.0, 3.0, -1.0, 2.0, -3.0, -1.0, 0.0, -3.0, -1.0, 0.0, 3.0,
        -1.0, 0.0, -3.0, 1.0, 0.0, -3.0, 1.0, 0.0, 3.0, -1.0, 0.0, 3.0,
        1.0, 0.0, -3.0, -1.0, 0.0, -3.0, -1.0, 2.0, -3.0, 1.0, 2.0, -3.0 // v4-v7-v6-v5 back
    ]);
    g_palmBuffer = initArrayBufferForLaterUse(gl, vertices_palm, 3, gl.FLOAT);
    const vertices_finger = new Float32Array([
        0.5, 2.0, 0.5, -0.5, 2.0, 0.5, -0.5, 0.0, 0.5, 0.5, 0.0, 0.5,
        0.5, 2.0, 0.5, 0.5, 0.0, 0.5, 0.5, 0.0, -0.5, 0.5, 2.0, -0.5,
        0.5, 2.0, 0.5, 0.5, 2.0, -0.5, -0.5, 2.0, -0.5, -0.5, 2.0, 0.5,
        -0.5, 2.0, 0.5, -0.5, 2.0, -0.5, -0.5, 0.0, -0.5, -0.5, 0.0, 0.5,
        -0.5, 0.0, -0.5, 0.5, 0.0, -0.5, 0.5, 0.0, 0.5, -0.5, 0.0, 0.5,
        0.5, 0.0, -0.5, -0.5, 0.0, -0.5, -0.5, 2.0, -0.5, 0.5, 2.0, -0.5 // v4-v7-v6-v5 back
    ]);
    g_fingerBuffer = initArrayBufferForLaterUse(gl, vertices_finger, 3, gl.FLOAT);
    // Normal
    const normals = new Float32Array([
        0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,
        1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0,
        0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,
        -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0,
        0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0,
        0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0 // v4-v7-v6-v5 back
    ]);
    // Indices of the vertices
    const indices = new Uint8Array([
        0, 1, 2, 0, 2, 3,
        4, 5, 6, 4, 6, 7,
        8, 9, 10, 8, 10, 11,
        12, 13, 14, 12, 14, 15,
        16, 17, 18, 16, 18, 19,
        20, 21, 22, 20, 22, 23 // back
    ]);
    initArrayBuffer(gl, program, 'a_Normal', normals, 3, gl.FLOAT);
    // Write the indices to the buffer object
    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
    return indices.length;
}
function initArrayBufferForLaterUse(gl, data, num, type) {
    const buffer = gl.createBuffer(); // Create a buffer object
    // Write date into the buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    // Store the necessary information to assign the object to the attribute variable later
    buffer['num'] = num;
    buffer['type'] = type;
    return buffer;
}
function initArrayBuffer(gl, program, attribute, data, num, type) {
    const buffer = gl.createBuffer(); // Create a buffer object
    // Write date into the buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    // Assign the buffer object to the attribute variable
    const a_attribute = gl.getAttribLocation(program, attribute);
    gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0);
    // Enable the assignment of the buffer object to the attribute variable
    gl.enableVertexAttribArray(a_attribute);
    return true;
}
const ANGLE_STEP = 3.0; // 每次按键转动的角度
let g_arm1Angle = 90.0; // arm1的当前角度
let g_joint1Angle = 45.0; // joint1的当前角度
let g_joint2Angle = 0.0; // joint2的当前角度
let g_joint3Angle = 0.0; // joint3的当前角度
function keyDown(ev, gl, n, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix) {
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
    draw(gl, n, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix);
}
// 坐标变换矩阵
let g_modelMatrix = new Matrix4();
const g_mvpMatrix = new Matrix4();
const g_normalMatrix = new Matrix4(); // Coordinate transformation matrix for normals
function draw(gl, n, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix) {
    // Clear color and depth buffer
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    //base 绘制
    const baseHeight = 2.0;
    g_modelMatrix.setTranslate(0.0, -12.0, 0.0);
    drawSegment(gl, n, g_baseBuffer, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix);
    // Arm1
    const arm1Length = 10.0; // Length of arm1
    g_modelMatrix.translate(0.0, baseHeight, 0.0); // Move onto the base
    g_modelMatrix.rotate(g_arm1Angle, 0.0, 1.0, 0.0); // Rotate around the y-axis
    drawSegment(gl, n, g_arm1Buffer, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix); // Draw
    // Arm2
    const arm2Length = 10.0; // Length of arm2
    g_modelMatrix.translate(0.0, arm1Length, 0.0); // Move to joint1 这里用到translate，是在之前的基础上向上平移一个arm1的高度
    g_modelMatrix.rotate(g_joint1Angle, 0.0, 0.0, 1.0); // Rotate around the z-axis
    drawSegment(gl, n, g_arm2Buffer, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix); // Draw
    //A palm
    const palmLength = 2.0;
    g_modelMatrix.translate(0.0, arm2Length, 0.0); // Move to palm
    g_modelMatrix.rotate(g_joint2Angle, 0.0, 1.0, 0.0); // Rotate around the y-axis
    drawSegment(gl, n, g_palmBuffer, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix); // Draw
    // Move to the center of the tip of the palm
    g_modelMatrix.translate(0.0, palmLength, 0.0);
    // Draw finger1
    pushMatrix(g_modelMatrix);
    g_modelMatrix.translate(0.0, 0.0, 2.0);
    g_modelMatrix.rotate(g_joint3Angle, 1.0, 0.0, 0.0); // Rotate around the x-axis
    drawSegment(gl, n, g_fingerBuffer, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix);
    g_modelMatrix = popMatrix();
    // Draw finger2
    g_modelMatrix.translate(0.0, 0.0, -2.0);
    g_modelMatrix.rotate(-g_joint3Angle, 1.0, 0.0, 0.0); // Rotate around the x-axis
    drawSegment(gl, n, g_fingerBuffer, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix);
}
// Draw segments
function drawSegment(gl, n, buffer, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix) {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    // Assign the buffer object to the attribute variable
    gl.vertexAttribPointer(a_Position, buffer['num'], buffer['type'], false, 0, 0);
    // Enable the assignment of the buffer object to the attribute variable
    gl.enableVertexAttribArray(a_Position);
    // Calculate the model view project matrix and pass it to u_MvpMatrix
    g_mvpMatrix.set(viewProjMatrix);
    g_mvpMatrix.multiply(g_modelMatrix);
    gl.uniformMatrix4fv(u_MvpMatrix, false, g_mvpMatrix.elements);
    // Calculate matrix for normal and pass it to u_NormalMatrix
    g_normalMatrix.setInverseOf(g_modelMatrix);
    g_normalMatrix.transpose();
    gl.uniformMatrix4fv(u_NormalMatrix, false, g_normalMatrix.elements);
    // Draw
    gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
}
const g_matrixStack = []; // Array for storing a matrix
function pushMatrix(m) {
    const m2 = new Matrix4(m);
    g_matrixStack.push(m2);
}
function popMatrix() {
    return g_matrixStack.pop();
}
