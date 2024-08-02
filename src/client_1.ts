const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;
const angleInput = document.getElementById('angle') as HTMLInputElement;
const gravityInput = document.getElementById('gravity') as HTMLInputElement;
const speedInput = document.getElementById('speed') as HTMLInputElement;
const heightInput = document.getElementById('height') as HTMLInputElement;

function drawProjectile() {
    const angle = parseFloat(angleInput.value) * (Math.PI / 180);
    const gravity = parseFloat(gravityInput.value);
    const speed = parseFloat(speedInput.value);
    const height = parseFloat(heightInput.value);
    const timeIncrement = 0.1;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let t = 0;
    let x = 0;
    let y = height;
    const points: { x: number, y: number }[] = [];

    while (y >= 0) {
        x = speed * t * Math.cos(angle);
        y = height + speed * t * Math.sin(angle) - 0.5 * gravity * t * t;
        points.push({ x, y });
        t += timeIncrement;
    }

    ctx.beginPath();
    ctx.moveTo(points[0].x, canvas.height - points[0].y);
    for (const point of points) {
        ctx.lineTo(point.x, canvas.height - point.y);
    }
    ctx.stroke();
}

angleInput.addEventListener('input', drawProjectile);
gravityInput.addEventListener('input', drawProjectile);
speedInput.addEventListener('input', drawProjectile);
heightInput.addEventListener('input', drawProjectile);

drawProjectile();