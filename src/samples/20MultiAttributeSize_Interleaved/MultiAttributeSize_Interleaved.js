var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { initWebGL } from '../../utils/util.js';
const n = 3;
window.onload = () => __awaiter(void 0, void 0, void 0, function* () {
    const { gl, program } = yield initWebGL("MultiAttributeSize_Interleaved");
    initVertexBuffers(gl, program);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.POINTS, 0, n);
});
const initVertexBuffers = (gl, program) => {
    //顶点坐标和点的尺寸
    const verticesSizes = new Float32Array([
        0.0, 0.5, 10.0,
        -0.5, -0.5, 20.0,
        0.5, -0.5, 30.0
    ]);
    //创建缓冲区对象
    const vertexBuffer = gl.createBuffer();
    //将缓冲区对象绑定到目标
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    //向缓冲区对象写入数据
    gl.bufferData(gl.ARRAY_BUFFER, verticesSizes, gl.STATIC_DRAW);
    const F_SIZE = verticesSizes.BYTES_PER_ELEMENT;
    const a_Position = gl.getAttribLocation(program, 'a_Position');
    //将缓冲区对象分配给a_Position变量
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, F_SIZE * 3, 0);
    //连接a_Position变量与分配给它的缓冲区对象
    gl.enableVertexAttribArray(a_Position);
    const a_PointSize = gl.getAttribLocation(program, 'a_PointSize');
    gl.vertexAttribPointer(a_PointSize, 1, gl.FLOAT, false, F_SIZE * 3, F_SIZE * 2);
    gl.enableVertexAttribArray(a_PointSize);
};
