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
        const { gl, program, canvas } = yield initWebGL("JointMode");
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
    });
};
function initVertexBuffers(gl, program) {
    //顶点坐标
    const vertices = new Float32Array([
        1.5, 10.0, 1.5, -1.5, 10.0, 1.5, -1.5, 0.0, 1.5, 1.5, 0.0, 1.5,
        1.5, 10.0, 1.5, 1.5, 0.0, 1.5, 1.5, 0.0, -1.5, 1.5, 10.0, -1.5,
        1.5, 10.0, 1.5, 1.5, 10.0, -1.5, -1.5, 10.0, -1.5, -1.5, 10.0, 1.5,
        -1.5, 10.0, 1.5, -1.5, 10.0, -1.5, -1.5, 0.0, -1.5, -1.5, 0.0, 1.5,
        -1.5, 0.0, -1.5, 1.5, 0.0, -1.5, 1.5, 0.0, 1.5, -1.5, 0.0, 1.5,
        1.5, 0.0, -1.5, -1.5, 0.0, -1.5, -1.5, 10.0, -1.5, 1.5, 10.0, -1.5 // v4-v7-v6-v5 back
    ]);
    const vertexBuffer = gl.createBuffer(); //创建缓冲区对象
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer); //将缓冲区对象绑定到目标
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW); //向缓冲区对象写入数据
    const a_Position = gl.getAttribLocation(program, 'a_Position'); //获取 a_Position 存储地址
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0); //将缓冲区对象分配给 a_Position 变量
    gl.enableVertexAttribArray(a_Position); //连接 a_Position 变量与分配给它的缓冲区对象
    //顶点法向量
    const normals = new Float32Array([
        0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,
        1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0,
        0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,
        -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0,
        0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0,
        0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0 // v4-v7-v6-v5 back
    ]);
    const normalBuffer = gl.createBuffer(); //创建缓冲区对象
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer); //将缓冲区对象绑定到目标
    gl.bufferData(gl.ARRAY_BUFFER, normals, gl.STATIC_DRAW); //向缓冲区对象写入数据
    const a_Normal = gl.getAttribLocation(program, 'a_Normal'); //获取 a_Normal 存储地址
    gl.vertexAttribPointer(a_Normal, 3, gl.FLOAT, false, 0, 0); //将缓冲区对象分配给 a_Normal 变量
    gl.enableVertexAttribArray(a_Normal); //连接 a_Normal 变量与分配给它的缓冲区对象
    //顶点索引
    const indices = new Uint8Array([
        0, 1, 2, 0, 2, 3,
        4, 5, 6, 4, 6, 7,
        8, 9, 10, 8, 10, 11,
        12, 13, 14, 12, 14, 15,
        16, 17, 18, 16, 18, 19,
        20, 21, 22, 20, 22, 23 // back
    ]);
    const indexBuffer = gl.createBuffer(); //创建缓冲区对象
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer); //将缓冲区对象绑定到目标
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW); //向缓冲区对象写入数据
    return indices.length;
}
const ANGLE_STEP = 3.0; // 每次按键转动的角度
let g_arm1Angle = -90.0; // arm1的当前角度
let g_joint1Angle = 0.0; // joint1d的当前角度(即arm2的角度)
function keyDown(ev, gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix) {
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
        default:
            return;
    }
    draw(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix);
}
// 坐标变换矩阵
const g_modelMatrix = new Matrix4();
const g_mvpMatrix = new Matrix4();
const g_normalMatrix = new Matrix4(); // Coordinate transformation matrix for normals
function draw(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix) {
    // Clear color and depth buffer
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    // Arm1
    const arm1Length = 10.0; // Length of arm1
    g_modelMatrix.setTranslate(0.0, -12.0, 0.0);
    g_modelMatrix.rotate(g_arm1Angle, 0.0, 1.0, 0.0); // Rotate around the y-axis
    drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
    // Arm2
    g_modelMatrix.translate(0.0, arm1Length, 0.0); // Move to joint1 这里用到translate，是在之前的基础上向上平移一个arm1的高度
    g_modelMatrix.rotate(g_joint1Angle, 0.0, 0.0, 1.0); // Rotate around the z-axis
    g_modelMatrix.scale(1.3, 1.0, 1.3); // 让立方体粗一点
    drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw
}
// 绘制立方体
function drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix) {
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
}
