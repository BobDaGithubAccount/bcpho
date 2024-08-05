"use strict";
(function () {
    const canvas = document.getElementById('challenge3_canvas');
    const ctx = canvas.getContext('2d');
    const gravityInput = document.getElementById('challenge3_gravity');
    const fixedXInput = document.getElementById('challenge3_fixedX');
    const fixedYInput = document.getElementById('challenge3_fixedY');
    const heightInput = document.getElementById('challenge3_height');
    let scale = 1;
    let offsetX = 0;
    let offsetY = 0;
    let isDragging = false;
    let startX, startY;
    let lowBallPoints = [];
    let highBallPoints = [];
    function drawAxes() {
        if (!ctx)
            return;
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
            console.error("No real solution exists for the given input values", discriminant);
            return;
        }
        const sqrtDiscriminant = Math.sqrt(discriminant);
        const tanTheta1 = (-B + sqrtDiscriminant) / (2 * A);
        const tanTheta2 = (-B - sqrtDiscriminant) / (2 * A);
        const theta1 = Math.atan(tanTheta1);
        const theta2 = Math.atan(tanTheta2);
        lowBallPoints = [];
        highBallPoints = [];
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
    }
    function drawTrajectories() {
        if (!ctx)
            return;
        ctx.save();
        ctx.translate(offsetX, offsetY);
        ctx.scale(scale, scale);
        ctx.beginPath();
        for (let i = 0; i < lowBallPoints.length; i++) {
            const point = lowBallPoints[i];
            if (i === 0) {
                ctx.moveTo(point.x, -point.y);
            }
            else {
                ctx.lineTo(point.x, -point.y);
            }
        }
        ctx.strokeStyle = 'green';
        ctx.stroke();
        ctx.beginPath();
        for (let i = 0; i < highBallPoints.length; i++) {
            const point = highBallPoints[i];
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
    function drawTargetPoint() {
        if (!ctx)
            return;
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
    function draw() {
        calculateTrajectories();
        drawAxes();
        drawTrajectories();
        drawTargetPoint();
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
    fixedXInput.addEventListener('input', draw);
    fixedYInput.addEventListener('input', draw);
    heightInput.addEventListener('input', draw);
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('wheel', handleWheel);
    draw();
})();
