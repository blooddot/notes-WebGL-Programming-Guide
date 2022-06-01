import { getWebGLContext, initShaders } from '../../../libs/cuon/cuon-utils.js';
import { loadGLSL } from '../../utils/util.js';

window.onload = async () => {
    const { vertex, fragment } = await loadGLSL("HelloPoint1");

    const canvas = document.getElementById("webgl") as HTMLCanvasElement;
    canvas.setAttribute("width", document.body.clientWidth.toString());
    canvas.setAttribute("height", document.body.clientHeight.toString());

    const gl = getWebGLContext(canvas);
    if (!gl) {
        console.error('Failed to get the rendering context for WebGL');
        return;
    }

    const program = initShaders(gl, vertex, fragment);
    if (!program) {
        console.error('Failed to initialize shaders.');
        return;
    }

    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.POINTS, 0, 1);
};