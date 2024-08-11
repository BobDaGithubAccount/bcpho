use wasm_bindgen::prelude::*;
use web_sys::console;
use serde::Serialize;
use serde_json::to_string;

#[wasm_bindgen]
pub fn console_log(s: &str) {
    console::log_1(&s.into());
}

#[wasm_bindgen]
#[derive(Clone)]
#[derive(Serialize)]
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
#[derive(Serialize)]
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
#[derive(Serialize)]
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
    pub time: f64,
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
        let time: f64 = 0.0;
        FluidSimulator {
            width,
            height,
            time_step,
            time,
            viscosity,
            density: vec![initial_density; width * height],
            velocity_x: vec![0.0; width * height],
            velocity_y: vec![0.0; width * height],
            pressure: vec![initial_pressure; width * height],
            temperature: vec![initial_temperature; width * height],
            gravity,
            particle,
            rendering_mode: RenderingMode::Velocity,
        }
    }

    #[wasm_bindgen]
    pub fn add_force(&mut self, x: usize, y: usize, force_x: f64, force_y: f64) {
        let index = y * self.width + x;
        self.velocity_x[index] += force_x * self.time_step;
        self.velocity_y[index] += force_y * self.time_step;
    }

    fn update_particle(&mut self) {
        let index = (self.particle.position.y.round() as usize) * self.width + (self.particle.position.x.round() as usize);
        let force_x = self.velocity_x[index] * self.particle.mass;
        let force_y = (self.velocity_y[index] * self.particle.mass) + (self.gravity);
        
        self.particle.velocity.x += force_x * self.time_step / self.particle.mass;
        self.particle.velocity.y += force_y * self.time_step / self.particle.mass;

        self.particle.position.x += self.particle.velocity.x * self.time_step;
        self.particle.position.y += self.particle.velocity.y * self.time_step;
        
        if self.particle.position.x < 0.0 {
            self.particle.position.x = 0.0;
            self.particle.velocity.x *= -0.5;
        } else if self.particle.position.x >= self.width as f64 {
            self.particle.position.x = self.width as f64 - 1.0;
            self.particle.velocity.x *= -0.5;
        }

        if self.particle.position.y < 0.0 {
            self.particle.position.y = 0.0;
            self.particle.velocity.y *= -0.5;
        } else if self.particle.position.y >= self.height as f64 {
            self.particle.position.y = self.height as f64 - 1.0;
            self.particle.velocity.y *= -0.5;
        }
    }

    #[wasm_bindgen]
    pub fn step(&mut self) {
        self.update_pressure();
        console_log("Completed step: update_pressure");
        self.update_velocity();
        console_log("Completed step: update_velocity");
        self.update_density();
        console_log("Completed step: update_density");
        self.update_temperature();
        console_log("Completed step: update_temperature");
        self.update_particle();
        console_log("Completed step: update_particle");
        self.apply_boundary_conditions();
        console_log("Completed step: apply_boundary_conditions");
        self.time += self.time_step;
        console_log("Completed step: increment time");
    }

    //Momentum Equation
    fn update_velocity(&mut self) {
        self.advection();
        self.diffusion();
        self.handle_compressibility();
        self.apply_forces();
        self.apply_pressure_forces();    
    }

    fn apply_forces(&mut self) {
        // let g = self.gravity;
        // let width = self.width;
        // let height = self.height;
    
        // for y in 0..height {
        //     for x in 0..width {
        //         let index = y * width + x;
        //         self.velocity_y[index] += g * self.time_step;
        //     }
        // }
    }
    
    fn apply_pressure_forces(&mut self) {
        let width = self.width;
        let height = self.height;
    
        for y in 1..height-1 {
            for x in 1..width-1 {
                let index = y * width + x;
    
                let pressure_x = (self.pressure[index + 1] - self.pressure[index - 1]) / (2.0 * self.density[index]);
                let pressure_y = (self.pressure[index + width] - self.pressure[index - width]) / (2.0 * self.density[index]);
    
                self.velocity_x[index] -= self.time_step * pressure_x;
                self.velocity_y[index] -= self.time_step * pressure_y;
            }
        }
    }

    fn advection(&mut self) {
        let dt0 = self.time_step * self.width as f64;
        for y in 1..self.height - 1 {
            for x in 1..self.width - 1 {
                let index = y * self.width + x;
                let mut x0 = x as f64 - dt0 * self.velocity_x[index];
                let mut y0 = y as f64 - dt0 * self.velocity_y[index];

                if x0 < 0.5 {
                    x0 = 0.5;
                }
                if x0 > self.width as f64 - 1.5 {
                    x0 = self.width as f64 - 1.5;
                }
                if y0 < 0.5 {
                    y0 = 0.5;
                }
                if y0 > self.height as f64 - 1.5 {
                    y0 = self.height as f64 - 1.5;
                }

                let i0 = x0.floor() as usize;
                let i1 = i0 + 1;
                let j0 = y0.floor() as usize;
                let j1 = j0 + 1;

                let s1 = x0 - i0 as f64;
                let s0 = 1.0 - s1;
                let t1 = y0 - j0 as f64;
                let t0 = 1.0 - t1;

                self.velocity_x[index] = s0
                    * (t0 * self.velocity_x[j0 * self.width + i0]
                        + t1 * self.velocity_x[j1 * self.width + i0])
                    + s1
                        * (t0 * self.velocity_x[j0 * self.width + i1]
                            + t1 * self.velocity_x[j1 * self.width + i1]);

                self.velocity_y[index] = s0
                    * (t0 * self.velocity_y[j0 * self.width + i0]
                        + t1 * self.velocity_y[j1 * self.width + i0])
                    + s1
                        * (t0 * self.velocity_y[j0 * self.width + i1]
                            + t1 * self.velocity_y[j1 * self.width + i1]);
            }
        }
    }

    fn diffusion(&mut self) {
        let a = self.time_step * self.viscosity * self.width as f64 * self.height as f64;
        let c = 1.0 + 4.0 * a;
        for _ in 0..20 {
            for y in 1..self.height - 1 {
                for x in 1..self.width - 1 {
                    let index = y * self.width + x;
                    self.velocity_x[index] = (self.velocity_x[index]
                        + a * (self.velocity_x[index - 1]
                            + self.velocity_x[index + 1]
                            + self.velocity_x[index - self.width]
                            + self.velocity_x[index + self.width]))
                        / c;
                    self.velocity_y[index] = (self.velocity_y[index]
                        + a * (self.velocity_y[index - 1]
                            + self.velocity_y[index + 1]
                            + self.velocity_y[index - self.width]
                            + self.velocity_y[index + self.width]))
                        / c;
                }
            }
        }
    }

    fn update_pressure(&mut self) {
        let width = self.width;
        let height = self.height;
        let dt = self.time_step;
        let mut div = vec![0.0; width * height];
        let mut p = vec![0.0; width * height];

        for j in 1..height - 1 {
            for i in 1..width - 1 {
                let index = j * width + i;
                div[index] = -0.5
                    * (self.velocity_x[index + 1] - self.velocity_x[index - 1]
                        + self.velocity_y[index + width] - self.velocity_y[index - width])
                    / width as f64;
                p[index] = 0.0;
            }
        }

        for _ in 0..20 {
            for j in 1..height - 1 {
                for i in 1..width - 1 {
                    let index = j * width + i;
                    p[index] = (div[index]
                        + p[index - 1]
                        + p[index + 1]
                        + p[index - width]
                        + p[index + width])
                        / 4.0;
                }
            }
        }

        for j in 1..height - 1 {
            for i in 1..width - 1 {
                let index = j * width + i;
                self.velocity_x[index] -= 0.5 * width as f64 * (p[index + 1] - p[index - 1]);
                self.velocity_y[index] -= 0.5 * height as f64 * (p[index + width] - p[index - width]);
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
    
    fn update_temperature(&mut self) {
        let width = self.width;
        let height = self.height;
        let mut new_temperature = vec![0.0; width * height];
        let k = 0.024;
        
        for y in 1..height-1 {
            for x in 1..width-1 {
                let index = y * width + x;
                let vel_x = self.velocity_x[index];
                let vel_y = self.velocity_y[index];
                let density = self.density[index];
                // let internal_energy = self.internal_energy(index);
    
                let x_pos = x as f64 - self.time_step * vel_x;
                let y_pos = y as f64 - self.time_step * vel_y;
    
                let x0 = x_pos.max(0.5).min(width as f64 - 1.5).floor() as usize;
                let y0 = y_pos.max(0.5).min(height as f64 - 1.5).floor() as usize;
    
                let s1 = x_pos - x0 as f64;
                let s0 = 1.0 - s1;
                let t1 = y_pos - y0 as f64;
                let t0 = 1.0 - t1;
    
                let advected_temp = s0 * (t0 * self.temperature[y0 * width + x0] + t1 * self.temperature[(y0 + 1) * width + x0]) +
                                    s1 * (t0 * self.temperature[y0 * width + (x0 + 1)] + t1 * self.temperature[(y0 + 1) * width + (x0 + 1)]);
    
                let diffused_temp = k * ((self.temperature[index - 1] + self.temperature[index + 1] + 
                                          self.temperature[index - width] + self.temperature[index + width]) - 
                                          4.0 * self.temperature[index]);
    
                let viscous_dissipation = self.viscous_dissipation(index);
    
                new_temperature[index] = advected_temp + diffused_temp * self.time_step + viscous_dissipation * self.time_step;
            }
        }
    
        self.temperature.copy_from_slice(&new_temperature);
    }
    
    fn viscous_dissipation(&self, index: usize) -> f64 {
        let mu = self.viscosity;
        let grad_u_x = (self.velocity_x[index + 1] - self.velocity_x[index - 1]) / 2.0;
        let grad_u_y = (self.velocity_y[index + self.width] - self.velocity_y[index - self.width]) / 2.0;
        mu * (grad_u_x * grad_u_x + grad_u_y * grad_u_y)
    }
    
    fn handle_compressibility(&mut self) {
        for y in 1..self.height - 1 {
            for x in 1..self.width - 1 {
                let index = y * self.width + x;
                let div = (self.velocity_x[index + 1] - self.velocity_x[index - 1]
                    + self.velocity_y[index + self.width] - self.velocity_y[index - self.width])
                    * 0.5;
                self.pressure[index] -= div;
            }
        }
    }

    fn apply_boundary_conditions(&mut self) {
        let width = self.width;
        let height = self.height;
        
        for i in 0..width {
            let index_top = i;
            if self.velocity_y[index_top] > 0.0 {
            self.velocity_y[index_top] = 0.0;
            }
        
            let index_bottom = (height - 1) * width + i;
            if self.velocity_y[index_bottom] < 0.0 {
            self.velocity_y[index_bottom] = 0.0;
            }
        }
        
        for j in 0..height {
            let index_left = j * width;
            if self.velocity_x[index_left] > 0.0 {
            self.velocity_x[index_left] = 0.0;
            }
        
            let index_right = j * width + (width - 1);
            if self.velocity_x[index_right] < 0.0 {
            self.velocity_x[index_right] = 0.0;
            }
        }
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

    #[wasm_bindgen]
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
        let json = to_string(&data).unwrap();
        JsValue::from_str(&json)
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

        let avg_temp = self.temperature.iter().sum::<f64>() / self.temperature.len() as f64;
        let min_temp = self.temperature.iter().cloned().fold(f64::INFINITY, f64::min);
        let max_temp = self.temperature.iter().cloned().fold(f64::NEG_INFINITY, f64::max);

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
            Max Pressure: {}<br>\
            Avg Temperature: {}<br>\
            Min Temperature: {}<br>\
            Max Temperature: {}<br>\
            Time: {}<br>",
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
            max_pressure,
            avg_temp,
            min_temp,
            max_temp,
            self.time
        )
    }
}