(function() {
const canvas = document.getElementById('challenge1_canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;
ctx.translate(canvas.width / 2, canvas.height / 2);
const angleInput = document.getElementById('challenge1_angle') as HTMLInputElement;
const gravityInput = document.getElementById('challenge1_gravity') as HTMLInputElement;
const speedInput = document.getElementById('challenge1_speed') as HTMLInputElement;
const heightInput = document.getElementById('challenge1_height') as HTMLInputElement;
let scale = 1;
let offsetX = 0;
let offsetY = 0;
let isDragging = false;
let startX: number, startY: number;
let points: { x: number, y: number }[] = [];

function drawAxes(): void {
    ctx.clearRect(-canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height)
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
    points = [];

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
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left - canvas.width / 2 - offsetX) / scale;
    const y = -(e.clientY - rect.top - canvas.height / 2 - offsetY) / scale;
    draw();
    ctx.save();
    ctx.translate(offsetX, offsetY);
    ctx.scale(scale, scale);
    ctx.fillStyle = 'black';

    if (points.length > 0) {
        const closestPoint = points.reduce((prev, curr) => Math.abs(curr.x - x) < Math.abs(prev.x - x) ? curr : prev);
        ctx.fillText(`(${Math.round(closestPoint.x * 1000) / 1000}, ${Math.round(closestPoint.y * 1000) / 1000}`, x, -y);

        ctx.beginPath();
        ctx.arc(closestPoint.x, -closestPoint.y, 2, 0, 2 * Math.PI);
        ctx.fillStyle = 'blue';
        ctx.fill();
    }

    ctx.restore();
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
})();