(function() {
const canvas = document.getElementById('challenge8_canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;
ctx.translate(canvas.width / 2, canvas.height / 2);
const gravityInput = document.getElementById('challenge8_gravity') as HTMLInputElement;
const heightInput = document.getElementById('challenge8_height') as HTMLInputElement;
const speedInput = document.getElementById('challenge8_speed') as HTMLInputElement;
const telemetry = document.getElementById('challenge8_telemetry') as HTMLInputElement;
const corInput = document.getElementById('challenge8_cor') as HTMLInputElement;
const bounceInput = document.getElementById('challenge8_bounces') as HTMLInputElement;
const angleInput = document.getElementById('challenge8_angle') as HTMLInputElement;
const modeInput = document.getElementById('challenge8_mode') as HTMLInputElement;

let scale: number = 1;
let offsetX: number = 0;
let offsetY: number = 0;
let isDragging: boolean = false;
let startX: number, startY: number;

let telemetryArray: string[] = [];
let sfx: number = 1;
let sfy: number = 1;
const curve: { points: { x: number, y: number }[] } = { points: [] };
let animationFrameId: number | null = null;

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

function calculateTrajectory(): { x: number, y: number }[] {
    const g = parseFloat(gravityInput.value);
    const h = parseFloat(heightInput.value);
    const u = parseFloat(speedInput.value);
    const restitution = parseFloat(corInput.value);
    const maxBounces = parseInt(bounceInput.value);
    const angle = parseFloat(angleInput.value) * (Math.PI / 180);
    const timeStep = 0.01;
    const points: { x: number, y: number }[] = [];
    let vx = u * Math.cos(angle);
    let vy = u * Math.sin(angle);
    let x = 0;
    let y = h;
    let bounceCount = 0;

    while (bounceCount <= maxBounces) {
        x += vx * timeStep * sfx;
        y += vy * timeStep * sfy;
        vy -= g * timeStep;

        if (y <= 0) {
            y = 0;
            vy = -vy * restitution;
            bounceCount++;
        }

        points.push({ x, y });

        if (y < -canvas.height / 2) {
            break;
        }
    }

    return points;
}

function drawCurve(): void {
    if (!ctx) return;

    ctx.save();
    ctx.translate(offsetX, offsetY);
    ctx.scale(scale, scale);

    ctx.beginPath();
    let arcLength = 0;

    for (let i = 0; i < curve.points.length; i++) {
        const point = curve.points[i];
        if (i === 0) {
            ctx.moveTo(point.x, -point.y);
        } else {
            const prevPoint = curve.points[i - 1];
            const dx = point.x - prevPoint.x;
            const dy = point.y - prevPoint.y;
            arcLength += Math.sqrt(dx * dx + dy * dy);
            ctx.lineTo(point.x, -point.y);
        }
    }
    ctx.strokeStyle = 'blue';
    ctx.stroke();

    ctx.restore();
    telemetryArray.push(`<p1>Blue Arc Length: ${Math.round(arcLength * 1000) / 1000}<p1>`);
}

function draw(): void {
    curve.points = calculateTrajectory();
    drawAxes();
    drawCurve();
    telemetry.innerHTML = telemetryArray.join('<br>');
    telemetryArray = [];
}

function animate(): void {
    if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
    }

    const points = calculateTrajectory();
    let index = 0;

    function step() {
        if (index < points.length) {
            ctx.clearRect(-canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
            drawAxes();
            ctx.save();
            ctx.translate(offsetX, offsetY);
            ctx.scale(scale, scale);

            ctx.beginPath();
            for (let i = 0; i <= index; i++) {
                const point = points[i];
                if (i === 0) {
                    ctx.moveTo(point.x, -point.y);
                } else {
                    ctx.lineTo(point.x, -point.y);
                }
            }
            ctx.strokeStyle = 'blue';
            ctx.stroke();
            ctx.restore();

            index++;
            animationFrameId = requestAnimationFrame(step);
        } else {
            telemetry.innerHTML = telemetryArray.join('<br>');
            telemetryArray = [];
        }
    }

    step();
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

    const points = curve.points;

    if (points.length > 0) {
        const closestPoint = points.reduce((prev, curr) => {
            const prevDistance = Math.abs(prev.x - x);
            const currDistance = Math.abs(curr.x - x);
            return currDistance < prevDistance ? curr : prev;
        });
        ctx.beginPath();
        ctx.arc(closestPoint.x, -closestPoint.y, 2, 0, 2 * Math.PI);
        ctx.fillStyle = 'blue';
        ctx.fill();
        telemetryArray.push(`<p1>Blue: (${Math.round(closestPoint.x * 1000) / 1000}, ${Math.round(closestPoint.y * 1000) / 1000})<p1>`);
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

function handleModeChange(): void {
    if (modeInput.value === 'animation') {
        animate();
    } else {
        draw();
    }
}

gravityInput.addEventListener('input', handleModeChange);
heightInput.addEventListener('input', handleModeChange);
speedInput.addEventListener('input', handleModeChange);
corInput.addEventListener('input', handleModeChange);
bounceInput.addEventListener('input', handleModeChange);
modeInput.addEventListener('input', handleModeChange);

canvas.addEventListener('mousedown', handleMouseDown);
canvas.addEventListener('mousemove', handleMouseMove);
canvas.addEventListener('mouseup', handleMouseUp);
canvas.addEventListener('wheel', handleWheel);

handleModeChange();
})();