import { initWebGL } from '../../utils/util.js';

window.onload = async () => {
    const { gl } = await initWebGL("HelloPoint1");
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.POINTS, 0, 1);
};