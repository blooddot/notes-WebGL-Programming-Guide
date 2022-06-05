/**
 * @author hong.guo
 * @description 
 */
import { getWebGLContext } from '../../../libs/cuon/cuon-utils.js';

window.onload = () => {
    const canvas = document.getElementById("webgl") as HTMLCanvasElement;// 获取<canvas>元素
    const gl = getWebGLContext(canvas);//获取绘制二维图形的绘图上下文
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
};