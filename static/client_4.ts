(function() {
const canvas = document.getElementById('challenge4_canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;
ctx.translate(canvas.width / 2, canvas.height / 2);

const angleInput = document.getElementById('challenge4_angle') as HTMLInputElement;
const gravityInput = document.getElementById('challenge4_gravity') as HTMLInputElement;
const speedInput = document.getElementById('challenge4_speed') as HTMLInputElement;
const heightInput = document.getElementById('challenge4_height') as HTMLInputElement;
const telemetry = document.getElementById('challenge4_telemetry') as HTMLInputElement;

let scale = 1;
let offsetX = 0;
let offsetY = 0;
let isDragging = false;
let startX: number, startY: number;
const curves: Map<string, { points: { x: number, y: number }[] }> = new Map();
let telemetryArray: string[] = [];

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

function calculateTrajectory(angle: number, g: number, u: number, h: number): { x: number, y: number }[] {
    const R = (u * Math.cos(angle) / g) * (u * Math.sin(angle) + Math.sqrt((u * Math.sin(angle)) ** 2 + 2 * g * h));
    const step = R / 100;
    const points: { x: number, y: number }[] = [];

    for (let x = 0; x <= R; x += step) {
        const t = x / (u * Math.cos(angle));
        const y = h + x * Math.tan(angle) - (g / (2 * u ** 2 * Math.cos(angle) ** 2)) * x ** 2;
        points.push({ x, y });
    }

    return points;
}

function drawCurve(color: string): void {
    const curve = curves.get(color);
    if (!curve) return;

    ctx.save();
    ctx.translate(offsetX, offsetY);
    ctx.scale(scale, scale);

    ctx.beginPath();
    for (let i = 0; i < curve.points.length; i++) {
        const point = curve.points[i];
        if (i === 0) {
            ctx.moveTo(point.x, -point.y);
        } else {
            ctx.lineTo(point.x, -point.y);
        }
    }
    ctx.strokeStyle = color;
    ctx.stroke();

    ctx.restore();
}

function draw(): void {
    drawAxes();
    const angle = parseFloat(angleInput.value) * Math.PI / 180;
    const g = parseFloat(gravityInput.value);
    const u = parseFloat(speedInput.value);
    const h = parseFloat(heightInput.value);

    curves.set('blue', { points: calculateTrajectory(angle, g, u, h) });

    const maxAngle = Math.asin(1 / (Math.sqrt(2 + (2 * g * h) / (u ** 2))));
    curves.set('red', { points: calculateTrajectory(maxAngle, g, u, h) });

    curves.forEach((_, color) => drawCurve(color));
    telemetry.innerHTML = telemetryArray.join('<br>');
    telemetryArray = [];
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

    curves.forEach((curve, color) => {
        const points = curve.points;

        if (points.length > 0) {
            const closestPoint = points.reduce((prev, curr) => {
                const prevDistance = Math.abs(prev.x - x);
                const currDistance = Math.abs(curr.x - x);
                return currDistance < prevDistance ? curr : prev;
            });
            ctx.beginPath();
            ctx.arc(closestPoint.x, -closestPoint.y, 2, 0, 2 * Math.PI);
            ctx.fillStyle = color;
            ctx.fill();
            telemetryArray.push(`<p1>${color}: (${Math.round(closestPoint.x * 1000) / 1000}, ${Math.round(closestPoint.y * 1000) / 1000})<p1>`);
        }
    });
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

canvas.addEventListener('mousedown', handleMouseDown);
canvas.addEventListener('mousemove', handleMouseMove);
canvas.addEventListener('mouseup', handleMouseUp);
canvas.addEventListener('wheel', handleWheel);

gravityInput.addEventListener('input', draw);
angleInput.addEventListener('input', draw);
speedInput.addEventListener('input', draw);
heightInput.addEventListener('input', draw);

draw();
})();