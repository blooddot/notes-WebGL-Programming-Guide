import { initWebGL } from '../../utils/util.js';

window.onload = async () => {
    const { gl, program, canvas } = await initWebGL("ClickedPoint");

    const a_Position = gl.getAttribLocation(program, 'a_Position');
    const points: { x: number, y: number }[] = [];
    canvas.onmousedown = (ev: MouseEvent) => {
        const rect = (ev.target as HTMLCanvasElement).getBoundingClientRect();
        const x = ((ev.clientX - rect.left) - canvas.width / 2) / (canvas.width / 2);
        const y = (canvas.height / 2 - (ev.clientY - rect.top)) / (canvas.height / 2);
        points.push({ x, y });

        gl.clear(gl.COLOR_BUFFER_BIT);

        points.forEach(point => {
            gl.vertexAttrib3f(a_Position, point.x, point.y, 0.0);
            gl.drawArrays(gl.POINTS, 0, 1);
        });
    };

};