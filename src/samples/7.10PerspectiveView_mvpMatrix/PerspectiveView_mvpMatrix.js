var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
window.onload = function () {
    return __awaiter(this, void 0, void 0, function* () {
        const { gl, program, canvas } = yield initWebGL("PerspectiveView_mvpMatrix");
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT); //清空<canvas>
        const n = initVertexBuffers(gl, program);
        const projMatrix = new Matrix4();
        projMatrix.setPerspective(30, canvas.width / canvas.height, 1, 100);
        const viewMatrix = new Matrix4();
        viewMatrix.setLookAt(0, 0, 5, 0, 0, -100, 0, 1, 0);
        const modelMatrix = new Matrix4();
        modelMatrix.setTranslate(0.75, 0, 0); //平移 0.75 单位
        const mvpMatrix = new Matrix4();
        mvpMatrix.set(projMatrix).multiply(viewMatrix).multiply(modelMatrix);
        const u_MvpMatrix = gl.getUniformLocation(program, 'u_MvpMatrix');
        gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements); //将视图矩阵传给 u_ViewMatrix 变量
        gl.drawArrays(gl.TRIANGLES, 0, n); //绘制右侧的一组三角形
        modelMatrix.setTranslate(-0.75, 0, 0); //平移 -0.75 单位
        mvpMatrix.set(projMatrix).multiply(viewMatrix).multiply(modelMatrix);
        gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements); //将视图矩阵传给 u_ViewMatrix 变量
        gl.drawArrays(gl.TRIANGLES, 0, n); //绘制左侧的一组三角形
    });
};
function initVertexBuffers(gl, program) {
    //顶点坐标和颜色
    const verticesColors = new Float32Array([
        // Three triangles on the right side
        0.0, 1.0, -4.0, 0.4, 1.0, 0.4,
        -0.5, -1.0, -4.0, 0.4, 1.0, 0.4,
        0.5, -1.0, -4.0, 1.0, 0.4, 0.4,
        0.0, 1.0, -2.0, 1.0, 1.0, 0.4,
        -0.5, -1.0, -2.0, 1.0, 1.0, 0.4,
        0.5, -1.0, -2.0, 1.0, 0.4, 0.4,
        0.0, 1.0, 0.0, 0.4, 0.4, 1.0,
        -0.5, -1.0, 0.0, 0.4, 0.4, 1.0,
        0.5, -1.0, 0.0, 1.0, 0.4, 0.4,
    ]);
    const vertexColorBuffer = gl.createBuffer(); //创建缓冲区对象
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer); //将缓冲区对象绑定到目标
    gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW); //向缓冲区对象写入顶点坐标和颜色数据
    const F_SIZE = verticesColors.BYTES_PER_ELEMENT;
    const vertexPositionSize = 3; //单个顶点坐标的组成数量
    const vertexColorSize = 3; //单个顶点颜色的组成数量
    const vertexSize = vertexPositionSize + vertexColorSize; //单个顶点的组成数量
    const a_Position = gl.getAttribLocation(program, 'a_Position'); //获取 a_Position 存储地址
    gl.vertexAttribPointer(a_Position, vertexPositionSize, gl.FLOAT, false, F_SIZE * vertexSize, 0); //将缓冲区对象分配给 a_Position 变量
    gl.enableVertexAttribArray(a_Position); //连接 a_Position 变量与分配给它的缓冲区对象
    const a_Color = gl.getAttribLocation(program, 'a_Color'); //获取 a_Color 存储地址
    gl.vertexAttribPointer(a_Color, vertexColorSize, gl.FLOAT, false, F_SIZE * vertexSize, F_SIZE * vertexPositionSize); //将缓冲区对象分配给 a_Color 变量
    gl.enableVertexAttribArray(a_Color); //连接 a_Color 变量与分配给它的缓冲区对象
    gl.bindBuffer(gl.ARRAY_BUFFER, null); //取消绑定的缓冲区对象
    const vertexCount = verticesColors.length / vertexSize; //顶点数量
    return vertexCount;
}
