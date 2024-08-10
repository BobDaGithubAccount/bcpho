use wasm_bindgen::prelude::*;
use web_sys::console;

#[wasm_bindgen]
pub fn console_log(s: &str) {
    console::log_1(&s.into());
}

#[wasm_bindgen]
#[derive(Clone)]
pub struct Vector2D {
    #[wasm_bindgen(getter_with_clone)]
    pub x: f64,
    #[wasm_bindgen(getter_with_clone)]
    pub y: f64,
}

#[wasm_bindgen]
impl Vector2D {
    #[wasm_bindgen(constructor)]
    pub fn new(x: f64, y: f64) -> Self {
        Vector2D { x, y }
    }
}

#[wasm_bindgen]
#[derive(Clone)]
pub struct Particle {
    #[wasm_bindgen(getter_with_clone)]
    pub position: Vector2D,
    #[wasm_bindgen(getter_with_clone)]
    pub velocity: Vector2D,
    #[wasm_bindgen(getter_with_clone)]
    pub mass: f64,
}

#[wasm_bindgen]
impl Particle {
    #[wasm_bindgen(constructor)]
    pub fn new(position: Vector2D, velocity: Vector2D, mass: f64) -> Self {
        Particle {
            position,
            velocity,
            mass,
        }
    }
}

#[wasm_bindgen]
#[derive(Clone)]

pub enum RenderingMode {
    Velocity,
    Density,
    Pressure,
    Temperature,
}

#[wasm_bindgen]
pub struct FluidSimulator {
    #[wasm_bindgen(getter_with_clone)]
    pub width: usize,
    #[wasm_bindgen(getter_with_clone)]
    pub height: usize,
    #[wasm_bindgen(getter_with_clone)]
    pub time_step: f64,
    #[wasm_bindgen(getter_with_clone)]
    pub viscosity: f64,
    #[wasm_bindgen(getter_with_clone)]
    pub density: Vec<f64>,
    #[wasm_bindgen(getter_with_clone)]
    pub velocity_x: Vec<f64>,
    #[wasm_bindgen(getter_with_clone)]
    pub velocity_y: Vec<f64>,
    #[wasm_bindgen(getter_with_clone)]
    pub pressure: Vec<f64>,
    #[wasm_bindgen(getter_with_clone)]
    pub temperature: Vec<f64>,
    #[wasm_bindgen(getter_with_clone)]
    pub gravity: f64,
    #[wasm_bindgen(getter_with_clone)]
    pub particle: Particle,
    #[wasm_bindgen(getter_with_clone)]
    pub rendering_mode: RenderingMode,
}

#[wasm_bindgen]
impl FluidSimulator {
    #[wasm_bindgen(constructor)]
    pub fn new(width: usize, height: usize, time_step: f64, viscosity: f64, initial_density: f64, initial_temperature: f64, initial_pressure: f64, gravity: f64, particle: Particle) -> Self {
        console_log("Creating new FluidSimulator");
        FluidSimulator {
            width,
            height,
            time_step,
            viscosity,
            density: vec![initial_density; width * height],
            velocity_x: vec![0.0; width * height],
            velocity_y: vec![0.0; width * height],
            pressure: vec![initial_pressure; width * height],
            temperature: vec![initial_temperature; width * height],
            gravity,
            particle,
            rendering_mode: RenderingMode::Velocity
        }
    }

    #[wasm_bindgen]
    pub fn step(&mut self) {
        self.advection();
        self.diffusion();
        self.update_pressure();
        self.update_velocity();
        self.update_density();
        self.update_temperature();
        self.handle_compressibility();
        self.project();
        self.apply_particle_forces();
        self.update_particle();
        self.apply_boundary_conditions();
    }

    #[wasm_bindgen]
    pub fn add_force(&mut self, x: usize, y: usize, force_x: f64, force_y: f64) {
        let index = y * self.width + x;
        self.velocity_x[index] += force_x * self.time_step;
        self.velocity_y[index] += force_y * self.time_step;
    }

    #[wasm_bindgen]
    pub fn set_rendering_mode(&mut self, rendering_mode: String) {
        match rendering_mode.as_str() {
            "velocity" => self.rendering_mode = RenderingMode::Velocity,
            "density" => self.rendering_mode = RenderingMode::Density,
            "pressure" => self.rendering_mode = RenderingMode::Pressure,
            "temperature" => self.rendering_mode = RenderingMode::Temperature,
            _ => (),
        }
    }

    pub fn get_data(&self) -> JsValue {
        let mut data: Vec<Vec<Vec<f64>>> = vec![vec![vec![0.0]; self.width]; self.height];
        for y in 0..self.height {
            for x in 0..self.width {
                let index = y * self.width + x;
                data[y][x] = match self.rendering_mode {
                    RenderingMode::Velocity => {
                        let velocity = vec![
                            self.velocity_x[index],
                            self.velocity_y[index],
                        ];
                        velocity
                    }
                    RenderingMode::Density => vec![self.density[index]],
                    RenderingMode::Pressure => vec![self.pressure[index]],
                    RenderingMode::Temperature => vec![self.temperature[index]],
                };
            }
        }
        JsValue::from_serde(&Data { data }).unwrap()
    }

    #[wasm_bindgen]
    pub fn get_velocity(&self, x: usize, y: usize) -> Vector2D {
        let index = y * self.width + x;
        Vector2D {
            x: self.velocity_x[index],
            y: self.velocity_y[index],
        }
    }

    #[wasm_bindgen]
    pub fn get_density(&self, x: usize, y: usize) -> f64 {
        self.density[y * self.width + x]
    }

    #[wasm_bindgen]
    pub fn get_pressure(&self, x: usize, y: usize) -> f64 {
        self.pressure[y * self.width + x]
    }

    #[wasm_bindgen]
    pub fn get_temperature(&self, x: usize, y: usize) -> f64 {
        self.temperature[y * self.width + x]
    }

    #[wasm_bindgen]
    pub fn get_statistics(&self) -> String {
        let avg_density = self.density.iter().sum::<f64>() / self.density.len() as f64;
        let min_density = self.density.iter().cloned().fold(f64::INFINITY, f64::min);
        let max_density = self.density.iter().cloned().fold(f64::NEG_INFINITY, f64::max);
    
        let avg_velocity_x = self.velocity_x.iter().sum::<f64>() / self.velocity_x.len() as f64;
        let min_velocity_x = self.velocity_x.iter().cloned().fold(f64::INFINITY, f64::min);
        let max_velocity_x = self.velocity_x.iter().cloned().fold(f64::NEG_INFINITY, f64::max);
    
        let avg_velocity_y = self.velocity_y.iter().sum::<f64>() / self.velocity_y.len() as f64;
        let min_velocity_y = self.velocity_y.iter().cloned().fold(f64::INFINITY, f64::min);
        let max_velocity_y = self.velocity_y.iter().cloned().fold(f64::NEG_INFINITY, f64::max);
    
        let avg_pressure = self.pressure.iter().sum::<f64>() / self.pressure.len() as f64;
        let min_pressure = self.pressure.iter().cloned().fold(f64::INFINITY, f64::min);
        let max_pressure = self.pressure.iter().cloned().fold(f64::NEG_INFINITY, f64::max);
    
        format!(
            "Avg Density: {}<br>\
            Min Density: {}<br>\
            Max Density: {}<br>\
            Avg Velocity X: {}<br>\
            Min Velocity X: {}<br>\
            Max Velocity X: {}<br>\
            Avg Velocity Y: {}<br>\
            Min Velocity Y: {}<br>\
            Max Velocity Y: {}<br>\
            Avg Pressure: {}<br>\
            Min Pressure: {}<br>\
            Max Pressure: {}",
            avg_density,
            min_density,
            max_density,
            avg_velocity_x,
            min_velocity_x,
            max_velocity_x,
            avg_velocity_y,
            min_velocity_y,
            max_velocity_y,
            avg_pressure,
            min_pressure,
            max_pressure
        )
    }

    fn advection(&mut self) {
        let width = self.width;
        let height = self.height;
        let dt = self.time_step;
        let mut new_velocity_x = vec![0.0; width * height];
        let mut new_velocity_y = vec![0.0; width * height];
    
        for y in 1..height-1 {
            for x in 1..width-1 {
                let index = y * width + x;
                let mut x_pos = x as f64 - dt * self.velocity_x[index];
                let mut y_pos = y as f64 - dt * self.velocity_y[index];
    
                x_pos = x_pos.max(0.5).min(width as f64 - 1.5);
                y_pos = y_pos.max(0.5).min(height as f64 - 1.5);
    
                let x0 = x_pos.floor() as usize;
                let x1 = x0 + 1;
                let y0 = y_pos.floor() as usize;
                let y1 = y0 + 1;
    
                let s1 = x_pos - x0 as f64;
                let s0 = 1.0 - s1;
                let t1 = y_pos - y0 as f64;
                let t0 = 1.0 - t1;
    
                new_velocity_x[index] = s0 * (t0 * self.velocity_x[y0 * width + x0] + t1 * self.velocity_x[y1 * width + x0]) +
                                        s1 * (t0 * self.velocity_x[y0 * width + x1] + t1 * self.velocity_x[y1 * width + x1]);
    
                new_velocity_y[index] = s0 * (t0 * self.velocity_y[y0 * width + x0] + t1 * self.velocity_y[y1 * width + x0]) +
                                        s1 * (t0 * self.velocity_y[y0 * width + x1] + t1 * self.velocity_y[y1 * width + x1]);
            }
        }
    
        self.velocity_x.copy_from_slice(&new_velocity_x);
        self.velocity_y.copy_from_slice(&new_velocity_y);
    }

    fn diffusion(&mut self) {
        let width = self.width;
        let height = self.height;
        let dt = self.time_step;
        let viscosity = self.viscosity;
        let alpha = dt * viscosity * (width as f64 * height as f64) / (width as f64 * height as f64);
    
        let mut new_velocity_x = vec![0.0; width * height];
        let mut new_velocity_y = vec![0.0; width * height];
    
        for _ in 0..20 {
            for y in 1..height-1 {
                for x in 1..width-1 {
                    let index = y * width + x;
                    new_velocity_x[index] = (self.velocity_x[index] + alpha * (
                        self.velocity_x[y * width + (x - 1)] + self.velocity_x[y * width + (x + 1)] +
                        self.velocity_x[(y - 1) * width + x] + self.velocity_x[(y + 1) * width + x])) / (1.0 + 4.0 * alpha);
    
                    new_velocity_y[index] = (self.velocity_y[index] + alpha * (
                        self.velocity_y[y * width + (x - 1)] + self.velocity_y[y * width + (x + 1)] +
                        self.velocity_y[(y - 1) * width + x] + self.velocity_y[(y + 1) * width + x])) / (1.0 + 4.0 * alpha);
                }
            }
        }
    
        self.velocity_x.copy_from_slice(&new_velocity_x);
        self.velocity_y.copy_from_slice(&new_velocity_y);
    }

    fn update_pressure(&mut self) {
        let k = 0.1;
        let width = self.width;
        let height = self.height;

        for y in 0..height {
            for x in 0..width {
                let index = y * width + x;
                self.pressure[index] = k * self.density[index];
            }
        }
    }

    fn update_temperature(&mut self) {
        let width = self.width;
        let height = self.height;
        let mut new_temperature = vec![0.0; width * height];

        for y in 1..height-1 {
            for x in 1..width-1 {
                let index = y * width + x;
                let vel_x = self.velocity_x[index];
                let vel_y = self.velocity_y[index];

                let x_pos = x as f64 - self.time_step * vel_x;
                let y_pos = y as f64 - self.time_step * vel_y;

                let x0 = x_pos.max(0.5).min(width as f64 - 1.5).floor() as usize;
                let y0 = y_pos.max(0.5).min(height as f64 - 1.5).floor() as usize;

                let s1 = x_pos - x0 as f64;
                let s0 = 1.0 - s1;
                let t1 = y_pos - y0 as f64;
                let t0 = 1.0 - t1;

                new_temperature[index] = s0 * (t0 * self.temperature[y0 * width + x0] + t1 * self.temperature[(y0 + 1) * width + x0]) +
                                         s1 * (t0 * self.temperature[y0 * width + (x0 + 1)] + t1 * self.temperature[(y0 + 1) * width + (x0 + 1)]);
            }
        }

        self.temperature.copy_from_slice(&new_temperature);
    }

    fn handle_compressibility(&mut self) {
        // let gamma = 1.4; // Specific heat ratio for an ideal gas
        let r = 287.0; // Specific gas constant for air
        let width = self.width;
        let height = self.height;

        for y in 0..height {
            for x in 0..width {
                let index = y * width + x;
                if self.density[index] == 0.0 {
                    continue;
                }
                self.pressure[index] = self.density[index] * r * self.temperature[index];
                self.velocity_x[index] += -(self.time_step / self.density[index]) * (self.pressure[y * width + (x + 1)] - self.pressure[y * width + (x - 1)]) / 2.0;
                self.velocity_y[index] += -(self.time_step / self.density[index]) * (self.pressure[(y + 1) * width + x] - self.pressure[(y - 1) * width + x]) / 2.0;
            }
        }
    }

    // Modify `update_velocity` to include non-linear advection and external forces
    fn update_velocity(&mut self) {
        let width = self.width;
        let height = self.height;
        let mut new_velocity_x = vec![0.0; width * height];
        let mut new_velocity_y: Vec<f64> = vec![0.0; width * height];
    
        for y in 1..height-1 {
            for x in 1..width-1 {
                let index = y * width + x;

                // Advection term (u ⋅ \del)u
                let advect_x = self.velocity_x[index] * (self.velocity_x[y * width + (x + 1)] - self.velocity_x[y * width + (x - 1)]) / 2.0;
                let advect_y = self.velocity_y[index] * (self.velocity_y[(y + 1) * width + x] - self.velocity_y[(y - 1) * width + x]) / 2.0;

                // External force (gravity)
                let external_force_x = 0.0;
                let external_force_y = -1.0*self.gravity;

                new_velocity_x[index] = self.velocity_x[index] - 
                    (self.pressure[y * width + (x + 1)] - self.pressure[y * width + (x - 1)]) / 2.0 +
                    advect_x + external_force_x;

                new_velocity_y[index] = self.velocity_y[index] - 
                    (self.pressure[(y + 1) * width + x] - self.pressure[(y - 1) * width + x]) / 2.0 +
                    advect_y + external_force_y;
            }
        }
    
        self.velocity_x.copy_from_slice(&new_velocity_x);
        self.velocity_y.copy_from_slice(&new_velocity_y);
    }


    fn apply_boundary_conditions(&mut self) {
        let width = self.width;
        let height = self.height;
    
        for x in 0..width {
            self.velocity_x[x] = 0.0;
            self.velocity_x[(height - 1) * width + x] = 0.0;
            self.velocity_y[x] = 0.0;
            self.velocity_y[(height - 1) * width + x] = 0.0;
        }
    
        for y in 0..height {
            self.velocity_x[y * width] = 0.0;
            self.velocity_x[y * width + (width - 1)] = 0.0;
            self.velocity_y[y * width] = 0.0;
            self.velocity_y[y * width + (width - 1)] = 0.0;
        }
    }

    fn apply_particle_forces(&mut self) {
        let px = self.particle.position.x as usize;
        let py = self.particle.position.y as usize;

        if px < self.width && py < self.height {
            let index = py * self.width + px;

            let fluid_force_x = -self.density[index] * self.velocity_x[index];
            let fluid_force_y = -self.density[index] * self.velocity_y[index];

            self.particle.velocity.x += fluid_force_x * self.time_step / self.particle.mass;
            self.particle.velocity.y += fluid_force_y * self.time_step / self.particle.mass;

            let particle_force_x = self.particle.velocity.x * self.particle.mass;
            let particle_force_y = self.particle.velocity.y * self.particle.mass;

            self.velocity_x[index] += particle_force_x * self.time_step;
            self.velocity_y[index] += particle_force_y * self.time_step;
        }
    }

    fn update_particle(&mut self) {
        self.particle.position.x += self.particle.velocity.x * self.time_step;
        self.particle.position.y += self.particle.velocity.y * self.time_step;

        self.particle.position.x = self.particle.position.x.max(0.0).min(self.width as f64 - 1.0);
        self.particle.position.y = self.particle.position.y.max(0.0).min(self.height as f64 - 1.0);
    }

    fn project(&mut self) {
        let width = self.width;
        let height = self.height;
        let mut div = vec![0.0; width * height];
        let mut p = vec![0.0; width * height];

        for y in 1..height-1 {
            for x in 1..width-1 {
                let index = y * width + x;
                let rho = self.density[index];
                let drho_dt = (self.density[y * width + (x + 1)] - self.density[y * width + (x - 1)] +
                               self.density[(y + 1) * width + x] - self.density[(y - 1) * width + x]) / (2.0 * self.time_step);
                let u_dot_grad_rho = self.velocity_x[index] * (self.density[y * width + (x + 1)] - self.density[y * width + (x - 1)]) / 2.0 +
                                     self.velocity_y[index] * (self.density[(y + 1) * width + x] - self.density[(y - 1) * width + x]) / 2.0;
                div[index] = (drho_dt + u_dot_grad_rho) / rho;
                p[index] = 0.0;
            }
        }
    
        for _ in 0..20 {
            for y in 1..height-1 {
                for x in 1..width-1 {
                    let index = y * width + x;
                    p[index] = (div[index] + p[y * width + (x - 1)] + p[y * width + (x + 1)] + 
                                p[(y - 1) * width + x] + p[(y + 1) * width + x]) / 4.0;
                }
            }
        }
    
        for y in 1..height-1 {
            for x in 1..width-1 {
                let index = y * width + x;
                if self.density[index] == 0.0 {
                    continue;
                }
                self.velocity_x[index] -= 0.5 * (p[y * width + (x + 1)] - p[y * width + (x - 1)]) / self.density[index];
                self.velocity_y[index] -= 0.5 * (p[(y + 1) * width + x] - p[(y - 1) * width + x]) / self.density[index];
            }
        }
    }
    fn update_density(&mut self) {
        let width = self.width;
        let height = self.height;
        let mut new_density = vec![0.0; width * height];

        for y in 1..height-1 {
            for x in 1..width-1 {
                let index = y * width + x;
                let vel_x = self.velocity_x[index];
                let vel_y = self.velocity_y[index];

                let x_pos = x as f64 - self.time_step * vel_x;
                let y_pos = y as f64 - self.time_step * vel_y;

                let x0 = x_pos.max(0.5).min(width as f64 - 1.5).floor() as usize;
                let y0 = y_pos.max(0.5).min(height as f64 - 1.5).floor() as usize;

                let s1 = x_pos - x0 as f64;
                let s0 = 1.0 - s1;
                let t1 = y_pos - y0 as f64;
                let t0 = 1.0 - t1;

                new_density[index] = s0 * (t0 * self.density[y0 * width + x0] + t1 * self.density[(y0 + 1) * width + x0]) +
                                     s1 * (t0 * self.density[y0 * width + (x0 + 1)] + t1 * self.density[(y0 + 1) * width + (x0 + 1)]);
            }
        }

        self.density.copy_from_slice(&new_density);
    }
}
