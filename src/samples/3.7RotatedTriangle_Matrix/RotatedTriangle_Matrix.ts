import { initWebGL } from '../../utils/util.js';

const angle = 90.0;

window.onload = async () => {
    const { gl, program } = await initWebGL("RotatedTriangle_Matrix");

    const n = initVertexBuffers(gl, program);

    const radian = Math.PI * angle / 180.0;     //转换成弧度
    const cosB = Math.cos(radian);
    const sinB = Math.sin(radian);

    const xformMatrix = new Float32Array([
        cosB, sinB, 0.0, 0.0,
        -sinB, cosB, 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0,
        0.0, 0.0, 0.0, 1.0
    ]);

    const u_xformMatrix = gl.getUniformLocation(program, 'u_xformMatrix');

    gl.uniformMatrix4fv(u_xformMatrix, false, xformMatrix);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.TRIANGLES, 0, n);
};

const initVertexBuffers = (gl: WebGLRenderingContext, program: WebGLProgram) => {
    const vertices = new Float32Array([
        0.0, 0.5, -0.5, -0.5, 0.5, -0.5
    ]);

    const n = 3;

    //创建缓冲区对象
    const vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.error('Failed to create the buffer object');
        return -1;
    }

    //将缓冲区对象绑定到目标
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    //向缓冲区对象写入数据
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const a_Position = gl.getAttribLocation(program, 'a_Position');

    //将缓冲区对象分配给a_Position变量
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

    //连接a_Position变量与分配给它的缓冲区对象
    gl.enableVertexAttribArray(a_Position);

    return n;
};