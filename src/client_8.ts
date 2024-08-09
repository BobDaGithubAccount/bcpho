import init, { FluidSimulator, Vector2D } from './fluid_simulator.js';

let animationFrameId: number | null = null;
let isRunning: boolean = false;

async function startSimulation() {
    await init();

    const density = parseFloat((document.getElementById('challenge8_density') as HTMLInputElement).value);
    const width = 100;
    const height = 100;
    const timeStep = 0.1;
    const viscosity = parseFloat((document.getElementById('challenge8_viscosity') as HTMLInputElement).value);

    const fluidSimulator = new FluidSimulator(width, height, timeStep, viscosity, density);

    addInitialForce(fluidSimulator);

    if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
    }
    isRunning = true;
    animate(fluidSimulator);
}

function addInitialForce(fluidSimulator: FluidSimulator) {
    const forceX = parseFloat((document.getElementById('challenge8_force_x') as HTMLInputElement).value);
    const forceY = parseFloat((document.getElementById('challenge8_force_y') as HTMLInputElement).value);
    const forceMagnitudeX = parseFloat((document.getElementById('challenge8_force_magnitude_x') as HTMLInputElement).value);
    const forceMagnitudeY = parseFloat((document.getElementById('challenge8_force_magnitude_y') as HTMLInputElement).value);

    fluidSimulator.add_force(forceX, forceY, forceMagnitudeX, forceMagnitudeY);
}

function animate(fluidSimulator: FluidSimulator) {
    if (!isRunning) {
        return;
    }
    fluidSimulator.step();
    drawVectorField(fluidSimulator);
    animationFrameId = requestAnimationFrame(() => animate(fluidSimulator));
}

function drawVectorField(fluidSimulator: FluidSimulator) {
    const canvas = document.getElementById('challenge8_canvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const simWidth = 100;
    const simHeight = 100;
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const cellSize = canvasWidth / simWidth;

    const velocityFieldX = fluidSimulator.get_velocity_field_x();
    const velocityFieldY = fluidSimulator.get_velocity_field_y();

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    ctx.strokeStyle = 'red';
    ctx.lineWidth = 1;

    for (let y = 0; y < simHeight; y++) {
        for (let x = 0; x < simWidth; x++) {
            const index = y * simWidth + x;

            const vx = velocityFieldX[index];
            const vy = velocityFieldY[index];

            const startX = x * cellSize;
            const startY = y * cellSize;
            const endX = startX + vx * cellSize;
            const endY = startY + vy * cellSize;

            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);
            ctx.stroke();

            const angle = Math.atan2(vy, vx);
            const arrowLength = 5;
            ctx.beginPath();
            ctx.moveTo(endX, endY);
            ctx.lineTo(endX - arrowLength * Math.cos(angle - Math.PI / 6), endY - arrowLength * Math.sin(angle - Math.PI / 6));
            ctx.moveTo(endX, endY);
            ctx.lineTo(endX - arrowLength * Math.cos(angle + Math.PI / 6), endY - arrowLength * Math.sin(angle + Math.PI / 6));
            ctx.stroke();
        }
    }
}

document.getElementById('challenge8_run_simulation')?.addEventListener('click', startSimulation);
document.getElementById('challenge8_stop_simulation')?.addEventListener('click', () => {
    isRunning = false;
    if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
    }
});