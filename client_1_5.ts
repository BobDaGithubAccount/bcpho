(function() {
const canvas = document.getElementById('challenge1.5_canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;
ctx.translate(canvas.width / 2, canvas.height / 2);

const angleInput = document.getElementById('challenge1.5_angle') as HTMLInputElement;
const gravityInput = document.getElementById('challenge1.5_gravity') as HTMLInputElement;
const speedInput = document.getElementById('challenge1.5_speed') as HTMLInputElement;
const heightInput = document.getElementById('challenge1.5_height') as HTMLInputElement;
const startButton = document.getElementById('challenge1.5_startSimulation') as HTMLButtonElement;

let scale = 1;
let offsetX = 0;
let offsetY = 0;
let isDragging = false;
let startX: number, startY: number;

let g: number;
const m = 1;
let t = 0;
const dt = 0.01;
let x: number;
let y: number;
let vx: number;
let vy: number;
const positions: { x: number, y: number }[] = [];
let isAnimating = false;

function drawAxes(): void {
    ctx.clearRect(-canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(offsetX, offsetY);
    ctx.scale(scale, scale);

    ctx.beginPath();
    ctx.moveTo(-canvas.width, 0);
    ctx.lineTo(canvas.width, 0);
    ctx.strokeStyle = 'black';
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, -canvas.height);
    ctx.lineTo(0, canvas.height);
    ctx.strokeStyle = 'black';
    ctx.stroke();

    ctx.restore();
}

function drawProjectile(): void {
    ctx.save();
    ctx.translate(offsetX, offsetY);
    ctx.scale(scale, scale);

    ctx.beginPath();
    ctx.moveTo(positions[0]?.x ?? 0, -(positions[0]?.y ?? 0));
    for (const point of positions) {
        ctx.lineTo(point.x, -point.y);
    }
    ctx.strokeStyle = 'red';
    ctx.stroke();

    ctx.restore();
}

function eulerLagrange(): void {
    if (!isAnimating) return;
    const ax = 0;
    const ay = -g;

    vx += ax * dt;
    vy += ay * dt;

    x += vx * dt;
    y += vy * dt;

    positions.push({ x, y });

    if (y < 0) {
        isAnimating = false;
    }
}

function animate(): void {
    eulerLagrange();
    drawAxes();
    drawProjectile();
    if (isAnimating) {
        requestAnimationFrame(animate);
    }
}

function startSimulation(): void {
    g = parseFloat(gravityInput.value);
    x = 0;
    y = parseFloat(heightInput.value);
    vx = parseFloat(speedInput.value) * Math.cos(parseFloat(angleInput.value) * Math.PI / 180);
    vy = parseFloat(speedInput.value) * Math.sin(parseFloat(angleInput.value) * Math.PI / 180);
    positions.length = 0;
    isAnimating = true;
    animate();
}

function handleMouseDown(e: MouseEvent): void {
    isDragging = true;
    startX = e.clientX - offsetX;
    startY = e.clientY - offsetY;
}

function handleMouseMove(e: MouseEvent): void {
    if (isDragging) {
        offsetX = e.clientX - startX;
        offsetY = e.clientY - startY;
        drawAxes();
        drawProjectile();
    }

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left - canvas.width / 2 - offsetX) / scale;
    const y = -(e.clientY - rect.top - canvas.height / 2 - offsetY) / scale;

    drawAxes();
    drawProjectile();

    ctx.save();
    ctx.translate(offsetX, offsetY);
    ctx.scale(scale, scale);
    ctx.fillStyle = 'black';

    const closestPoint = positions.reduce((prev, curr) =>
        Math.abs(curr.x - x) < Math.abs(prev.x - x) ? curr : prev
    );

    ctx.fillText(`(${Math.round(closestPoint.x * 1000) / 1000}, ${Math.round(closestPoint.y * 1000) / 1000})`, x, -y);

    ctx.beginPath();
    ctx.arc(closestPoint.x, -closestPoint.y, 2, 0, 2 * Math.PI);
    ctx.fillStyle = 'blue';
    ctx.fill();

    ctx.restore();
}

function handleMouseUp(): void {
    isDragging = false;
}

function handleWheel(e: WheelEvent): void {
    e.preventDefault();
    const zoom = e.deltaY < 0 ? 1.1 : 0.9;
    scale *= zoom;
    drawAxes();
    drawProjectile();
}

angleInput.addEventListener('input', drawProjectile);
gravityInput.addEventListener('input', drawProjectile);
speedInput.addEventListener('input', drawProjectile);
heightInput.addEventListener('input', drawProjectile);

canvas.addEventListener('mousedown', handleMouseDown);
canvas.addEventListener('mousemove', handleMouseMove);
canvas.addEventListener('mouseup', handleMouseUp);
canvas.addEventListener('wheel', handleWheel);

startButton.addEventListener('click', startSimulation);

drawAxes();
})();