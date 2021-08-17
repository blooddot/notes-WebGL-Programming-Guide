import { initWebGL } from '../../utils/util.js';

window.onload = async () => {
    const { gl, program } = await initWebGL("MultiAttributeSize");

    const n = initVertexBuffers(gl, program);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.POINTS, 0, n);
};

const initVertexBuffers = (gl: WebGLRenderingContext, program: WebGLProgram) => {
    const vertices = new Float32Array([
        0.0, 0.5, -0.5, -0.5, 0.5, -0.5
    ]);

    const sizes = new Float32Array([
        10.0, 20.0, 30.0    //点的尺寸
    ]);

    const n = 3;

    //创建缓冲区对象
    const vertexBuffer = gl.createBuffer();

    //将缓冲区对象绑定到目标
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    //向缓冲区对象写入数据
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const a_Position = gl.getAttribLocation(program, 'a_Position');

    //将缓冲区对象分配给a_Position变量
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

    //连接a_Position变量与分配给它的缓冲区对象
    gl.enableVertexAttribArray(a_Position);

    const sizeBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, sizeBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, sizes, gl.STATIC_DRAW);
    const a_PointSize = gl.getAttribLocation(program, 'a_PointSize');
    gl.vertexAttribPointer(a_PointSize, 1, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_PointSize);

    return n;
};