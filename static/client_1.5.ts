// (async function() {
// const canvas = document.getElementById('challenge1.5_canvas') as HTMLCanvasElement;
// const ctx = canvas.getContext('2d')!;
// ctx.translate(canvas.width / 2, canvas.height / 2);
// const angleInput = document.getElementById('challenge1.5_angle') as HTMLInputElement;
// const gravityInput = document.getElementById('challenge1.5_gravity') as HTMLInputElement;
// const speedInput = document.getElementById('challenge1.5_speed') as HTMLInputElement;
// const heightInput = document.getElementById('challenge1.5_height') as HTMLInputElement;
// const startButton = document.getElementById('challenge1.5_startSimulation') as HTMLButtonElement;
// let scale = 1;
// let offsetX = 0;
// let offsetY = 0;
// let isDragging = false;
// let startX: number, startY: number;
// let points: { x: number, y: number }[] = [];

// function drawAxes() {
//     ctx.clearRect(-canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
//     ctx.save();
//     ctx.translate(offsetX, offsetY);
//     ctx.scale(scale, scale);

//     ctx.beginPath();
//     ctx.moveTo(-canvas.width, 0);
//     ctx.lineTo(canvas.width, 0);
//     ctx.strokeStyle = 'black';
//     ctx.stroke();

//     ctx.beginPath();
//     ctx.moveTo(0, -canvas.height);
//     ctx.lineTo(0, canvas.height);
//     ctx.strokeStyle = 'black';
//     ctx.stroke();

//     ctx.restore();
// }

// function drawTrajectory() {
//     const g: number = parseFloat(gravityInput.value) || 9.81; // gravity
//     const m: number = 1; // mass (arbitrary unit)

//     const Lagrangian = (x: number, y: number, vx: number, vy: number): number => {
//         const T = 0.5 * m * (vx * vx + vy * vy); // kinetic energy
//         const V = m * g * y; // potential energy
//         return T - V;
//     };

//     const action = (trajectory: [number, number][]): number => {
//         const dt = 0.01; // time step
//         let S = 0;
//         for (let i = 0; i < trajectory.length - 1; i++) {
//             const [x, y] = trajectory[i];
//             const [xNext, yNext] = trajectory[i + 1];
//             const vx = (xNext - x) / dt;
//             const vy = (yNext - y) / dt;
//             S += Lagrangian(x, y, vx, vy) * dt;
//         }
//         return S;
//     };

//     const optimizeTrajectory = (initialTrajectory: [number, number][]): [number, number][] => {
//         const learningRate = 0.001; // Reduced learning rate
//         const maxIterations = 1000; // Increased number of iterations
//         const convergenceThreshold = 1e-6;
//         let trajectory = initialTrajectory.slice();
    
//         for (let iter = 0; iter < maxIterations; iter++) {
//             const grad: [number, number][] = new Array(trajectory.length).fill([0, 0]);
//             let maxChange = 0;
    
//             for (let i = 1; i < trajectory.length - 1; i++) {
//                 const original: [number, number] = [...trajectory[i]];

//                 // Compute gradient for x
//                 trajectory[i][0] += 0.001;
//                 const S1 = action(trajectory);
//                 trajectory[i][0] -= 0.002;
//                 const S2 = action(trajectory);
//                 trajectory[i][0] = original[0];
//                 grad[i] = [(S1 - S2) / 0.002, 0];
    
//                 // Compute gradient for y
//                 trajectory[i][1] += 0.001;
//                 const S3 = action(trajectory);
//                 trajectory[i][1] -= 0.002;
//                 const S4 = action(trajectory);
//                 trajectory[i][1] = original[1];
//                 grad[i][1] = (S3 - S4) / 0.002;
//             }
    
//             for (let i = 1; i < trajectory.length - 1; i++) {
//                 const changeX = learningRate * grad[i][0];
//                 const changeY = learningRate * grad[i][1];
//                 trajectory[i][0] -= changeX;
//                 trajectory[i][1] -= changeY;
//                 maxChange = Math.max(maxChange, Math.abs(changeX), Math.abs(changeY));
//             }
    
//             // Check for convergence
//             if (maxChange < convergenceThreshold) {
//                 console.log(`Converged after ${iter} iterations`);
//                 break;
//             }
//         }
//         return trajectory;
//     };

//     const initialTrajectory: [number, number][] = [];
//     for (let t = 0; t <= 10; t += 0.1) { // Use a larger initial step for initialization
//         initialTrajectory.push([t, 0]);
//     }

//     const optimizedTrajectory = optimizeTrajectory(initialTrajectory);

//     console.log('Optimized Trajectory:', optimizedTrajectory);

//     // Plot the trajectory
//     ctx.save();
//     ctx.translate(offsetX, offsetY);
//     ctx.scale(scale, scale);
//     ctx.beginPath();
//     optimizedTrajectory.forEach(([x, y], index) => {
//         if (index === 0) {
//             ctx.moveTo(x, -y);
//         } else {
//             ctx.lineTo(x, -y);
//         }
//     });
//     ctx.strokeStyle = 'red';
//     ctx.stroke();
//     ctx.restore();
// }

// function draw() {
//     drawAxes();
// }

// function handleMouseDown(e: MouseEvent) {
//     isDragging = true;
//     startX = e.clientX - offsetX;
//     startY = e.clientY - offsetY;
// }

// function handleMouseMove(e: MouseEvent) {
//     if (isDragging) {
//         offsetX = e.clientX - startX;
//         offsetY = e.clientY - startY;
//         draw();
//     }
//     const rect = canvas.getBoundingClientRect();
//     const x = (e.clientX - rect.left - canvas.width / 2 - offsetX) / scale;
//     const y = -(e.clientY - rect.top - canvas.height / 2 - offsetY) / scale;
//     draw();
//     ctx.save();
//     ctx.translate(offsetX, offsetY);
//     ctx.scale(scale, scale);
//     ctx.fillStyle = 'black';

//     if (points.length > 0) {
//         const closestPoint = points.reduce((prev, curr) => Math.abs(curr.x - x) < Math.abs(prev.x - x) ? curr : prev);
//         ctx.fillText(`(${Math.round(closestPoint.x * 1000) / 1000}, ${Math.round(closestPoint.y * 1000) / 1000}`, x, -y);

//         ctx.beginPath();
//         ctx.arc(closestPoint.x, -closestPoint.y, 2, 0, 2 * Math.PI);
//         ctx.fillStyle = 'blue';
//         ctx.fill();
//     }

//     ctx.restore();
// }

// function handleMouseUp() {
//     isDragging = false;
// }

// function handleWheel(e: WheelEvent) {
//     e.preventDefault();
//     const zoom = e.deltaY < 0 ? 1.1 : 0.9;
//     scale *= zoom;
//     draw();
// }

// angleInput.addEventListener('input', draw);
// gravityInput.addEventListener('input', draw);
// speedInput.addEventListener('input', draw);
// heightInput.addEventListener('input', draw);

// canvas.addEventListener('mousedown', handleMouseDown);
// canvas.addEventListener('mousemove', handleMouseMove);
// canvas.addEventListener('mouseup', handleMouseUp);
// canvas.addEventListener('wheel', handleWheel);

// startButton.addEventListener('click', drawTrajectory);

// draw();
// })();