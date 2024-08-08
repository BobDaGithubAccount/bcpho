"use strict";
(function () {
    const canvas = document.getElementById('challenge7_canvas');
    const ctx = canvas.getContext('2d');
    ctx.translate(canvas.width / 2, canvas.height / 2);
    const gravityInput = document.getElementById('challenge7_gravity');
    const heightInput = document.getElementById('challenge7_height');
    const speedInput = document.getElementById('challenge7_speed');
    const modeInput = document.getElementById('challenge7_mode');
    const sfInputX = document.getElementById('challenge7_sfx');
    const sfInputY = document.getElementById('challenge7_sfy');
    const telemetry = document.getElementById('challenge7_telemetry');
    let scale = 1;
    let offsetX = 0;
    let offsetY = 0;
    let isDragging = false;
    let startX, startY;
    let telemetryArray = [];
    let mode = 0;
    let sfx = 1;
    let sfy = 1;
    const curves = new Map();
    function drawAxes() {
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
    function calculateTrajectories() {
        let g = parseFloat(gravityInput.value);
        let h = parseFloat(heightInput.value);
        let u = parseFloat(speedInput.value);
        let colourArray = new Map();
        colourArray.set('blue', 30);
        colourArray.set('green', 45);
        colourArray.set('red', 60);
        colourArray.set('cyan', 70.5);
        colourArray.set('magenta', 78);
        colourArray.set('yellow', 85);
        colourArray.set('black', 15);
        colourArray.set('white', 0);
        colourArray.forEach((angle, colour) => {
            curves.set(colour, { points: calculateTrajectory(angle, g, u, h) });
        });
    }
    function calculateTrajectory(rawAngle, g, u, h) {
        if (mode === 1) {
            const angle = (rawAngle * Math.PI) / 180;
            const R = (u * Math.cos(angle) / g) * (u * Math.sin(angle) + Math.sqrt(Math.pow((u * Math.sin(angle)), 2) + 2 * g * h));
            const step = R / 100; // 100 steps for the trajectory
            let points = [];
            for (let x = 0; x <= R; x += step) {
                const t = x / (u * Math.cos(angle));
                const y = h + x * Math.tan(angle) - (g / (2 * Math.pow(u, 2) * Math.pow(Math.cos(angle), 2))) * Math.pow(x, 2);
                points.push({ x, y });
            }
            return points;
        }
        else if (mode === 0) {
            const angle = (rawAngle * Math.PI) / 180;
            let totalTime = (2 * u * Math.sin(angle)) / g;
            let timeSteps = 100;
            let timeStep = (totalTime / timeSteps);
            let time = 0;
            let timePoints = [];
            for (let t = 0; t < timeSteps * sfx; t += 1) {
                let x = time * sfx;
                let y = Math.sqrt((u * u * t * t) - (g * t * t * t * u * Math.sin(angle)) + (0.25 * g * g * t * t * t * t));
                if (y > 500) {
                    break;
                }
                y = y / sfy;
                timePoints.push({ x, y });
                time = time + timeStep;
            }
            return timePoints;
        }
        else {
            return [];
        }
    }
    function drawCurve(color) {
        const curve = curves.get(color);
        if (!curve || !ctx)
            return;
        ctx.save();
        ctx.translate(offsetX, offsetY);
        ctx.scale(scale, scale);
        ctx.beginPath();
        let arcLength = 0;
        //Numerical integration of arc length
        for (let i = 0; i < curve.points.length; i++) {
            const point = curve.points[i];
            if (i === 0) {
                ctx.moveTo(point.x, -point.y);
            }
            else {
                const prevPoint = curve.points[i - 1];
                const dx = point.x - prevPoint.x;
                const dy = point.y - prevPoint.y;
                arcLength += Math.sqrt(dx * dx + dy * dy);
                ctx.lineTo(point.x, -point.y);
            }
        }
        ctx.strokeStyle = color;
        ctx.stroke();
        ctx.restore();
        telemetryArray.push(`<p1>${color} Arc Length: ${Math.round(arcLength * 1000) / 1000}<p1>`);
    }
    function draw() {
        mode = parseInt(modeInput.value, 10);
        sfx = parseInt(sfInputX.value);
        sfy = parseInt(sfInputY.value);
        calculateTrajectories();
        drawAxes();
        curves.forEach((_, color) => drawCurve(color));
        telemetry.innerHTML = telemetryArray.join('<br>');
        telemetryArray = [];
    }
    function handleMouseDown(e) {
        isDragging = true;
        startX = e.clientX - offsetX;
        startY = e.clientY - offsetY;
    }
    function handleMouseMove(e) {
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
    function handleMouseUp() {
        isDragging = false;
    }
    function handleWheel(e) {
        e.preventDefault();
        const zoom = e.deltaY < 0 ? 1.1 : 0.9;
        scale *= zoom;
        draw();
    }
    gravityInput.addEventListener('input', draw);
    heightInput.addEventListener('input', draw);
    speedInput.addEventListener('input', draw);
    modeInput.addEventListener('input', draw);
    sfInputX.addEventListener('input', draw);
    sfInputY.addEventListener('input', draw);
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('wheel', handleWheel);
    draw();
})();
