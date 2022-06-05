window.onload = () => {
    const canvas = document.getElementById('example') as HTMLCanvasElement;// 获取<canvas>元素
    const ctx = canvas.getContext('2d');    //获取绘制二维图形的绘图上下文
    ctx.fillStyle = 'rgba(0, 0, 255, 1.0)'; //设置填充颜色为蓝色
    ctx.fillRect(120, 10, 150, 150);    //绘制矩形
};