import init, { FluidSimulator, Vector2D, Particle, RenderingMode } from './fluid_simulator.js';

let animationFrameId: number | null = null;
let isRunning: boolean = false;
let telemetry: boolean = false;

async function startSimulation() {
    await init();
    const density = parseFloat((document.getElementById('challenge_cfd_density') as HTMLInputElement).value);
    const viscosity = parseFloat((document.getElementById('challenge_cfd_viscosity') as HTMLInputElement).value);
    const temperature = parseFloat((document.getElementById('challenge_cfd_temperature') as HTMLInputElement).value);
    const pressure = parseFloat((document.getElementById('challenge_cfd_pressure') as HTMLInputElement).value);
    const gravity = parseFloat((document.getElementById('challenge_cfd_gravity') as HTMLInputElement).value);

    const timeStep = 0.01;

    const particle = new Particle(
        new Vector2D(50, 50),
        new Vector2D(10, 10),
        parseFloat((document.getElementById('challenge_cfd_mass') as HTMLInputElement).value)
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
    fluidSimulator.step();
    if((document.getElementById('challenge8_continuous_force') as HTMLInputElement).value === 'true') {
        addForce(fluidSimulator);
    }
    drawData(fluidSimulator);
    animationFrameId = requestAnimationFrame(() => animate(fluidSimulator));
    telemetry = (document.getElementById('challenge8_telemetry') as HTMLInputElement).value === 'true';
    if (telemetry) {
        document.getElementById('challenge8_logs')!.innerHTML = fluidSimulator.get_statistics();
    }
    return;
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

    const dataJson = fluidSimulator.get_data();
    const data2DArray: number[][][] = JSON.parse(dataJson as unknown as string);

    if (renderMode === RenderingMode.Velocity) {
        for (let y = 0; y < simHeight; y++) {
            for (let x = 0; x < simWidth; x++) {
                const data = data2DArray[y][x];
                const velocity = { x: data[0], y: data[1] };

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
        let maxValue = -Infinity;
    
        for (let y = 0; y < simHeight; y++) {
            for (let x = 0; x < simWidth; x++) {
                const data = data2DArray[y][x];
                const value = data[0];
                if (value > maxValue) {
                    maxValue = value;
                }
            }
        }
    
        for (let y = 0; y < simHeight; y++) {
            for (let x = 0; x < simWidth; x++) {
                const data = data2DArray[y][x];
                const value = data[0];
                const normalizedValue = value / maxValue;
                const colorValue = Math.floor(normalizedValue * 255);
                const startX = x * cellSize;
                const startY = y * cellSize;
                const red = colorValue;
                const green = colorValue;
                const blue = colorValue;
                ctx.fillStyle = `rgb(${red}, ${green}, ${blue})`;
                ctx.fillRect(startX, startY, cellSize, cellSize);
            }
        }
    }

    const particle = fluidSimulator.particle;
    const particleX = particle.position.x;
    const particleY = particle.position.y;
    const particleRadius = 5;
    ctx.fillStyle = 'blue';
    ctx.beginPath();
    ctx.arc(particleX, particleY, particleRadius, 0, 2 * Math.PI);
    ctx.fill();
}

document.getElementById('challenge_cfd_run_simulation')?.addEventListener('click', startSimulation);
document.getElementById('challenge_cfd_stop_simulation')?.addEventListener('click', () => {
    isRunning = false;
    if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
    }
});
