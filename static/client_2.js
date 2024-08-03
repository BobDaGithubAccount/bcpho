"use strict";
(function () {
    // HTML Elements
    const canvas = document.getElementById('challenge2_canvas');
    const ctx = canvas.getContext('2d');
    ctx.translate(canvas.width / 2, canvas.height / 2);
    const angleInput = document.getElementById('challenge2_angle');
    const gravityInput = document.getElementById('challenge2_gravity');
    const speedInput = document.getElementById('challenge2_speed');
    const heightInput = document.getElementById('challenge2_height');
    let scale = 1;
    let offsetX = 0;
    let offsetY = 0;
    let isDragging = false;
    let startX, startY;
    let points = [];
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
        //Using the direct one off of the sheet doesnt seem to work D:
        const R = (u * Math.cos(angle) / g) * (u * Math.sin(angle) + Math.sqrt(Math.pow((u * Math.sin(angle)), 2) + 2 * g * h));
        // const R = ((u^2)/g)*((Math.sin(angle*2)/2) + Math.cos(angle)*Math.sqrt(Math.sin(angle)*Math.sin(angle) + ((2*g*h)/u)));
        const step = R / 100; // 100 steps for the trajectory
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
        if (points.length > 0) {
            const apogee = points.reduce((prev, curr) => curr.y > prev.y ? curr : prev);
            ctx.beginPath();
            ctx.arc(apogee.x, -apogee.y, 3, 0, 2 * Math.PI);
            ctx.fillStyle = 'red';
            ctx.fill();
        }
        ctx.restore();
    }
    function draw() {
        calculateTrajectory();
        drawAxes();
        drawProjectile();
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
    function handleMouseUp() {
        isDragging = false;
    }
    function handleWheel(e) {
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
