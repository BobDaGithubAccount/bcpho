/* tslint:disable */
/* eslint-disable */
/**
*/
export function init(): void;
/**
*/
export class FluidSimulator {
  free(): void;
/**
* @param {number} width
* @param {number} height
* @param {number} time_step
* @param {number} viscosity
* @param {number} density
*/
  constructor(width: number, height: number, time_step: number, viscosity: number, density: number);
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
* @param {number} x
* @param {number} y
* @returns {Vector2D}
*/
  get_velocity(x: number, y: number): Vector2D;
/**
* @returns {Float64Array}
*/
  get_velocity_field_x(): Float64Array;
/**
* @returns {Float64Array}
*/
  get_velocity_field_y(): Float64Array;
/**
* @returns {string}
*/
  output_telemetry(): string;
}
/**
*/
export class Vector2D {
  free(): void;
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
  readonly __wbg_vector2d_free: (a: number) => void;
  readonly __wbg_get_vector2d_x: (a: number) => number;
  readonly __wbg_set_vector2d_x: (a: number, b: number) => void;
  readonly __wbg_get_vector2d_y: (a: number) => number;
  readonly __wbg_set_vector2d_y: (a: number, b: number) => void;
  readonly __wbg_fluidsimulator_free: (a: number) => void;
  readonly fluidsimulator_new: (a: number, b: number, c: number, d: number, e: number) => number;
  readonly fluidsimulator_step: (a: number) => void;
  readonly fluidsimulator_add_force: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly fluidsimulator_get_velocity: (a: number, b: number, c: number) => number;
  readonly fluidsimulator_get_velocity_field_x: (a: number, b: number) => void;
  readonly fluidsimulator_get_velocity_field_y: (a: number, b: number) => void;
  readonly fluidsimulator_output_telemetry: (a: number, b: number) => void;
  readonly init: () => void;
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
