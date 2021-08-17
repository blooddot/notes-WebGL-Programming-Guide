import { initWebGL } from '../../utils/util.js';

window.onload = async () => {
    const { gl, program } = await initWebGL("HelloPoint2");

    const a_Position = gl.getAttribLocation(program, 'a_Position');
    gl.vertexAttrib3f(a_Position, 0.0, 0.0, 0.0);

    const a_PointSize = gl.getAttribLocation(program, 'a_PointSize');
    gl.vertexAttrib1f(a_PointSize, 10.0);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.POINTS, 0, 1);
};