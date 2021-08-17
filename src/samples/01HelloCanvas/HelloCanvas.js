import { getWebGLContext } from '../../libs/cuon-utils.js';
window.onload = () => {
    const canvas = document.getElementById("webgl");
    const gl = getWebGLContext(canvas);
    if (!gl) {
        console.error('Failed to get the rendering context for WebGL');
        return;
    }
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
};
