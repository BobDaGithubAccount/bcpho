// client_8.ts
(async function() {
    let FluidSimulator: any;

    async function initWasm() {
        // Import the module
        const createModule = (await import('./fluid_simulator.js')).default;
        // Initialize the module
        const wasmModule = await createModule();
        FluidSimulator = wasmModule.FluidSimulator;
    }

    async function calculateTrajectoriesWithWasm() {
        if (!FluidSimulator) {
            await initWasm();
        }

        const density = parseFloat((document.getElementById('challenge8_density') as HTMLInputElement).value);
        const fluidVelocityX = parseFloat((document.getElementById('challenge8_velocity_x') as HTMLInputElement).value);
        const fluidVelocityY = parseFloat((document.getElementById('challenge8_velocity_y') as HTMLInputElement).value);
        const angle = parseFloat((document.getElementById('challenge8_angle') as HTMLInputElement).value);
        const gravity = parseFloat((document.getElementById('challenge8_gravity') as HTMLInputElement).value);
        const speed = parseFloat((document.getElementById('challenge8_speed') as HTMLInputElement).value);
        const height = parseFloat((document.getElementById('challenge8_height') as HTMLInputElement).value);

        const fluidSimulator = new FluidSimulator(density, { x: fluidVelocityX, y: fluidVelocityY });
        const points = fluidSimulator.calculateTrajectory(angle, gravity, speed, height, 0.01, 1000);

        drawTrajectory(points);
    }

    function drawTrajectory(points: { x: number, y: number }[]) {
        const canvas = document.getElementById('challenge8_canvas') as HTMLCanvasElement;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        points.forEach((point, index) => {
            if (index === 0) {
                ctx.moveTo(point.x, canvas.height - point.y);
            } else {
                ctx.lineTo(point.x, canvas.height - point.y);
            }
        });
        ctx.strokeStyle = 'blue';
        ctx.stroke();
    }

    document.getElementById('challenge8_calculate')?.addEventListener('click', calculateTrajectoriesWithWasm);
})();
