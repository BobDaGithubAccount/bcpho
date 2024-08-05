"use strict";
(function () {
    const canvas = document.getElementById('challenge4_canvas');
    const ctx = canvas.getContext('2d');
    ctx.translate(canvas.width / 2, canvas.height / 2);
    const angleInput = document.getElementById('challenge4_angle');
    const gravityInput = document.getElementById('challenge4_gravity');
    const speedInput = document.getElementById('challenge4_speed');
    const heightInput = document.getElementById('challenge4_height');
    let scale = 1;
    let offsetX = 0;
    let offsetY = 0;
    let isDragging = false;
    let startX, startY;
    let points = [];
    let maxRangePoints = [];
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
    function calculateTrajectory() {
        const angle = parseFloat(angleInput.value) * Math.PI / 180;
        const g = parseFloat(gravityInput.value);
        const u = parseFloat(speedInput.value);
        const h = parseFloat(heightInput.value);
        const R = (u * Math.cos(angle) / g) * (u * Math.sin(angle) + Math.sqrt(Math.pow((u * Math.sin(angle)), 2) + 2 * g * h));
        const step = R / 100;
        points = [];
        for (let x = 0; x <= R; x += step) {
            const t = x / (u * Math.cos(angle));
            const y = h + x * Math.tan(angle) - (g / (2 * Math.pow(u, 2) * Math.pow(Math.cos(angle), 2))) * Math.pow(x, 2);
            points.push({ x, y });
        }
    }
    function drawProjectile() {
        ctx.save();
        ctx.translate(offsetX, offsetY);
        ctx.scale(scale, scale);
        ctx.beginPath();
        for (let i = 0; i < points.length; i++) {
            const point = points[i];
            if (i === 0) {
                ctx.moveTo(point.x, -point.y);
            }
            else {
                ctx.lineTo(point.x, -point.y);
            }
        }
        ctx.strokeStyle = 'blue';
        ctx.stroke();
        ctx.restore();
    }
    function calculateMaxTrajectory() {
        const g = parseFloat(gravityInput.value);
        const u = parseFloat(speedInput.value);
        const h = parseFloat(heightInput.value);
        const angle = Math.asin(1 / (Math.sqrt(2 + (2 * g * h) / (Math.pow(u, 2)))));
        const R = (u * Math.cos(angle) / g) * (u * Math.sin(angle) + Math.sqrt(Math.pow((u * Math.sin(angle)), 2) + 2 * g * h));
        const step = R / 100; // 100 steps for the trajectory
        maxRangePoints = [];
        for (let x = 0; x <= R; x += step) {
            const t = x / (u * Math.cos(angle));
            const y = h + x * Math.tan(angle) - (g / (2 * Math.pow(u, 2) * Math.pow(Math.cos(angle), 2))) * Math.pow(x, 2);
            maxRangePoints.push({ x, y });
        }
    }
    function drawMaxRangeProjectile() {
        ctx.save();
        ctx.translate(offsetX, offsetY);
        ctx.scale(scale, scale);
        ctx.beginPath();
        for (let i = 0; i < maxRangePoints.length; i++) {
            const point = maxRangePoints[i];
            if (i === 0) {
                ctx.moveTo(point.x, -point.y);
            }
            else {
                ctx.lineTo(point.x, -point.y);
            }
        }
        ctx.strokeStyle = 'red';
        ctx.stroke();
        ctx.restore();
    }
    function draw() {
        drawAxes();
        calculateTrajectory();
        drawProjectile();
        calculateMaxTrajectory();
        drawMaxRangeProjectile();
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
        const pointsToCheck = [...points, ...maxRangePoints];
        if (pointsToCheck.length > 0) {
            const closestPoint = pointsToCheck.reduce((prev, curr) => {
                const prevDist = Math.sqrt(Math.pow((prev.x - x), 2) + Math.pow((prev.y - y), 2));
                const currDist = Math.sqrt(Math.pow((curr.x - x), 2) + Math.pow((curr.y - y), 2));
                return currDist < prevDist ? curr : prev;
            });
            const isPoint = points.includes(closestPoint);
            const textColor = isPoint ? 'blue' : 'red';
            const pointColor = isPoint ? 'blue' : 'red';
            ctx.fillStyle = textColor;
            ctx.fillText(`(${Math.round(closestPoint.x * 1000) / 1000}, ${Math.round(closestPoint.y * 1000) / 1000})`, x, -y);
            ctx.beginPath();
            ctx.arc(closestPoint.x, -closestPoint.y, 2, 0, 2 * Math.PI);
            ctx.fillStyle = pointColor;
            ctx.fill();
        }
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
    angleInput.addEventListener('input', draw);
    gravityInput.addEventListener('input', draw);
    speedInput.addEventListener('input', draw);
    heightInput.addEventListener('input', draw);
    draw();
})();
