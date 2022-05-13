var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Matrix4 } from "../../libs/cuon-matrix.js";
import { initWebGL } from "../../utils/util.js";
/**
 * @author 雪糕
 * @description
 */
window.onload = function () {
    return __awaiter(this, void 0, void 0, function* () {
        const { gl, program } = yield initWebGL("LookAtRotatedTriangles");
        const n = initVertexBuffers(gl, program);
        const u_ViewMatrix = gl.getUniformLocation(program, 'u_ViewMatrix');
        const viewMatrix = new Matrix4();
        viewMatrix.setLookAt({ x: 0.20, y: 0.25, z: 0.25 }, { x: 0, y: 0, z: 0 }, { x: 0, y: 1, z: 0 });
        //将视图矩阵传给 u_ViewMatrix 变量
        gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);
        const u_ModelMatrix = gl.getUniformLocation(program, 'u_ModelMatrix');
        const modelMatrix = new Matrix4();
        modelMatrix.setRotate(-10, 0, 0, 1); //Rotate around z-axis
        gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        //清空<canvas>
        gl.clear(gl.COLOR_BUFFER_BIT);
        //绘制三角形
        gl.drawArrays(gl.TRIANGLES, 0, n);
    });
};
function initVertexBuffers(gl, program) {
    const verticesColors = new Float32Array([
        //顶点坐标和颜色
        0.0, 0.5, -0.4, 0.4, 1.0, 0.4,
        -0.5, -0.5, -0.4, 0.4, 1.0, 0.4,
        0.5, -0.5, -0.4, 1.0, 0.4, 0.4,
        0.5, 0.4, -0.2, 1.0, 0.4, 0.4,
        -0.5, 0.4, -0.2, 1.0, 1.0, 0.4,
        0.0, -0.6, -0.2, 1.0, 1.0, 0.4,
        0.0, 0.5, 0.0, 0.4, 0.4, 1.0,
        -0.5, -0.5, 0.0, 0.4, 0.4, 1.0,
        0.5, -0.5, 0.0, 1.0, 0.4, 0.4
    ]);
    const n = 9;
    const vertexColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);
    const F_SIZE = verticesColors.BYTES_PER_ELEMENT;
    const a_Position = gl.getAttribLocation(program, 'a_Position');
    if (a_Position < 0) {
        console.log("Failed to get the storage location of a_Position");
        return -1;
    }
    //将缓冲区对象分配给 a_Position 变量
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, F_SIZE * 6, 0);
    //连接 a_Position 变量与分配给它的缓冲区对象
    gl.enableVertexAttribArray(a_Position);
    const a_Color = gl.getAttribLocation(program, 'a_Color');
    if (a_Color < 0) {
        console.log("Failed to get the storage location of a_Position");
        return -1;
    }
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, F_SIZE * 6, F_SIZE * 3);
    gl.enableVertexAttribArray(a_Color);
    gl.bindBuffer(gl.ARRAY_BUFFER, null); //取消绑定的缓冲区对象
    return n;
}
