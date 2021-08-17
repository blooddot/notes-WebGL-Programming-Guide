import { Matrix4 } from '../../libs/cuon-matrix.js';
import { initWebGL } from '../../utils/util.js';

const angle = 60.0;
const tx = 0.5;

window.onload = async () => {
    const { gl, program } = await initWebGL("RotatedTranslatedTriangle");

    const n = initVertexBuffers(gl, program);

    const modelMatrix = new Matrix4();
    modelMatrix.setRotate(angle, 0, 0, 1);
    modelMatrix.translate(tx, 0, 0);

    // modelMatrix.setTranslate(tx, 0, 0);
    // modelMatrix.rotate(angle, 0, 0, 1);

    const u_ModelMatrix = gl.getUniformLocation(program, 'u_ModelMatrix');

    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.TRIANGLES, 0, n);
};

const initVertexBuffers = (gl: WebGLRenderingContext, program: WebGLProgram) => {
    const vertices = new Float32Array([
        0.0, 0.3, -0.3, -0.3, 0.3, -0.3
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