import { initWebGL } from '../../utils/util.js';

window.onload = async () => {
    const { gl, program } = await initWebGL("ColoredTriangle");

    const vertexCount = initVertexBuffers(gl, program);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.TRIANGLES, 0, vertexCount);
};

const initVertexBuffers = (gl: WebGLRenderingContext, program: WebGLProgram) => {
    //顶点坐标和颜色数据
    const verticesColors = new Float32Array([
        0.0, 0.5, 1.0, 0.0, 0.0,
        -0.5, -0.5, 0.0, 1.0, 0.0,
        0.5, -0.5, 0.0, 0.0, 1.0
    ]);

    const vertexBuffer = gl.createBuffer();//创建缓冲区对象
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);//将缓冲区对象绑定到目标
    gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);//向缓冲区对象写入顶点坐标和颜色数据

    const F_SIZE = verticesColors.BYTES_PER_ELEMENT;
    const vertexPositionSize = 2;//单个顶点坐标的组成数量
    const vertexColorSize = 3;//单个顶点颜色的组成数量
    const vertexSize = vertexPositionSize + vertexColorSize;//单个顶点的组成数量

    const a_Position = gl.getAttribLocation(program, 'a_Position');//获取 a_Position 存储地址
    gl.vertexAttribPointer(a_Position, vertexPositionSize, gl.FLOAT, false, F_SIZE * vertexSize, 0);//将缓冲区对象分配给 a_Position 变量
    gl.enableVertexAttribArray(a_Position);//连接 a_Position 变量与分配给它的缓冲区对象

    const a_Color = gl.getAttribLocation(program, 'a_Color');//获取 a_Color 存储地址
    gl.vertexAttribPointer(a_Color, vertexColorSize, gl.FLOAT, false, F_SIZE * vertexSize, F_SIZE * vertexPositionSize);//将缓冲区对象分配给 a_Color 变量
    gl.enableVertexAttribArray(a_Color);//连接 a_Color 变量与分配给它的缓冲区对象

    const vertexCount = verticesColors.length / vertexSize;//顶点数量
    return vertexCount;
};