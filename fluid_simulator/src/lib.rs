use wasm_bindgen::prelude::*;
use std::cmp::{max, min};

#[wasm_bindgen]
pub struct Vector2D {
    pub x: f64,
    pub y: f64,
}

#[wasm_bindgen]
pub struct FluidSimulator {
    width: usize,
    height: usize,
    time_step: f64,
    viscosity: f64,
    density: f64,
    velocity_x: Vec<f64>,
    velocity_y: Vec<f64>,
    pressure: Vec<f64>,
}

#[wasm_bindgen]
impl FluidSimulator {
    #[wasm_bindgen(constructor)]
    pub fn new(width: usize, height: usize, time_step: f64, viscosity: f64, density: f64) -> FluidSimulator {
        FluidSimulator {
            width,
            height,
            time_step,
            viscosity,
            density,
            velocity_x: vec![0.0; width * height],
            velocity_y: vec![0.0; width * height],
            pressure: vec![0.0; width * height],
        }
    }

    pub fn step(&mut self) {
        self.adjust_time_step();
        self.diffuse();
        self.project();
        self.advect();
        self.project();
        self.apply_boundary_conditions();
    }

    pub fn add_force(&mut self, x: usize, y: usize, force_x: f64, force_y: f64) {
        let index = y * self.width + x;
        let force = Vector2D { x: force_x, y: force_y };
        self.velocity_x[index] += force.x * self.time_step;
        self.velocity_y[index] += force.y * self.time_step;
    }

    pub fn get_velocity(&self, x: usize, y: usize) -> Vector2D {
        let index = y * self.width + x;
        Vector2D {
            x: self.velocity_x[index],
            y: self.velocity_y[index],
        }
    }

    pub fn get_velocity_field_x(&self) -> Vec<f64> {
        self.velocity_x.clone()
    }

    pub fn get_velocity_field_y(&self) -> Vec<f64> {
        self.velocity_y.clone()
    }

    pub fn output_telemetry(&self) -> String {
        self.format_telemetry()
    }

    fn clamp(&self, value: f64, min: f64, max: f64) -> f64 {
        value.max(min).min(max)
    }

    fn apply_boundary_conditions(&mut self) {
        for i in 0..self.width {
            self.velocity_x[i] = 0.0;
            self.velocity_y[i] = 0.0;
            self.velocity_x[(self.height - 1) * self.width + i] = 0.0;
            self.velocity_y[(self.height - 1) * self.width + i] = 0.0;
        }

        for j in 0..self.height {
            self.velocity_x[j * self.width] = 0.0;
            self.velocity_y[j * self.width] = 0.0;
            self.velocity_x[j * self.width + (self.width - 1)] = 0.0;
            self.velocity_y[j * self.width + (self.width - 1)] = 0.0;
        }
    }

    fn adjust_time_step(&mut self) {
        let mut max_velocity = 0.0;
        for i in 0..self.width * self.height {
            let velocity_magnitude = (self.velocity_x[i].powi(2) + self.velocity_y[i].powi(2)).sqrt();
            if velocity_magnitude > max_velocity {
                max_velocity = velocity_magnitude;
            }
        }

        let grid_size = 1.0 / self.width.min(self.height) as f64;

        if max_velocity > 0.0 {
            self.time_step = self.time_step.max(1e-6).min(grid_size / (2.0 * max_velocity));
        }
    }

    fn diffuse(&mut self) {
        let velocity_x0 = self.velocity_x.clone();
        let velocity_y0 = self.velocity_y.clone();

        let alpha = self.time_step * self.viscosity * self.width as f64 * self.height as f64;
        let beta = 1.0 / (4.0 + alpha);

        for _ in 0..20 {
            for j in 1..self.height - 1 {
                for i in 1..self.width - 1 {
                    self.velocity_x[j * self.width + i] = (velocity_x0[j * self.width + i] + alpha * (
                        velocity_x0[j * self.width + (i - 1)] + velocity_x0[j * self.width + (i + 1)] +
                        velocity_x0[(j - 1) * self.width + i] + velocity_x0[(j + 1) * self.width + i])) * beta;

                    self.velocity_y[j * self.width + i] = (velocity_y0[j * self.width + i] + alpha * (
                        velocity_y0[j * self.width + (i - 1)] + velocity_y0[j * self.width + (i + 1)] +
                        velocity_y0[(j - 1) * self.width + i] + velocity_y0[(j + 1) * self.width + i])) * beta;
                }
            }
        }
    }

    fn project(&mut self) {
        let mut div = vec![0.0; self.width * self.height];
        let mut p = vec![0.0; self.width * self.height];

        for j in 1..self.height - 1 {
            for i in 1..self.width - 1 {
                div[j * self.width + i] = -0.5 * (
                    self.velocity_x[j * self.width + (i + 1)] - self.velocity_x[j * self.width + (i - 1)] +
                    self.velocity_y[(j + 1) * self.width + i] - self.velocity_y[(j - 1) * self.width + i]) / self.width as f64;

                p[j * self.width + i] = 0.0;
            }
        }

        for _ in 0..20 {
            for j in 1..self.height - 1 {
                for i in 1..self.width - 1 {
                    p[j * self.width + i] = (div[j * self.width + i] + p[j * self.width + (i - 1)] + p[j * self.width + (i + 1)] +
                        p[(j - 1) * self.width + i] + p[(j + 1) * self.width + i]) / 4.0;
                }
            }
        }

        for j in 1..self.height - 1 {
            for i in 1..self.width - 1 {
                self.velocity_x[j * self.width + i] -= 0.5 * (p[j * self.width + (i + 1)] - p[j * self.width + (i - 1)]) * self.width as f64;
                self.velocity_y[j * self.width + i] -= 0.5 * (p[(j + 1) * self.width + i] - p[(j - 1) * self.width + i]) * self.height as f64;
            }
        }
    }

    fn advect(&mut self) {
        let velocity_x0 = self.velocity_x.clone();
        let velocity_y0 = self.velocity_y.clone();

        for j in 1..self.height - 1 {
            for i in 1..self.width - 1 {
                let mut x = i as f64 - self.time_step * velocity_x0[j * self.width + i] * self.width as f64;
                let mut y = j as f64 - self.time_step * velocity_y0[j * self.width + i] * self.height as f64;

                x = x.max(0.5).min(self.width as f64 - 1.5);
                y = y.max(0.5).min(self.height as f64 - 1.5);

                let i0 = x.floor() as usize;
                let i1 = i0 + 1;
                let j0 = y.floor() as usize;
                let j1 = j0 + 1;

                let s1 = x - i0 as f64;
                let s0 = 1.0 - s1;
                let t1 = y - j0 as f64;
                let t0 = 1.0 - t1;

                self.velocity_x[j * self.width + i] = self.clamp(
                    s0 * (t0 * velocity_x0[j0 * self.width + i0] + t1 * velocity_x0[j1 * self.width + i0]) +
                    s1 * (t0 * velocity_x0[j0 * self.width + i1] + t1 * velocity_x0[j1 * self.width + i1]), -10.0, 10.0);

                self.velocity_y[j * self.width + i] = self.clamp(
                    s0 * (t0 * velocity_y0[j0 * self.width + i0] + t1 * velocity_y0[j1 * self.width + i0]) +
                    s1 * (t0 * velocity_y0[j0 * self.width + i1] + t1 * velocity_y0[j1 * self.width + i1]), -10.0, 10.0);
            }
        }
    }

    fn format_telemetry(&self) -> String {
        format!(
            "{{\"width\": {}, \"height\": {}, \"timeStep\": {}, \"viscosity\": {}, \"density\": {}, \"MaxVelocityX\": {}, \"MinVelocityX\": {}, \"MaxVelocityY\": {}, \"MinVelocityY\": {}}}",
            self.width,
            self.height,
            self.time_step,
            self.viscosity,
            self.density,
            self.velocity_x.iter().cloned().fold(f64::NEG_INFINITY, f64::max),
            self.velocity_x.iter().cloned().fold(f64::INFINITY, f64::min),
            self.velocity_y.iter().cloned().fold(f64::NEG_INFINITY, f64::max),
            self.velocity_y.iter().cloned().fold(f64::INFINITY, f64::min),
        )
    }
}

#[wasm_bindgen]
pub fn init() {
}