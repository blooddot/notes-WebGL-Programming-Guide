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
window.onload = () => __awaiter(void 0, void 0, void 0, function* () {
    const n = 4; //顶点数量
    const { gl, program } = yield initWebGL("TexturedQuad");
    initVertexBuffers(gl, program);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    initTexture(gl, program, n);
});
const initVertexBuffers = (gl, program) => {
    //顶点坐标，纹理坐标
    const verticesColors = new Float32Array([
        -0.5, 0.5, 0.0, 1.0,
        -0.5, -0.5, 0.0, 0.0,
        0.5, 0.5, 1.0, 1.0,
        0.5, -0.5, 1.0, 0.0,
        // -0.5, 0.5, -0.3, 1.7,
        // -0.5, -0.5, -0.3, -0.2,
        // 0.5, 0.5, 1.7, 1.7,
        // 0.5, -0.5, 1.7, -0.2
    ]);
    //创建缓冲区对象
    const vertexTexCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexTexCoordBuffer); //将缓冲区对象绑定到目标
    gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW); //向缓冲区对象写入数据
    const F_SIZE = verticesColors.BYTES_PER_ELEMENT;
    const a_Position = gl.getAttribLocation(program, 'a_Position');
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, F_SIZE * 4, 0); //将缓冲区对象分配给a_Position变量
    gl.enableVertexAttribArray(a_Position); //连接a_Position变量与分配给它的缓冲区对象
    const a_TexCoord = gl.getAttribLocation(program, 'a_TexCoord');
    gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, F_SIZE * 4, F_SIZE * 2);
    gl.enableVertexAttribArray(a_TexCoord);
};
const initTexture = (gl, program, n) => {
    const texture = gl.createTexture(); //创建纹理对象
    const u_Sampler = gl.getUniformLocation(program, 'u_Sampler'); //获取u_Sampler的存储位置
    const image = new Image(); //创建image对象
    image.onload = () => loadTexture(gl, program, n, texture, u_Sampler, image);
    image.src = '../../../resources/sky.jpg';
};
const loadTexture = (gl, program, n, texture, u_Sampler, image) => {
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); //对纹理图像进行y轴反转
    gl.activeTexture(gl.TEXTURE0); //开启0号纹理单元
    gl.bindTexture(gl.TEXTURE_2D, texture); //向target绑定纹理对象
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); //配置纹理参数
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image); //配置纹理图像
    gl.uniform1i(u_Sampler, 0); //将0号纹理传递给着色器
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, n); //绘制矩形
};
