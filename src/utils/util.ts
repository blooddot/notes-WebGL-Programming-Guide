import { getWebGLContext, initShaders } from '../libs/cuon-utils.js';

export const loadFile = async (url: string): Promise<string> => {
    const content = await fetch(url).then(response => response.text());

    return content;
};

export const loadJson = async (url: string): Promise<Record<string, unknown>> => {
    const obj = await fetch(url).then(response => response.json());

    return obj;
};

export const loadGLSL = async (name: string): Promise<{ vertex: string, fragment: string }> => {
    const promises = [
        loadFile(`${name}.vs`),
        loadFile(`${name}.fs`),
    ];

    const [vertex, fragment] = await Promise.all(promises);
    return { vertex, fragment };
};

export const initWebGL = async (name: string, offsetWidth: number = 0, offsetHeight: number = 0) => {
    const { vertex, fragment } = await loadGLSL(name);

    const canvas = document.getElementById("webgl") as HTMLCanvasElement;
    canvas.setAttribute("width", (document.body.clientWidth + offsetWidth).toString());
    canvas.setAttribute("height", (document.body.clientHeight + offsetHeight).toString());

    const gl = getWebGLContext(canvas);
    if (!gl) {
        console.error('Failed to get the rendering context for WebGL');
        return null;
    }

    const program = initShaders(gl, vertex, fragment);
    if (!program) {
        console.error('Failed to initialize shaders.');
        return null;
    }

    return { gl, program, canvas };
};