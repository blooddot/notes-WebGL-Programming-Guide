import { initWebGL } from '../../utils/util.js';

window.onload = async () => {
    const { gl, program, canvas } = await initWebGL("ColoredPoints");

    const a_Position = gl.getAttribLocation(program, 'a_Position');
    const u_FragColor = gl.getUniformLocation(program, 'u_FragColor');

    const points: { x: number, y: number, color: [number, number, number, number] }[] = [];
    canvas.onmousedown = (ev: MouseEvent) => {
        const rect = (ev.target as HTMLCanvasElement).getBoundingClientRect();
        const x = ((ev.clientX - rect.left) - canvas.width / 2) / (canvas.width / 2);
        const y = (canvas.height / 2 - (ev.clientY - rect.top)) / (canvas.height / 2);
        const color = getColor(x, y);
        points.push({ x, y, color });

        gl.clear(gl.COLOR_BUFFER_BIT);

        points.forEach(point => {
            gl.vertexAttrib3f(a_Position, point.x, point.y, 0.0);
            gl.uniform4f(u_FragColor, ...point.color);
            gl.drawArrays(gl.POINTS, 0, 1);
        });
    };

};

const getColor = (x: number, y: number): [number, number, number, number] => {
    if (x >= 0.0 && y >= 0.0) return [1.0, 0.0, 0.0, 1.0];
    if (x < 0.0 && y < 0.0) return [0.0, 1.0, 0.0, 1.0];

    return [1.0, 1.0, 1.0, 1.0];
};