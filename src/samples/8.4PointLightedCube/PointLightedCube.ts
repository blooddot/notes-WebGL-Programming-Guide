import { Matrix4 } from "../../../libs/cuon/cuon-matrix.js";
import { initWebGL } from "../../utils/util.js";

/**
 * @author 雪糕
 * @description 
 */
window.onload = async function () {
    const { gl, program, canvas } = await initWebGL("PointLightedCube");

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    const n = initVertexBuffers(gl, program);

    const u_LightColor = gl.getUniformLocation(program, 'u_LightColor');
    gl.uniform3f(u_LightColor, 1.0, 1.0, 1.0);  //设置光线颜色（白色）

    const u_LightPosition = gl.getUniformLocation(program, 'u_LightPosition');
    // gl.uniform3f(u_LightPosition, 0.0, 3.0, 4.0);
    gl.uniform3f(u_LightPosition, 2.3, 4.0, 3.5);//设置光线位置（在世界坐标系下）

    const u_AmbientLight = gl.getUniformLocation(program, 'u_AmbientLight');
    gl.uniform3f(u_AmbientLight, 0.2, 0.2, 0.2);  //设置环境光颜色（灰色）

    const modelMatrix = new Matrix4();  //模型矩阵
    modelMatrix.rotate(90, 0, 0, 1);    //沿 Z 轴旋转
    const u_ModelMatrix = gl.getUniformLocation(program, 'u_ModelMatrix');
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

    const mvpMatrix = new Matrix4();
    mvpMatrix.setPerspective(30, canvas.width / canvas.height, 1, 100);
    mvpMatrix.lookAt(3, 3, 7, 0, 0, 0, 0, 1, 0);
    mvpMatrix.multiply(modelMatrix);
    const u_MvpMatrix = gl.getUniformLocation(program, 'u_MvpMatrix');
    gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);  //将视图矩阵传给 u_ViewMatrix 变量

    const normalMatrix = new Matrix4();  //用来变换法向量的矩阵
    normalMatrix.setInverseOf(modelMatrix);  //将模型矩阵的逆矩阵传入 normalMatrix
    normalMatrix.transpose();  //将矩阵转置
    const u_NormalMatrix = gl.getUniformLocation(program, 'u_NormalMatrix');
    gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);    //清空颜色缓冲区和深度缓冲区
    gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);  //绘制立方体
};

function initVertexBuffers(gl: WebGLRenderingContext, program: WebGLProgram) {
    // Create a cube
    //    v6----- v5
    //   /|      /|
    //  v1------v0|
    //  | |     | |
    //  | |v7---|-|v4
    //  |/      |/
    //  v2------v3
    //顶点坐标
    const vertices = new Float32Array([   // Vertex coordinates
        1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0,  // v0-v1-v2-v3 front
        1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0,  // v0-v3-v4-v5 right
        1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0,  // v0-v5-v6-v1 up
        -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0,  // v1-v6-v7-v2 left
        -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0,  // v7-v4-v3-v2 down
        1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0   // v4-v7-v6-v5 back
    ]);

    //顶点颜色
    const colors = new Float32Array([     // Colors
        1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,     // v0-v1-v2-v3 front
        1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,     // v0-v3-v4-v5 right
        1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,     // v0-v5-v6-v1 up
        1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,     // v1-v6-v7-v2 left
        1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,     // v7-v4-v3-v2 down
        1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0      // v4-v7-v6-v5 back
    ]);

    //顶点法向量
    const normals = new Float32Array([    // Normal
        0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,  // v0-v1-v2-v3 front
        1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0,  // v0-v3-v4-v5 right
        0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,  // v0-v5-v6-v1 up
        -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0,  // v1-v6-v7-v2 left
        0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0,  // v7-v4-v3-v2 down
        0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0   // v4-v7-v6-v5 back
    ]);

    //顶点索引
    const indices = new Uint8Array([       // Indices of the vertices
        0, 1, 2, 0, 2, 3,    // front
        4, 5, 6, 4, 6, 7,    // right
        8, 9, 10, 8, 10, 11,    // up
        12, 13, 14, 12, 14, 15,    // left
        16, 17, 18, 16, 18, 19,    // down
        20, 21, 22, 20, 22, 23     // back
    ]);

    const vertexColorBuffer = gl.createBuffer();//创建缓冲区对象
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);//将缓冲区对象绑定到目标
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);//向缓冲区对象写入顶点坐标
    const a_Position = gl.getAttribLocation(program, 'a_Position');//获取 a_Position 存储地址
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);//将缓冲区对象分配给 a_Position 变量
    gl.enableVertexAttribArray(a_Position);//连接 a_Position 变量与分配给它的缓冲区对象

    const colorBuffer = gl.createBuffer();//创建缓冲区对象
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);//将缓冲区对象绑定到目标
    gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);//向缓冲区对象写入顶点颜色
    const a_Color = gl.getAttribLocation(program, 'a_Color');//获取 a_Color 存储地址
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, 0, 0);//将缓冲区对象分配给 a_Color 变量
    gl.enableVertexAttribArray(a_Color);//连接 a_Color 变量与分配给它的缓冲区对象

    const normalBuffer = gl.createBuffer();//创建缓冲区对象
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);//将缓冲区对象绑定到目标
    gl.bufferData(gl.ARRAY_BUFFER, normals, gl.STATIC_DRAW);//向缓冲区对象写入顶点法向量
    const a_Normal = gl.getAttribLocation(program, 'a_Normal');//获取 a_Normal 存储地址
    gl.vertexAttribPointer(a_Normal, 3, gl.FLOAT, false, 0, 0);//将缓冲区对象分配给 a_Normal 变量
    gl.enableVertexAttribArray(a_Normal);//连接 a_Normal 变量与分配给它的缓冲区对象

    const indexBuffer = gl.createBuffer();//创建缓冲区对象
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);//将缓冲区对象绑定到目标
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);//向缓冲区对象写入顶点索引

    return indices.length;
}