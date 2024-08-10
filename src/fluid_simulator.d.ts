/* tslint:disable */
/* eslint-disable */
/**
* @param {string} s
*/
export function console_log(s: string): void;
/**
*/
export enum RenderingMode {
  Velocity = 0,
  Density = 1,
  Pressure = 2,
  Temperature = 3,
}
/**
*/
export class FluidSimulator {
  free(): void;
/**
* @param {number} width
* @param {number} height
* @param {number} time_step
* @param {number} viscosity
* @param {number} initial_density
* @param {number} initial_temperature
* @param {number} initial_pressure
* @param {number} gravity
* @param {Particle} particle
*/
  constructor(width: number, height: number, time_step: number, viscosity: number, initial_density: number, initial_temperature: number, initial_pressure: number, gravity: number, particle: Particle);
/**
*/
  step(): void;
/**
* @param {number} x
* @param {number} y
* @param {number} force_x
* @param {number} force_y
*/
  add_force(x: number, y: number, force_x: number, force_y: number): void;
/**
* @param {string} rendering_mode
*/
  set_rendering_mode(rendering_mode: string): void;
/**
* @param {number} x
* @param {number} y
* @returns {any}
*/
  get_data(x: number, y: number): any;
/**
* @param {number} x
* @param {number} y
* @returns {Vector2D}
*/
  get_velocity(x: number, y: number): Vector2D;
/**
* @param {number} x
* @param {number} y
* @returns {number}
*/
  get_density(x: number, y: number): number;
/**
* @param {number} x
* @param {number} y
* @returns {number}
*/
  get_pressure(x: number, y: number): number;
/**
* @param {number} x
* @param {number} y
* @returns {number}
*/
  get_temperature(x: number, y: number): number;
/**
* @returns {string}
*/
  get_statistics(): string;
/**
*/
  density: Float64Array;
/**
*/
  gravity: number;
/**
*/
  height: number;
/**
*/
  particle: Particle;
/**
*/
  pressure: Float64Array;
/**
*/
  rendering_mode: RenderingMode;
/**
*/
  temperature: Float64Array;
/**
*/
  time_step: number;
/**
*/
  velocity_x: Float64Array;
/**
*/
  velocity_y: Float64Array;
/**
*/
  viscosity: number;
/**
*/
  width: number;
}
/**
*/
export class Particle {
  free(): void;
/**
* @param {Vector2D} position
* @param {Vector2D} velocity
* @param {number} mass
*/
  constructor(position: Vector2D, velocity: Vector2D, mass: number);
/**
*/
  mass: number;
/**
*/
  position: Vector2D;
/**
*/
  velocity: Vector2D;
}
/**
*/
export class Vector2D {
  free(): void;
/**
* @param {number} x
* @param {number} y
*/
  constructor(x: number, y: number);
/**
*/
  x: number;
/**
*/
  y: number;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly console_log: (a: number, b: number) => void;
  readonly __wbg_vector2d_free: (a: number) => void;
  readonly vector2d_new: (a: number, b: number) => number;
  readonly __wbg_particle_free: (a: number) => void;
  readonly __wbg_get_particle_position: (a: number) => number;
  readonly __wbg_set_particle_position: (a: number, b: number) => void;
  readonly __wbg_get_particle_velocity: (a: number) => number;
  readonly __wbg_set_particle_velocity: (a: number, b: number) => void;
  readonly __wbg_get_particle_mass: (a: number) => number;
  readonly __wbg_set_particle_mass: (a: number, b: number) => void;
  readonly particle_new: (a: number, b: number, c: number) => number;
  readonly __wbg_fluidsimulator_free: (a: number) => void;
  readonly __wbg_get_fluidsimulator_width: (a: number) => number;
  readonly __wbg_set_fluidsimulator_width: (a: number, b: number) => void;
  readonly __wbg_get_fluidsimulator_height: (a: number) => number;
  readonly __wbg_set_fluidsimulator_height: (a: number, b: number) => void;
  readonly __wbg_get_fluidsimulator_time_step: (a: number) => number;
  readonly __wbg_set_fluidsimulator_time_step: (a: number, b: number) => void;
  readonly __wbg_get_fluidsimulator_viscosity: (a: number) => number;
  readonly __wbg_set_fluidsimulator_viscosity: (a: number, b: number) => void;
  readonly __wbg_get_fluidsimulator_density: (a: number, b: number) => void;
  readonly __wbg_set_fluidsimulator_density: (a: number, b: number, c: number) => void;
  readonly __wbg_get_fluidsimulator_velocity_x: (a: number, b: number) => void;
  readonly __wbg_set_fluidsimulator_velocity_x: (a: number, b: number, c: number) => void;
  readonly __wbg_get_fluidsimulator_velocity_y: (a: number, b: number) => void;
  readonly __wbg_set_fluidsimulator_velocity_y: (a: number, b: number, c: number) => void;
  readonly __wbg_get_fluidsimulator_pressure: (a: number, b: number) => void;
  readonly __wbg_set_fluidsimulator_pressure: (a: number, b: number, c: number) => void;
  readonly __wbg_get_fluidsimulator_temperature: (a: number, b: number) => void;
  readonly __wbg_set_fluidsimulator_temperature: (a: number, b: number, c: number) => void;
  readonly __wbg_get_fluidsimulator_gravity: (a: number) => number;
  readonly __wbg_set_fluidsimulator_gravity: (a: number, b: number) => void;
  readonly __wbg_get_fluidsimulator_particle: (a: number) => number;
  readonly __wbg_set_fluidsimulator_particle: (a: number, b: number) => void;
  readonly __wbg_get_fluidsimulator_rendering_mode: (a: number) => number;
  readonly __wbg_set_fluidsimulator_rendering_mode: (a: number, b: number) => void;
  readonly fluidsimulator_new: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number) => number;
  readonly fluidsimulator_step: (a: number) => void;
  readonly fluidsimulator_add_force: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly fluidsimulator_set_rendering_mode: (a: number, b: number, c: number) => void;
  readonly fluidsimulator_get_data: (a: number, b: number, c: number) => number;
  readonly fluidsimulator_get_velocity: (a: number, b: number, c: number) => number;
  readonly fluidsimulator_get_density: (a: number, b: number, c: number) => number;
  readonly fluidsimulator_get_pressure: (a: number, b: number, c: number) => number;
  readonly fluidsimulator_get_temperature: (a: number, b: number, c: number) => number;
  readonly fluidsimulator_get_statistics: (a: number, b: number) => void;
  readonly __wbg_get_vector2d_y: (a: number) => number;
  readonly __wbg_get_vector2d_x: (a: number) => number;
  readonly __wbg_set_vector2d_x: (a: number, b: number) => void;
  readonly __wbg_set_vector2d_y: (a: number, b: number) => void;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
  readonly __wbindgen_free: (a: number, b: number, c: number) => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {SyncInitInput} module
*
* @returns {InitOutput}
*/
export function initSync(module: SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {InitInput | Promise<InitInput>} module_or_path
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: InitInput | Promise<InitInput>): Promise<InitOutput>;
