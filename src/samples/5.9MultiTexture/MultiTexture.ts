import { initWebGL } from '../../utils/util.js';

window.onload = async () => {
    const n = 4;//顶点数量

    const { gl, program } = await initWebGL("MultiTexture");

    initVertexBuffers(gl, program);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    initTextures(gl, program, n);
};

const initVertexBuffers = (gl: WebGLRenderingContext, program: WebGLProgram) => {
    //顶点坐标，纹理坐标
    const verticesColors = new Float32Array([
        -0.5, 0.5, 0.0, 1.0,
        -0.5, -0.5, 0.0, 0.0,
        0.5, 0.5, 1.0, 1.0,
        0.5, -0.5, 1.0, 0.0,
    ]);

    //创建缓冲区对象
    const vertexTexCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexTexCoordBuffer);    //将缓冲区对象绑定到目标
    gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);    //向缓冲区对象写入数据

    const F_SIZE = verticesColors.BYTES_PER_ELEMENT;
    const a_Position = gl.getAttribLocation(program, 'a_Position');
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, F_SIZE * 4, 0);    //将缓冲区对象分配给a_Position变量
    gl.enableVertexAttribArray(a_Position);    //连接a_Position变量与分配给它的缓冲区对象

    const a_TexCoord = gl.getAttribLocation(program, 'a_TexCoord');
    gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, F_SIZE * 4, F_SIZE * 2);
    gl.enableVertexAttribArray(a_TexCoord);
};

const initTextures = (gl: WebGLRenderingContext, program: WebGLProgram, n: number) => {
    const imageInfos = [
        ['u_Sampler0', '../../../resources/sky.jpg'],
        ['u_Sampler1', '../../../resources/circle.gif']
    ];
    const counts = new Array(imageInfos.length).fill(0);
    imageInfos.forEach(([uniformName, imageSrc], index) => initTexture(
        { gl, program, n },
        { uniformName, imageSrc, counts, index }
    ));
};

const initTexture = (glOptions: IGlOptions, imageOptions: ImageOptions) => {
    const { gl } = glOptions;
    const { imageSrc } = imageOptions;
    const texture = gl.createTexture(); //创建纹理对象
    const image = new Image();  //创建image对象
    image.onload = () => loadTexture(glOptions, { ...imageOptions, texture, image });
    image.src = imageSrc;
};

const loadTexture = (glOptions: IGlOptions, imageOptions: ImageOptions) => {
    const { gl, program, n } = glOptions;
    const { uniformName, counts, index, texture, image } = imageOptions;
    counts.length--;

    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);  //对纹理图像进行y轴反转

    gl.activeTexture(gl["TEXTURE" + index]);
    gl.bindTexture(gl.TEXTURE_2D, texture); //向target绑定纹理对象
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);  //配置纹理参数
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);   //配置纹理图像

    const u_Sampler = gl.getUniformLocation(program, uniformName);//获取u_Sampler的存储位置
    gl.uniform1i(u_Sampler, index); //将0号纹理传递给着色器

    gl.clear(gl.COLOR_BUFFER_BIT);
    if (counts.length <= 0) {
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);//绘制矩形
    }
};

interface IGlOptions {
    gl: WebGLRenderingContext,
    program: WebGLProgram,
    n: number
}

interface ImageOptions {
    uniformName: string,
    imageSrc: string,
    counts: number[],
    index: number,
    texture?: WebGLTexture,
    image?: HTMLImageElement
}