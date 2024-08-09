/* tslint:disable */
/* eslint-disable */
export const memory: WebAssembly.Memory;
export function __wbg_vector2d_free(a: number): void;
export function __wbg_get_vector2d_x(a: number): number;
export function __wbg_set_vector2d_x(a: number, b: number): void;
export function __wbg_get_vector2d_y(a: number): number;
export function __wbg_set_vector2d_y(a: number, b: number): void;
export function __wbg_fluidsimulator_free(a: number): void;
export function fluidsimulator_new(a: number, b: number, c: number, d: number, e: number): number;
export function fluidsimulator_step(a: number): void;
export function fluidsimulator_add_force(a: number, b: number, c: number, d: number, e: number): void;
export function fluidsimulator_get_velocity(a: number, b: number, c: number): number;
export function fluidsimulator_get_velocity_field_x(a: number, b: number): void;
export function fluidsimulator_get_velocity_field_y(a: number, b: number): void;
export function fluidsimulator_output_telemetry(a: number, b: number): void;
export function init(): void;
export function __wbindgen_add_to_stack_pointer(a: number): number;
export function __wbindgen_free(a: number, b: number, c: number): void;
