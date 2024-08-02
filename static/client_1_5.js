"use strict";
(function () {
    const canvas = document.getElementById('challenge1.5_canvas');
    const ctx = canvas.getContext('2d');
    ctx.translate(canvas.width / 2, canvas.height / 2);
    const angleInput = document.getElementById('challenge1.5_angle');
    const gravityInput = document.getElementById('challenge1.5_gravity');
    const speedInput = document.getElementById('challenge1.5_speed');
    const heightInput = document.getElementById('challenge1.5_height');
    const startButton = document.getElementById('challenge1.5_startSimulation');
    let scale = 1;
    let offsetX = 0;
    let offsetY = 0;
    let isDragging = false;
    let startX, startY;
    let g;
    const m = 1;
    let t = 0;
    const dt = 0.01;
    let x;
    let y;
    let vx;
    let vy;
    const positions = [];
    let isAnimating = false;
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
    function drawProjectile() {
        var _a, _b, _c, _d;
        ctx.save();
        ctx.translate(offsetX, offsetY);
        ctx.scale(scale, scale);
        ctx.beginPath();
        ctx.moveTo((_b = (_a = positions[0]) === null || _a === void 0 ? void 0 : _a.x) !== null && _b !== void 0 ? _b : 0, -((_d = (_c = positions[0]) === null || _c === void 0 ? void 0 : _c.y) !== null && _d !== void 0 ? _d : 0));
        for (const point of positions) {
            ctx.lineTo(point.x, -point.y);
        }
        ctx.strokeStyle = 'red';
        ctx.stroke();
        ctx.restore();
    }
    function eulerLagrange() {
        if (!isAnimating)
            return;
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
    function animate() {
        eulerLagrange();
        drawAxes();
        drawProjectile();
        if (isAnimating) {
            requestAnimationFrame(animate);
        }
    }
    function startSimulation() {
        g = parseFloat(gravityInput.value);
        x = 0;
        y = parseFloat(heightInput.value);
        vx = parseFloat(speedInput.value) * Math.cos(parseFloat(angleInput.value) * Math.PI / 180);
        vy = parseFloat(speedInput.value) * Math.sin(parseFloat(angleInput.value) * Math.PI / 180);
        positions.length = 0;
        isAnimating = true;
        animate();
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
        const closestPoint = positions.reduce((prev, curr) => Math.abs(curr.x - x) < Math.abs(prev.x - x) ? curr : prev);
        ctx.fillText(`(${Math.round(closestPoint.x * 1000) / 1000}, ${Math.round(closestPoint.y * 1000) / 1000})`, x, -y);
        ctx.beginPath();
        ctx.arc(closestPoint.x, -closestPoint.y, 2, 0, 2 * Math.PI);
        ctx.fillStyle = 'blue';
        ctx.fill();
        ctx.restore();
    }
    function handleMouseUp() {
        isDragging = false;
    }
    function handleWheel(e) {
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
