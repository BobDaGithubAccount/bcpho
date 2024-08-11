(function() {
const canvas = document.getElementById('challenge5_canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;
ctx.translate(canvas.width / 2, canvas.height / 2);
const gravityInput = document.getElementById('challenge5_gravity') as HTMLInputElement;
const fixedXInput = document.getElementById('challenge5_fixedX') as HTMLInputElement;
const fixedYInput = document.getElementById('challenge5_fixedY') as HTMLInputElement;
const heightInput = document.getElementById('challenge5_height') as HTMLInputElement;
const telemetry = document.getElementById('challenge5_telemetry') as HTMLInputElement;

let scale = 1;
let offsetX = 0;
let offsetY = 0;
let isDragging = false;
let startX: number, startY: number;

let telemetryArray: string[] = [];

const curves: Map<string, { points: { x: number, y: number }[] }> = new Map();

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

function calculateTrajectories(): void {
    calculateTrajectoriesLowHigh();
    calculateBoundingTrajectory();
    calculateMaxTrajectory();
    calculateMinTrajectory();
}

function calculateMaxTrajectory(): void {
    const g = parseFloat(gravityInput.value);
    const X = parseFloat(fixedXInput.value);
    const Y = parseFloat(fixedYInput.value);
    const h = parseFloat(heightInput.value);
    if (isNaN(g) || isNaN(X) || isNaN(Y) || isNaN(h) || X <= 0 || g <= 0) {
        console.error("Invalid input values");
        return;
    }
    const u = Math.sqrt(g * (Y + Math.sqrt((X * X) + (Y * Y))));
    const angle = Math.asin(1 / (Math.sqrt(2 + (2 * g * h) / (u ** 2))));
    const R = (u * Math.cos(angle) / g) * (u * Math.sin(angle) + Math.sqrt((u * Math.sin(angle)) ** 2 + 2 * g * h));
    const step = R / 100;
    const points: { x: number, y: number }[] = [];

    for (let x = 0; x <= R; x += step) {
        const t = x / (u * Math.cos(angle));
        const y = h + x * Math.tan(angle) - (g / (2 * u ** 2 * Math.cos(angle) ** 2)) * x ** 2;
        points.push({ x, y });
    }

    curves.set('red', { points });
}

function calculateBoundingTrajectory(): void {
    const g = parseFloat(gravityInput.value);
    const X = parseFloat(fixedXInput.value);
    const Y = parseFloat(fixedYInput.value);
    const h = parseFloat(heightInput.value);
    if (isNaN(g) || isNaN(X) || isNaN(Y) || isNaN(h) || X <= 0 || g <= 0) {
        console.error("Invalid input values");
        return;
    }
    const minSpeed = Math.sqrt(g * (Y + Math.sqrt((X * X) + (Y * Y))));
    const u2 = minSpeed * minSpeed;

    const functionPoints: { x: number, y: number }[] = [];
    const step = 0.1;
    for (let x = 0; 1 == 1; x += step) {
        const y = ((u2 / (2 * g)) - (g * x * x) / (2 * u2)) + h;
        functionPoints.push({ x, y });
        if(y < 0) break;
    }
    curves.set('pink', { points: functionPoints });
}

function calculateMinTrajectory(): void {
    const g = parseFloat(gravityInput.value);
    const X = parseFloat(fixedXInput.value);
    const Y = parseFloat(fixedYInput.value);
    const h = parseFloat(heightInput.value);
    if (isNaN(g) || isNaN(X) || isNaN(Y) || isNaN(h) || X <= 0 || g <= 0) {
        console.error("Invalid input values");
        return;
    }
    const minSpeed = Math.sqrt(g * (Y + Math.sqrt((X * X) + (Y * Y))));
    const functionPoints: { x: number, y: number }[] = [];
    const step = 0.1;
    for (let x = 0; 1 == 1; x += step) {
        const y = (x * ((Y + Math.sqrt((X * X) + (Y * Y))) / X)) - (((x*x) * Math.sqrt((X*X) + (Y*Y)))/(X*X));
        functionPoints.push({ x, y });
        if(y < 0) break;
    }
    curves.set('grey', { points: functionPoints });
}

function calculateTrajectoriesLowHigh(): void {
    const g = parseFloat(gravityInput.value);
    const X = parseFloat(fixedXInput.value);
    const Y = parseFloat(fixedYInput.value);
    const h = parseFloat(heightInput.value);

    if (isNaN(g) || isNaN(X) || isNaN(Y) || isNaN(h) || X <= 0 || g <= 0) {
        console.error("Invalid input values");
        return;
    }

    const minSpeed = Math.sqrt(g * (Y + Math.sqrt((X * X) + (Y * Y))));
    const u2 = minSpeed * minSpeed;

    const A = (g / (2 * u2)) * X * X;
    const B = -X;
    const C = Y - h + (g * X * X) / (2 * u2);

    const discriminant = (B * B) - (4 * A * C);

    if (discriminant < 0) {
        // console.error("No real solution exists for the given input values", discriminant);
        return;
    }

    const sqrtDiscriminant = Math.sqrt(discriminant);
    const tanTheta1 = (-B + sqrtDiscriminant) / (2 * A);
    const tanTheta2 = (-B - sqrtDiscriminant) / (2 * A);

    const theta1 = Math.atan(tanTheta1);
    const theta2 = Math.atan(tanTheta2);

    const lowBallPoints: { x: number, y: number }[] = [];
    const highBallPoints: { x: number, y: number }[] = [];
    const timeStep = 0.01;

    let t = 0;
    let x = 0;
    let y = h;
    let vx = minSpeed * Math.cos(theta1);
    let vy = minSpeed * Math.sin(theta1);

    while (y >= 0) {
        lowBallPoints.push({ x, y });
        t += timeStep;
        x += vx * timeStep;
        y += vy * timeStep - 0.5 * g * timeStep * timeStep;
        vy -= g * timeStep;
    }

    t = 0;
    x = 0;
    y = h;
    vx = minSpeed * Math.cos(theta2);
    vy = minSpeed * Math.sin(theta2);

    while (y >= 0) {
        highBallPoints.push({ x, y });
        t += timeStep;
        x += vx * timeStep;
        y += vy * timeStep - 0.5 * g * timeStep * timeStep;
        vy -= g * timeStep;
    }

    curves.set('green', { points: lowBallPoints });
    curves.set('blue', { points: highBallPoints });
    telemetryArray.push("Min speed: " + minSpeed.toString());
}

function drawCurve(color: string): void {
    const curve = curves.get(color);
    if (!curve || !ctx) return;

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

function drawTargetPoint(): void {
    if (!ctx) return;
    const X = parseFloat(fixedXInput.value);
    const Y = parseFloat(fixedYInput.value);

    if (isNaN(X) || isNaN(Y)) {
        console.error("Invalid input values");
        return;
    }

    ctx.save();
    ctx.translate(offsetX, offsetY);
    ctx.scale(scale, scale);

    ctx.beginPath();
    ctx.arc(X, -Y, 5, 0, 2 * Math.PI);
    ctx.fillStyle = 'red';
    ctx.fill();

    ctx.restore();
}

function draw(): void {
    calculateTrajectories();
    drawAxes();
    curves.forEach((_, color) => drawCurve(color));
    drawTargetPoint();
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

gravityInput.addEventListener('input', draw);
fixedXInput.addEventListener('input', draw);
fixedYInput.addEventListener('input', draw);
heightInput.addEventListener('input', draw);

canvas.addEventListener('mousedown', handleMouseDown);
canvas.addEventListener('mousemove', handleMouseMove);
canvas.addEventListener('mouseup', handleMouseUp);
canvas.addEventListener('wheel', handleWheel);

draw();
})();