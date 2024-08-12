// import { create, all } from 'mathjs';
// import numeric from 'numeric';

// // Set up mathjs
// const math = create(all);

// // Define constants
// const mass = 1; // mass of the projectile
// const g = 9.81; // gravitational acceleration
// const deltaT = 0.1; // time step
// const learningRate = 0.01; // gradient descent learning rate
// const iterations = 1000; // number of iterations

// // Define the trajectory (initial guess)
// const trajectory = {
//     x: Array(100).fill(0).map((_, i) => i * 0.1),
//     y: Array(100).fill(0).map((_, i) => 10 * Math.sin(i * 0.1))
// };

// // Define the kinetic and potential energy functions
// function kineticEnergy(vx: number, vy: number, mass: number): number {
//     return 0.5 * mass * (vx * vx + vy * vy);
// }

// function potentialEnergy(y: number, mass: number, g: number): number {
//     return mass * g * y;
// }

// // Compute the action over the trajectory
// function computeAction(trajectory: { x: number[], y: number[] }, deltaT: number, mass: number, g: number): number {
//     let action = 0;
//     for (let i = 0; i < trajectory.x.length - 1; i++) {
//         const vx = (trajectory.x[i + 1] - trajectory.x[i]) / deltaT;
//         const vy = (trajectory.y[i + 1] - trajectory.y[i]) / deltaT;
//         const y = trajectory.y[i];
        
//         const T = kineticEnergy(vx, vy, mass);
//         const V = potentialEnergy(y, mass, g);
        
//         const L = T - V; // Lagrangian
//         action += L * deltaT;
//     }
//     return action;
// }

// // Compute the gradient numerically
// function numericalGradient(trajectory: { x: number[], y: number[] }, deltaT: number, mass: number, g: number, epsilon: number = 1e-5): number[][] {
//     const gradient: number[][] = [[], []];
    
//     const baseAction = computeAction(trajectory, deltaT, mass, g);

//     for (let i = 0; i < trajectory.x.length; i++) {
//         // Perturb x
//         const originalX = trajectory.x[i];
//         trajectory.x[i] += epsilon;
//         const perturbedActionX = computeAction(trajectory, deltaT, mass, g);
//         gradient[0].push((perturbedActionX - baseAction) / epsilon);
//         trajectory.x[i] = originalX;

//         // Perturb y
//         const originalY = trajectory.y[i];
//         trajectory.y[i] += epsilon;
//         const perturbedActionY = computeAction(trajectory, deltaT, mass, g);
//         gradient[1].push((perturbedActionY - baseAction) / epsilon);
//         trajectory.y[i] = originalY;
//     }

//     return gradient;
// }

// // Gradient descent algorithm
// function gradientDescent(trajectory: { x: number[], y: number[] }, deltaT: number, mass: number, g: number, learningRate: number, iterations: number) {
//     for (let iter = 0; iter < iterations; iter++) {
//         const gradient = numericalGradient(trajectory, deltaT, mass, g);

//         for (let i = 0; i < trajectory.x.length; i++) {
//             trajectory.x[i] -= learningRate * gradient[0][i];
//             trajectory.y[i] -= learningRate * gradient[1][i];
//         }
        
//         // Optionally print or log the action to monitor convergence
//         if (iter % 100 === 0) {
//             const action = computeAction(trajectory, deltaT, mass, g);
//             console.log(`Iteration ${iter}: Action = ${action}`);
//         }
//     }
// }

// // Run the gradient descent
// gradientDescent(trajectory, deltaT, mass, g, learningRate, iterations);

// // Output final trajectory
// console.log('Optimized trajectory:', trajectory);

// // Function to draw the trajectory on the canvas
// function drawTrajectory(trajectory: { x: number[], y: number[] }, canvasId: string) {
//     const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
//     if (!canvas) {
//         console.error(`Canvas with id ${canvasId} not found`);
//         return;
//     }
//     const ctx = canvas.getContext('2d');
//     if (!ctx) {
//         console.error('Failed to get canvas context');
//         return;
//     }

//     // Clear the canvas
//     ctx.clearRect(0, 0, canvas.width, canvas.height);

//     // Draw the trajectory
//     ctx.beginPath();
//     ctx.moveTo(trajectory.x[0], canvas.height - trajectory.y[0]); // Start from the first point
//     for (let i = 1; i < trajectory.x.length; i++) {
//         ctx.lineTo(trajectory.x[i], canvas.height - trajectory.y[i]);
//     }
//     ctx.strokeStyle = 'blue';
//     ctx.lineWidth = 2;
//     ctx.stroke();
// }

// // Call the function to draw the optimized trajectory
// drawTrajectory(trajectory, 'challenge_lagrangian_canvas');


// // import { add, multiply, map, MathCollection } from 'mathjs';
// // import Chart from 'chart.js/auto';

// // // Constants
// // const g = -9.81;  // Acceleration due to gravity (m/s^2)
// // const m = 1.0;    // Mass of the projectile (kg)

// // // Time discretization
// // const N = 100;        // Number of time steps
// // const tFinal = 2.0;   // Final time (s)
// // const dt = tFinal / (N - 1);  // Time step size

// // // Initial conditions
// // const x0 = 0.0;
// // const y0 = 0.0;
// // const vx0 = 10.0;
// // const vy0 = 10.0;

// // // Define the system of differential equations
// // function equationsOfMotion(t: number, state: number[]): number[] {
// //     const [x, y, vx, vy] = state;

// //     // Euler-Lagrange equations
// //     const dvxdt = 0;  // No horizontal acceleration
// //     const dvydt = g;  // Vertical acceleration due to gravity
// //     const dxdt = vx;
// //     const dydt = vy;

// //     return [dxdt, dydt, dvxdt, dvydt];
// // }

// // // Runge-Kutta 4th order method
// // function rungeKutta4(
// //     f: (t: number, state: number[]) => number[], 
// //     y0: number[], 
// //     t0: number, 
// //     dt: number, 
// //     tFinal: number
// // ): number[][] {
// //     let t = t0;
// //     let y = y0;
// //     const result: number[][] = [y];

// //     while (t < tFinal) {
// //         const k1 = map(f(t, y), value => (value as number) * dt) as number[];
// //         const k2 = map(f(t + dt / 2, add(y, map(k1, value => (value as number) / 2) as number[]) as number[]), value => (value as number) * dt) as number[];
// //         const k3 = map(f(t + dt / 2, add(y, map(k2, value => (value as number) / 2) as number[]) as number[]), value => (value as number) * dt) as number[];
// //         const k4 = map(f(t + dt, add(y, k3) as number[]), value => (value as number) * dt) as number[];

// //         y = add(y, map(add(add(k1, multiply(2, k2) as number[]), add(multiply(2, k3) as number[], k4) as number[]), value => (value as number) / 6) as number[]) as number[];
// //         t += dt;
// //         result.push(y);
// //     }

// //     return result;
// // }

// // // Initial state array
// // const Y0 = [x0, y0, vx0, vy0];

// // // Numerical integration using Runge-Kutta 4th order method
// // const result = rungeKutta4(equationsOfMotion, Y0, 0, dt, tFinal);

// // // Extracting the solution
// // const x = result.map(state => state[0]);
// // const y = result.map(state => state[1]);

// // // Plotting the results using Chart.js
// // const ctx = (document.getElementById('challenge_lagrangian_canvas') as HTMLCanvasElement).getContext('2d');
// // if (ctx) {
// //     new Chart(ctx, {
// //         type: 'line',
// //         data: {
// //             labels: x.map((_, i) => i * dt),
// //             datasets: [{
// //                 label: 'Trajectory',
// //                 data: x.map((xValue, i) => ({ x: xValue, y: y[i] })),
// //                 borderColor: 'blue',
// //                 fill: false,
// //             }],
// //         },
// //         options: {
// //             scales: {
// //                 x: { 
// //                     title: { text: 'x (m)', display: true },
// //                     type: 'linear'
// //                 },
// //                 y: {
// //                     title: { text: 'y (m)', display: true }
// //                 }
// //             }
// //         }
// //     });
// // }
