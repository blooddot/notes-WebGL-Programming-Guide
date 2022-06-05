/**
 * @author hong.guo
 * @description 
 */
import { Matrix4 } from "../../../libs/cuon/cuon-matrix.js";
import { initWebGL } from "../../utils/util.js";

/**
 * @author 雪糕
 * @description 
 */
window.onload = async function () {
    const { gl, program, canvas } = await initWebGL("Zfighting");

    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.POLYGON_OFFSET_FILL);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    const n = initVertexBuffers(gl, program);

    const u_ViewProjMatrix = gl.getUniformLocation(program, 'u_ViewProjMatrix');
    const viewProjMatrix = new Matrix4();
    viewProjMatrix.setPerspective(30, canvas.width / canvas.height, 1, 100);
    viewProjMatrix.lookAt(3.06, 2.5, 10.0, 0, 0, -2, 0, 1, 0);
    gl.uniformMatrix4fv(u_ViewProjMatrix, false, viewProjMatrix.elements);//将视图矩阵传给 u_ViewMatrix 变量

    gl.drawArrays(gl.TRIANGLES, 0, n / 2);//绘制绿色三角形
    gl.polygonOffset(1.0, 1.0);
    gl.drawArrays(gl.TRIANGLES, n / 2, n / 2);//绘制黄色三角形
};

function initVertexBuffers(gl: WebGLRenderingContext, program: WebGLProgram) {
    //顶点坐标和颜色
    const verticesColors = new Float32Array(
        [
            0.0, 2.5, -5.0, 0.0, 1.0, 0.0, // The green triangle
            -2.5, -2.5, -5.0, 0.0, 1.0, 0.0,
            2.5, -2.5, -5.0, 1.0, 0.0, 0.0,

            0.0, 3.0, -5.0, 1.0, 0.0, 0.0, // The yellow triangle
            -3.0, -3.0, -5.0, 1.0, 1.0, 0.0,
            3.0, -3.0, -5.0, 1.0, 1.0, 0.0,
        ]
    );

    const vertexColorBuffer = gl.createBuffer();//创建缓冲区对象
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);//将缓冲区对象绑定到目标
    gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);//向缓冲区对象写入顶点坐标和颜色数据

    const F_SIZE = verticesColors.BYTES_PER_ELEMENT;
    const vertexPositionSize = 3;//单个顶点坐标的组成数量
    const vertexColorSize = 3;//单个顶点颜色的组成数量
    const vertexSize = vertexPositionSize + vertexColorSize;//单个顶点的组成数量

    const a_Position = gl.getAttribLocation(program, 'a_Position');//获取 a_Position 存储地址
    gl.vertexAttribPointer(a_Position, vertexPositionSize, gl.FLOAT, false, F_SIZE * vertexSize, 0);//将缓冲区对象分配给 a_Position 变量
    gl.enableVertexAttribArray(a_Position);//连接 a_Position 变量与分配给它的缓冲区对象

    const a_Color = gl.getAttribLocation(program, 'a_Color');//获取 a_Color 存储地址
    gl.vertexAttribPointer(a_Color, vertexColorSize, gl.FLOAT, false, F_SIZE * vertexSize, F_SIZE * vertexPositionSize);//将缓冲区对象分配给 a_Color 变量
    gl.enableVertexAttribArray(a_Color);//连接 a_Color 变量与分配给它的缓冲区对象

    gl.bindBuffer(gl.ARRAY_BUFFER, null);//取消绑定的缓冲区对象

    const vertexCount = verticesColors.length / vertexSize;//顶点数量
    return vertexCount;
}