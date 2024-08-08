(async function() {
    let wasmModule: any;

    async function initWasm() {
        const moduleFactory = await import('./fluid_simulator');
        wasmModule = await moduleFactory.default(); // Initialize the module
    }

    async function calculateTrajectoriesWithWasm() {
        if (!wasmModule) {
            await initWasm();
        }

        const density = parseFloat((document.getElementById('challenge8_density') as HTMLInputElement).value);
        const fluidVelocityX = parseFloat((document.getElementById('challenge8_velocity_x') as HTMLInputElement).value);
        const fluidVelocityY = parseFloat((document.getElementById('challenge8_velocity_y') as HTMLInputElement).value);
        const angle = parseFloat((document.getElementById('challenge8_angle') as HTMLInputElement).value);
        const gravity = parseFloat((document.getElementById('challenge8_gravity') as HTMLInputElement).value);
        const speed = parseFloat((document.getElementById('challenge8_speed') as HTMLInputElement).value);
        const height = parseFloat((document.getElementById('challenge8_height') as HTMLInputElement).value);

        const fluidSimulator = new wasmModule.FluidSimulator(density, { x: fluidVelocityX, y: fluidVelocityY });
        const points = fluidSimulator.calculateTrajectory(angle, gravity, speed, height, 0.01, 1000);

        drawTrajectory(points);
    }

    function drawTrajectory(points: { x: number, y: number }[]): void {
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