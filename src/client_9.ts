(function() {
const canvas = document.getElementById('challenge9_canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;
ctx.translate(canvas.width / 2, canvas.height / 2);
const gravityInput = document.getElementById('challenge9_gravity') as HTMLInputElement;
const heightInput = document.getElementById('challenge9_height') as HTMLInputElement;
const speedInput = document.getElementById('challenge9_speed') as HTMLInputElement;
const angleInput = document.getElementById('challenge9_angle') as HTMLInputElement;
const dragCoefficientInput = document.getElementById('challenge9_dragCoefficient') as HTMLInputElement;
const airDensityInput = document.getElementById('challenge9_airDensity') as HTMLInputElement;
const areaInput = document.getElementById('challenge9_area') as HTMLInputElement;
const massInput = document.getElementById('challenge9_mass') as HTMLInputElement;
const corInput = document.getElementById('challenge9_cor') as HTMLInputElement;
const bounceInput = document.getElementById('challenge9_bounces') as HTMLInputElement;
const modeInput = document.getElementById('challenge9_mode') as HTMLInputElement;
const telemetry = document.getElementById('challenge9_telemetry') as HTMLInputElement;

let scale: number = 1;
let offsetX: number = 0;
let offsetY: number = 0;
let isDragging: boolean = false;
let startX: number, startY: number;

const draglessCurve: { points: { x: number, y: number }[] } = { points: [] };
const dragCurve: { points: { x: number, y: number }[] } = { points: [] };
let animationFrameId: number | null = null;
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

function calculateTrajectory(withDrag: boolean): { x: number, y: number }[] {
    const g = parseFloat(gravityInput.value);
    const h = parseFloat(heightInput.value);
    const u = parseFloat(speedInput.value);
    const angle = parseFloat(angleInput.value) * (Math.PI / 180);
    const dragCoefficient = parseFloat(dragCoefficientInput.value);
    const airDensity = parseFloat(airDensityInput.value);
    const area = parseFloat(areaInput.value);
    const mass = parseFloat(massInput.value);
    const restitution = parseFloat(corInput.value);
    const maxBounces = parseInt(bounceInput.value);
    const timeStep = 0.01;
    const points: { x: number, y: number }[] = [];
    let vx = u * Math.cos(angle);
    let vy = u * Math.sin(angle);
    let x = 0;
    let y = h;
    let bounceCount = 0;

    if (g === 0 || u === 0 || isNaN(g) || isNaN(u)) {
        console.error("Invalid input values: gravity or speed cannot be zero or NaN");
        return points;
    }

    while (bounceCount <= maxBounces) {
        if (withDrag) {
            const v = Math.sqrt(vx * vx + vy * vy);
            const dragForce = 0.5 * airDensity * v * v * dragCoefficient * area;
            const dragAx = (dragForce / mass) * (vx / v);
            const dragAy = (dragForce / mass) * (vy / v);

            vx -= dragAx * timeStep;
            vy -= dragAy * timeStep;
        }

        vy -= g * timeStep;

        x += vx * timeStep;
        y += vy * timeStep;

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

function drawCurve(curve: { points: { x: number, y: number }[] }, color: string): void {
    if (!ctx) return;

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
    telemetry.innerHTML = telemetryArray.join('<br>');
    draglessCurve.points = calculateTrajectory(false);
    dragCurve.points = calculateTrajectory(true);
    drawAxes();
    drawCurve(draglessCurve, 'blue');
    drawCurve(dragCurve, 'red');
    telemetryArray = [];
}

function animate(): void {
    if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
    }

    const draglessPoints = calculateTrajectory(false);
    const dragPoints = calculateTrajectory(true);
    let index = 0;

    function step() {
        if (index < draglessPoints.length || index < dragPoints.length) {
            ctx.clearRect(-canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
            drawAxes();
            ctx.save();
            ctx.translate(offsetX, offsetY);
            ctx.scale(scale, scale);

            ctx.beginPath();
            for (let i = 0; i <= index && i < draglessPoints.length; i++) {
                const point = draglessPoints[i];
                if (i === 0) {
                    ctx.moveTo(point.x, -point.y);
                } else {
                    ctx.lineTo(point.x, -point.y);
                }
            }
            ctx.strokeStyle = 'blue';
            ctx.stroke();

            ctx.beginPath();
            for (let i = 0; i <= index && i < dragPoints.length; i++) {
                const point = dragPoints[i];
                if (i === 0) {
                    ctx.moveTo(point.x, -point.y);
                } else {
                    ctx.lineTo(point.x, -point.y);
                }
            }
            ctx.strokeStyle = 'red';
            ctx.stroke();

            ctx.restore();

            index++;
            animationFrameId = requestAnimationFrame(step);
        } else {
            animationFrameId = null;
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

    const nearestDraglessPoint = draglessCurve.points.reduce((nearestPoint, point) => {
        const distance = Math.abs(point.x - x);
        if (distance < Math.abs(nearestPoint.x - x)) {
            return point;
        }
        return nearestPoint;
    }, draglessCurve.points[0]);

    const nearestDragPoint = dragCurve.points.reduce((nearestPoint, point) => {
        const distance = Math.abs(point.x - x);
        if (distance < Math.abs(nearestPoint.x - x)) {
            return point;
        }
        return nearestPoint;
    }, dragCurve.points[0]);

    ctx.beginPath();
    ctx.arc(nearestDraglessPoint.x, -nearestDraglessPoint.y, 2, 0, 2 * Math.PI);
    ctx.fillStyle = 'blue';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(nearestDragPoint.x, -nearestDragPoint.y, 2, 0, 2 * Math.PI);
    ctx.fillStyle = 'red';
    ctx.fill();

    ctx.restore();

    telemetryArray.push(`<p1>Dragless (BLUE): x=${nearestDraglessPoint.x}, y=${nearestDraglessPoint.y}</p1>`);
    telemetryArray.push(`<p1>Drag (RED): x=${nearestDragPoint.x}, y=${nearestDragPoint.y}</p1>`);
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
angleInput.addEventListener('input', handleModeChange);
modeInput.addEventListener('input', handleModeChange);

canvas.addEventListener('mousedown', handleMouseDown);
canvas.addEventListener('mousemove', handleMouseMove);
canvas.addEventListener('mouseup', handleMouseUp);
canvas.addEventListener('wheel', handleWheel);

handleModeChange();
})();