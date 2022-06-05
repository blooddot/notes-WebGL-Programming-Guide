import { Matrix4 } from '../../../libs/cuon/cuon-matrix.js';
import { initWebGL } from '../../utils/util.js';

let angle_step = 45.0;
let currentAngle = 0.0;
const n = 3;

window.onload = async () => {
    const { gl, program } = await initWebGL("RotatingTriangle_withButtons");

    initVertexBuffers(gl, program);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    const u_ModelMatrix = gl.getUniformLocation(program, 'u_ModelMatrix');

    const modelMatrix = new Matrix4();

    const tick = () => {
        currentAngle = animate(currentAngle);//更新旋转角
        draw(gl, modelMatrix, u_ModelMatrix);
        requestAnimationFrame(tick);
    };

    tick();
};

const initVertexBuffers = (gl: WebGLRenderingContext, program: WebGLProgram) => {
    //顶点数据
    const vertices = new Float32Array([
        0.0, 0.3, -0.3, -0.3, 0.3, -0.3
    ]);

    const vertexSize = 2;//每个顶点属性的组成数量
    const vertexBuffer = gl.createBuffer();//创建缓冲区对象
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);//将缓冲区对象绑定到目标
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);//向缓冲区对象写入顶点数据
    const a_Position = gl.getAttribLocation(program, 'a_Position');//获取 a_Position 存储地址
    gl.vertexAttribPointer(a_Position, vertexSize, gl.FLOAT, false, 0, 0);//将缓冲区对象分配给 a_Position 变量
    gl.enableVertexAttribArray(a_Position);//连接 a_Position 变量与分配给它的缓冲区对象

    const vertexCount = vertices.length / vertexSize;
    return vertexCount;
};

const draw = (gl: WebGLRenderingContext, modelMatrix: Matrix4, u_ModelMatrix: WebGLUniformLocation) => {
    //设置旋转矩阵
    modelMatrix.setRotate(currentAngle, 0, 0, 1);
    modelMatrix.translate(0.35, 0, 0);

    //将旋转矩阵传输给顶点着色器
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

    //清除<canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);

    //绘制三角形
    gl.drawArrays(gl.TRIANGLES, 0, n);
};

//记录上一次调用函数的时间
let g_last = Date.now();
const animate = (angle: number): number => {
    //计算距离上次调用经过多长的时间
    const now = Date.now();
    const elapsed = now - g_last;
    g_last = now;

    //根据距离上次调用的时间，更新当前旋转角度
    let newAngle = angle + (angle_step * elapsed) / 1000.0;
    newAngle %= 360;
    return newAngle;
};

window["up"] = () => {
    angle_step += 10;
};

window["down"] = () => {
    angle_step -= 10;
};
