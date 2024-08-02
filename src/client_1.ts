const canvas = document.getElementById('challenge1_canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;
const angleInput = document.getElementById('challenge1_angle') as HTMLInputElement;
const gravityInput = document.getElementById('challenge1_gravity') as HTMLInputElement;
const speedInput = document.getElementById('challenge1_speed') as HTMLInputElement;
const heightInput = document.getElementById('challenge1_height') as HTMLInputElement;
let scale = 1;
let offsetX = 0;
let offsetY = 0;
let isDragging = false;
let startX: number, startY: number;

function drawAxes(): void {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
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
    const angle = parseFloat(angleInput.value) * (Math.PI / 180);
    const gravity = parseFloat(gravityInput.value);
    const speed = parseFloat(speedInput.value);
    const height = parseFloat(heightInput.value);
    const timeIncrement = 0.1;

    ctx.save();
    ctx.translate(offsetX, offsetY);
    ctx.scale(scale, scale);

    let t = 0;
    let x = 0;
    let y = height;
    const points: { x: number, y: number }[] = [];

    while (y >= 0) {
        x = speed * t * Math.cos(angle);
        y = height + speed * t * Math.sin(angle) - 0.5 * gravity * t * t;
        points.push({ x, y });
        t += timeIncrement;
    }

    ctx.beginPath();
    ctx.moveTo(points[0].x, -points[0].y);
    for (const point of points) {
        ctx.lineTo(point.x, -point.y);
    }
    ctx.strokeStyle = 'red';
    ctx.stroke();

    ctx.restore();
}

function draw(): void {
    drawAxes();
    drawProjectile();
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
        draw();
    }
}

function handleMouseUp(): void {
    isDragging = false;
}

function handleWheel(e: WheelEvent): void {
    e.preventDefault();
    const zoom = e.deltaY < 0 ? 1.1 : 0.9;
    scale *= zoom;
    draw();
}

angleInput.addEventListener('input', draw);
gravityInput.addEventListener('input', draw);
speedInput.addEventListener('input', draw);
heightInput.addEventListener('input', draw);

canvas.addEventListener('mousedown', handleMouseDown);
canvas.addEventListener('mousemove', handleMouseMove);
canvas.addEventListener('mouseup', handleMouseUp);
canvas.addEventListener('wheel', handleWheel);

draw();