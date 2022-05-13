import { Matrix4 } from "../../libs/cuon-matrix.js";
import { initWebGL } from "../../utils/util.js";

/**
 * @author 雪糕
 * @description 
 */
window.onload = async function () {
    const { gl, program, canvas } = await initWebGL("PerspectiveView");

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);      //清空<canvas>

    const n = initVertexBuffers(gl, program);

    const u_ViewMatrix = gl.getUniformLocation(program, 'u_ViewMatrix');
    const viewMatrix = new Matrix4();
    viewMatrix.setLookAt({ x: 0, y: 0, z: 5 }, { x: 0, y: 0, z: -100 }, { x: 0, y: 1, z: 0 });
    //将视图矩阵传给 u_ViewMatrix 变量
    gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);

    const u_ProjMatrix = gl.getUniformLocation(program, 'u_ProjMatrix');
    const projMatrix = new Matrix4();
    projMatrix.setPerspective(30, canvas.width / canvas.height, 1, 100);
    gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements);

    //绘制三角形
    gl.drawArrays(gl.TRIANGLES, 0, n);
};

function initVertexBuffers(gl: WebGLRenderingContext, program: WebGLProgram) {
    const verticesColors = new Float32Array(
        [
            // Three triangles on the right side
            0.75, 1.0, -4.0, 0.4, 1.0, 0.4, // The back green one
            0.25, -1.0, -4.0, 0.4, 1.0, 0.4,
            1.25, -1.0, -4.0, 1.0, 0.4, 0.4,

            0.75, 1.0, -2.0, 1.0, 1.0, 0.4, // The middle yellow one
            0.25, -1.0, -2.0, 1.0, 1.0, 0.4,
            1.25, -1.0, -2.0, 1.0, 0.4, 0.4,

            0.75, 1.0, 0.0, 0.4, 0.4, 1.0,  // The front blue one
            0.25, -1.0, 0.0, 0.4, 0.4, 1.0,
            1.25, -1.0, 0.0, 1.0, 0.4, 0.4,

            // Three triangles on the left side
            -0.75, 1.0, -4.0, 0.4, 1.0, 0.4, // The back green one
            -1.25, -1.0, -4.0, 0.4, 1.0, 0.4,
            -0.25, -1.0, -4.0, 1.0, 0.4, 0.4,

            -0.75, 1.0, -2.0, 1.0, 1.0, 0.4, // The middle yellow one
            -1.25, -1.0, -2.0, 1.0, 1.0, 0.4,
            -0.25, -1.0, -2.0, 1.0, 0.4, 0.4,

            -0.75, 1.0, 0.0, 0.4, 0.4, 1.0,  // The front blue one
            -1.25, -1.0, 0.0, 0.4, 0.4, 1.0,
            -0.25, -1.0, 0.0, 1.0, 0.4, 0.4,
        ]
    );

    const n = 18;
    const vertexColorBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);

    const F_SIZE = verticesColors.BYTES_PER_ELEMENT;

    const a_Position = gl.getAttribLocation(program, 'a_Position');
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, F_SIZE * 6, 0);//将缓冲区对象分配给 a_Position 变量
    gl.enableVertexAttribArray(a_Position);//连接 a_Position 变量与分配给它的缓冲区对象

    const a_Color = gl.getAttribLocation(program, 'a_Color');
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, F_SIZE * 6, F_SIZE * 3);
    gl.enableVertexAttribArray(a_Color);

    gl.bindBuffer(gl.ARRAY_BUFFER, null);//取消绑定的缓冲区对象
    return n;
}