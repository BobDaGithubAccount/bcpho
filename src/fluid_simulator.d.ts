// fluid_simulator.d.ts

interface Vector2D {
    x: number;
    y: number;
}

interface FluidSimulator {
    new (density: number, fluidVelocity: Vector2D): FluidSimulator;
    calculateTrajectory(
        angle: number,
        gravity: number,
        speed: number,
        height: number,
        timeStep: number,
        steps: number
    ): Vector2D[];
}

declare const createModule: () => Promise<{
    FluidSimulator: {
        prototype: FluidSimulator;
        new (density: number, fluidVelocity: Vector2D): FluidSimulator;
    };
}>;

export default createModule;