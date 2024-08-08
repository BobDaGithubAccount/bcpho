"use strict";
(function () {
    const canvas = document.getElementById('challenge4_canvas');
    const ctx = canvas.getContext('2d');
    ctx.translate(canvas.width / 2, canvas.height / 2);
    const angleInput = document.getElementById('challenge4_angle');
    const gravityInput = document.getElementById('challenge4_gravity');
    const speedInput = document.getElementById('challenge4_speed');
    const heightInput = document.getElementById('challenge4_height');
    const telemetry = document.getElementById('challenge4_telemetry');
    let scale = 1;
    let offsetX = 0;
    let offsetY = 0;
    let isDragging = false;
    let startX, startY;
    const curves = new Map();
    let telemetryArray = [];
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
    function calculateTrajectory(angle, g, u, h) {
        const R = (u * Math.cos(angle) / g) * (u * Math.sin(angle) + Math.sqrt(Math.pow((u * Math.sin(angle)), 2) + 2 * g * h));
        const step = R / 100;
        const points = [];
        for (let x = 0; x <= R; x += step) {
            const t = x / (u * Math.cos(angle));
            const y = h + x * Math.tan(angle) - (g / (2 * Math.pow(u, 2) * Math.pow(Math.cos(angle), 2))) * Math.pow(x, 2);
            points.push({ x, y });
        }
        return points;
    }
    function drawCurve(color) {
        const curve = curves.get(color);
        if (!curve)
            return;
        ctx.save();
        ctx.translate(offsetX, offsetY);
        ctx.scale(scale, scale);
        ctx.beginPath();
        for (let i = 0; i < curve.points.length; i++) {
            const point = curve.points[i];
            if (i === 0) {
                ctx.moveTo(point.x, -point.y);
            }
            else {
                ctx.lineTo(point.x, -point.y);
            }
        }
        ctx.strokeStyle = color;
        ctx.stroke();
        ctx.restore();
    }
    function draw() {
        drawAxes();
        const angle = parseFloat(angleInput.value) * Math.PI / 180;
        const g = parseFloat(gravityInput.value);
        const u = parseFloat(speedInput.value);
        const h = parseFloat(heightInput.value);
        curves.set('blue', { points: calculateTrajectory(angle, g, u, h) });
        const maxAngle = Math.asin(1 / (Math.sqrt(2 + (2 * g * h) / (Math.pow(u, 2)))));
        curves.set('red', { points: calculateTrajectory(maxAngle, g, u, h) });
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
