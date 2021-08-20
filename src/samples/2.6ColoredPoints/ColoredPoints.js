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
    const { gl, program, canvas } = yield initWebGL("ColoredPoints");
    const a_Position = gl.getAttribLocation(program, 'a_Position');
    const u_FragColor = gl.getUniformLocation(program, 'u_FragColor');
    const points = [];
    canvas.onmousedown = (ev) => {
        const rect = ev.target.getBoundingClientRect();
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
});
const getColor = (x, y) => {
    if (x >= 0.0 && y >= 0.0)
        return [1.0, 0.0, 0.0, 1.0];
    if (x < 0.0 && y < 0.0)
        return [0.0, 1.0, 0.0, 1.0];
    return [1.0, 1.0, 1.0, 1.0];
};
