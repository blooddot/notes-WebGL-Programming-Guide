/**
 * @author hong.guo
 * @description 
 */
import { initWebGL } from '../../utils/util.js';

window.onload = async () => {
    const { gl, program } = await initWebGL("MultiPoint");

    const n = initVertexBuffers(gl, program);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.POINTS, 0, n);
};

const initVertexBuffers = (gl: WebGLRenderingContext, program: WebGLProgram) => {
    //顶点坐标数据
    const vertices = new Float32Array([
        0.0, 0.5, -0.5, -0.5, 0.5, -0.5
    ]);
    const vertexSize = 2;//单个顶点坐标的组成数量
    const vertexBuffer = gl.createBuffer();//创建缓冲区对象
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);//将缓冲区对象绑定到目标
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);//向缓冲区对象写入顶点坐标数据
    const a_Position = gl.getAttribLocation(program, 'a_Position');//获取 a_Position 存储地址
    gl.vertexAttribPointer(a_Position, vertexSize, gl.FLOAT, false, 0, 0);//将缓冲区对象分配给 a_Position 变量
    gl.enableVertexAttribArray(a_Position);//连接 a_Position 变量与分配给它的缓冲区对象

    const vertexCount = vertices.length / vertexSize;
    return vertexCount;
};