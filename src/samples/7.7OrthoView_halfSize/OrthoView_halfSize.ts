import { Matrix4 } from "../../libs/cuon-matrix.js";
import { initWebGL } from "../../utils/util.js";

/**
 * @author 雪糕
 * @description 
 */
window.onload = async function () {
    const { gl, program } = await initWebGL("OrthoView_halfSize");

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);  //清空<canvas>

    const n = initVertexBuffers(gl, program);

    const u_ProjMatrix = gl.getUniformLocation(program, 'u_ProjMatrix');
    const projMatrix = new Matrix4();
    projMatrix.setOrtho(-0.5, 0.5, -0.5, 0.5, 0, 0.5);      //使用矩阵设置可视空间
    // projMatrix.setOrtho(-0.3, 0.3, -1.0, 1.0, 0.0, 0.5);
    gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements);    //将视图矩阵传给 u_ViewMatrix 变量

    gl.drawArrays(gl.TRIANGLES, 0, n);     //绘制三角形
};

function initVertexBuffers(gl: WebGLRenderingContext, program: WebGLProgram) {
    const verticesColors = new Float32Array(
        [
            //顶点坐标和颜色
            0.0, 0.5, -0.4, 0.4, 1.0, 0.4,  //绿色三角形在最后面
            -0.5, -0.5, -0.4, 0.4, 1.0, 0.4,
            0.5, -0.5, -0.4, 1.0, 0.4, 0.4,

            0.5, 0.4, -0.2, 1.0, 0.4, 0.4,  //黄色三角形在中间
            -0.5, 0.4, -0.2, 1.0, 1.0, 0.4,
            0.0, -0.6, -0.2, 1.0, 1.0, 0.4,

            0.0, 0.5, 0.0, 0.4, 0.4, 1.0,   //蓝色三角形在最前面
            -0.5, -0.5, 0.0, 0.4, 0.4, 1.0,
            0.5, -0.5, 0.0, 1.0, 0.4, 0.4
        ]
    );

    const n = 9;
    const vertexColorBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);

    const F_SIZE = verticesColors.BYTES_PER_ELEMENT;

    const a_Position = gl.getAttribLocation(program, 'a_Position');
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, F_SIZE * 6, 0);  //将缓冲区对象分配给 a_Position 变量
    gl.enableVertexAttribArray(a_Position);//连接 a_Position 变量与分配给它的缓冲区对象

    const a_Color = gl.getAttribLocation(program, 'a_Color');
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, F_SIZE * 6, F_SIZE * 3);
    gl.enableVertexAttribArray(a_Color);

    gl.bindBuffer(gl.ARRAY_BUFFER, null);//取消绑定的缓冲区对象
    return n;
}