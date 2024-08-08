#include <emscripten/bind.h>
#include <vector>
#include <cmath>

struct Vector2D {
    double x, y;
};

class FluidSimulator {
public:
    FluidSimulator(double density, Vector2D fluidVelocity)
        : density(density), fluidVelocity(fluidVelocity) {}

    std::vector<Vector2D> calculateTrajectory(double angle, double gravity, double speed, double height, double timeStep, int steps) {
        std::vector<Vector2D> points;
        double angleRad = angle * 3.141592653589793 / 180.0;
        double vx = speed * cos(angleRad);
        double vy = speed * sin(angleRad);
        double x = 0, y = height;

        //TODO: EVOLVE ACCORDING TO NAVIER STOKES ETC..
        for (int i = 0; i < steps; ++i) {
            x += vx * timeStep;
            vy -= gravity * timeStep;  // gravity
            y += vy * timeStep;

            vx -= 0.5 * density * fluidVelocity.x * vx * timeStep;
            vy -= 0.5 * density * fluidVelocity.y * vy * timeStep;

            points.push_back({x, y});
            if (y < 0) break;  // Stop if particle hits the ground
        }
        return points;
    }

private:
    double density;
    Vector2D fluidVelocity;
};

EMSCRIPTEN_BINDINGS(fluid_simulator_module) {
    emscripten::value_object<Vector2D>("Vector2D")
        .field("x", &Vector2D::x)
        .field("y", &Vector2D::y);

    emscripten::register_vector<Vector2D>("vector<Vector2D>");

    emscripten::class_<FluidSimulator>("FluidSimulator")
        .constructor<double, Vector2D>()
        .function("calculateTrajectory", &FluidSimulator::calculateTrajectory);
}