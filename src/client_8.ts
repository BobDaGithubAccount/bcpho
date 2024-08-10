import init, { FluidSimulator, Vector2D, Particle, RenderingMode } from './fluid_simulator.js';

let animationFrameId: number | null = null;
let isRunning: boolean = false;
let telemetry: boolean = false;

async function startSimulation() {
    await init();

    const density = parseFloat((document.getElementById('challenge8_density') as HTMLInputElement).value);
    const viscosity = parseFloat((document.getElementById('challenge8_viscosity') as HTMLInputElement).value);
    const temperature = parseFloat((document.getElementById('challenge8_temperature') as HTMLInputElement).value);
    const pressure = parseFloat((document.getElementById('challenge8_pressure') as HTMLInputElement).value);
    const gravity = parseFloat((document.getElementById('challenge8_gravity') as HTMLInputElement).value);

    const timeStep = 0.1;

    const particle = new Particle(
        new Vector2D(50, 50),
        new Vector2D(0, 0),
        parseFloat((document.getElementById('challenge8_mass') as HTMLInputElement).value)
    );

    const fluidSimulator = new FluidSimulator(100, 100, timeStep, viscosity, density, temperature, pressure, gravity, particle);

    addForce(fluidSimulator);

    if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
    }
    isRunning = true;
    animate(fluidSimulator);
}

function addForce(fluidSimulator: FluidSimulator) {
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
    drawData(fluidSimulator);
    animationFrameId = requestAnimationFrame(() => animate(fluidSimulator));
    telemetry = (document.getElementById('challenge8_telemetry') as HTMLInputElement).value === 'true';
    if (telemetry) {
        document.getElementById('challenge8_logs')!.innerHTML = fluidSimulator.get_statistics();
    }
    if((document.getElementById('challenge8_continuous_force') as HTMLInputElement).value === 'true') {
        addForce(fluidSimulator);
    }
}

function drawData(fluidSimulator: FluidSimulator) {
    const canvas = document.getElementById('challenge8_canvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let renderValue = (document.getElementById('challenge8_renderMode') as HTMLInputElement)?.value;
    fluidSimulator.set_rendering_mode(renderValue);
    let renderMode = fluidSimulator.rendering_mode;

    const simWidth = 100;
    const simHeight = 100;
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const cellSize = canvasWidth / simWidth;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    ctx.strokeStyle = 'red';
    ctx.lineWidth = 1;

    const data2DArray = fluidSimulator.get_data();

    if (renderMode === RenderingMode.Velocity) {
        for (let y = 0; y < simHeight; y++) {
            for (let x = 0; x < simWidth; x++) {
                const data = data2DArray[y][x];
                const velocity = data as { x: number, y: number };
    
                const startX = x * cellSize;
                const startY = y * cellSize;
                const endX = startX + velocity.x * cellSize;
                const endY = startY + velocity.y * cellSize;
    
                ctx.beginPath();
                ctx.moveTo(startX, startY);
                ctx.lineTo(endX, endY);
                ctx.stroke();
    
                const angle = Math.atan2(velocity.y, velocity.x);
                const arrowLength = 5;
                ctx.beginPath();
                ctx.moveTo(endX, endY);
                ctx.lineTo(endX - arrowLength * Math.cos(angle - Math.PI / 6), endY - arrowLength * Math.sin(angle - Math.PI / 6));
                ctx.moveTo(endX, endY);
                ctx.lineTo(endX - arrowLength * Math.cos(angle + Math.PI / 6), endY - arrowLength * Math.sin(angle + Math.PI / 6));
                ctx.stroke();
            }
        }
    } else if (renderMode === RenderingMode.Density || renderMode === RenderingMode.Pressure || renderMode === RenderingMode.Temperature) {
        for (let y = 0; y < simHeight; y++) {
            for (let x = 0; x < simWidth; x++) {
                const data = data2DArray[y][x];
                const density = data as number;
    
                const startX = x * cellSize;
                const startY = y * cellSize;
                const colorValue = Math.min(255, Math.max(0, Math.floor(density * 255)));
                ctx.fillStyle = `rgb(${colorValue}, ${colorValue}, ${colorValue})`;
                ctx.fillRect(startX, startY, cellSize, cellSize);
            }
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
