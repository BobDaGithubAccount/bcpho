let wasm;

const cachedTextDecoder = (typeof TextDecoder !== 'undefined' ? new TextDecoder('utf-8', { ignoreBOM: true, fatal: true }) : { decode: () => { throw Error('TextDecoder not available') } } );

if (typeof TextDecoder !== 'undefined') { cachedTextDecoder.decode(); };

let cachedUint8Memory0 = null;

function getUint8Memory0() {
    if (cachedUint8Memory0 === null || cachedUint8Memory0.byteLength === 0) {
        cachedUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8Memory0;
}

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}

const heap = new Array(128).fill(undefined);

heap.push(undefined, null, true, false);

let heap_next = heap.length;

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}

function getObject(idx) { return heap[idx]; }

function dropObject(idx) {
    if (idx < 132) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

let WASM_VECTOR_LEN = 0;

const cachedTextEncoder = (typeof TextEncoder !== 'undefined' ? new TextEncoder('utf-8') : { encode: () => { throw Error('TextEncoder not available') } } );

const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
}
    : function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
        read: arg.length,
        written: buf.length
    };
});

function passStringToWasm0(arg, malloc, realloc) {

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length, 1) >>> 0;
        getUint8Memory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;

    const mem = getUint8Memory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
        const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);

        offset += ret.written;
        ptr = realloc(ptr, len, offset, 1) >>> 0;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}
/**
* @param {string} s
*/
export function console_log(s) {
    const ptr0 = passStringToWasm0(s, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    wasm.console_log(ptr0, len0);
}

function _assertClass(instance, klass) {
    if (!(instance instanceof klass)) {
        throw new Error(`expected instance of ${klass.name}`);
    }
    return instance.ptr;
}

let cachedInt32Memory0 = null;

function getInt32Memory0() {
    if (cachedInt32Memory0 === null || cachedInt32Memory0.byteLength === 0) {
        cachedInt32Memory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachedInt32Memory0;
}

let cachedFloat64Memory0 = null;

function getFloat64Memory0() {
    if (cachedFloat64Memory0 === null || cachedFloat64Memory0.byteLength === 0) {
        cachedFloat64Memory0 = new Float64Array(wasm.memory.buffer);
    }
    return cachedFloat64Memory0;
}

function getArrayF64FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getFloat64Memory0().subarray(ptr / 8, ptr / 8 + len);
}

function passArrayF64ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 8, 8) >>> 0;
    getFloat64Memory0().set(arg, ptr / 8);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}
/**
*/
export const RenderingMode = Object.freeze({ Velocity:0,"0":"Velocity",Density:1,"1":"Density",Pressure:2,"2":"Pressure",Temperature:3,"3":"Temperature", });

const FluidSimulatorFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_fluidsimulator_free(ptr >>> 0));
/**
*/
export class FluidSimulator {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        FluidSimulatorFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_fluidsimulator_free(ptr);
    }
    /**
    * @returns {number}
    */
    get width() {
        const ret = wasm.__wbg_get_fluidsimulator_width(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
    * @param {number} arg0
    */
    set width(arg0) {
        wasm.__wbg_set_fluidsimulator_width(this.__wbg_ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get height() {
        const ret = wasm.__wbg_get_fluidsimulator_height(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
    * @param {number} arg0
    */
    set height(arg0) {
        wasm.__wbg_set_fluidsimulator_height(this.__wbg_ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get time_step() {
        const ret = wasm.__wbg_get_fluidsimulator_time_step(this.__wbg_ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set time_step(arg0) {
        wasm.__wbg_set_fluidsimulator_time_step(this.__wbg_ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get time() {
        const ret = wasm.__wbg_get_fluidsimulator_time(this.__wbg_ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set time(arg0) {
        wasm.__wbg_set_fluidsimulator_time(this.__wbg_ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get viscosity() {
        const ret = wasm.__wbg_get_fluidsimulator_viscosity(this.__wbg_ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set viscosity(arg0) {
        wasm.__wbg_set_fluidsimulator_viscosity(this.__wbg_ptr, arg0);
    }
    /**
    * @returns {Float64Array}
    */
    get density() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.__wbg_get_fluidsimulator_density(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v1 = getArrayF64FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 8, 8);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {Float64Array} arg0
    */
    set density(arg0) {
        const ptr0 = passArrayF64ToWasm0(arg0, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_fluidsimulator_density(this.__wbg_ptr, ptr0, len0);
    }
    /**
    * @returns {Float64Array}
    */
    get velocity_x() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.__wbg_get_fluidsimulator_velocity_x(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v1 = getArrayF64FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 8, 8);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {Float64Array} arg0
    */
    set velocity_x(arg0) {
        const ptr0 = passArrayF64ToWasm0(arg0, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_fluidsimulator_velocity_x(this.__wbg_ptr, ptr0, len0);
    }
    /**
    * @returns {Float64Array}
    */
    get velocity_y() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.__wbg_get_fluidsimulator_velocity_y(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v1 = getArrayF64FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 8, 8);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {Float64Array} arg0
    */
    set velocity_y(arg0) {
        const ptr0 = passArrayF64ToWasm0(arg0, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_fluidsimulator_velocity_y(this.__wbg_ptr, ptr0, len0);
    }
    /**
    * @returns {Float64Array}
    */
    get pressure() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.__wbg_get_fluidsimulator_pressure(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v1 = getArrayF64FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 8, 8);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {Float64Array} arg0
    */
    set pressure(arg0) {
        const ptr0 = passArrayF64ToWasm0(arg0, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_fluidsimulator_pressure(this.__wbg_ptr, ptr0, len0);
    }
    /**
    * @returns {Float64Array}
    */
    get temperature() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.__wbg_get_fluidsimulator_temperature(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v1 = getArrayF64FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 8, 8);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {Float64Array} arg0
    */
    set temperature(arg0) {
        const ptr0 = passArrayF64ToWasm0(arg0, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_fluidsimulator_temperature(this.__wbg_ptr, ptr0, len0);
    }
    /**
    * @returns {number}
    */
    get gravity() {
        const ret = wasm.__wbg_get_fluidsimulator_gravity(this.__wbg_ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set gravity(arg0) {
        wasm.__wbg_set_fluidsimulator_gravity(this.__wbg_ptr, arg0);
    }
    /**
    * @returns {Particle}
    */
    get particle() {
        const ret = wasm.__wbg_get_fluidsimulator_particle(this.__wbg_ptr);
        return Particle.__wrap(ret);
    }
    /**
    * @param {Particle} arg0
    */
    set particle(arg0) {
        _assertClass(arg0, Particle);
        var ptr0 = arg0.__destroy_into_raw();
        wasm.__wbg_set_fluidsimulator_particle(this.__wbg_ptr, ptr0);
    }
    /**
    * @returns {RenderingMode}
    */
    get rendering_mode() {
        const ret = wasm.__wbg_get_fluidsimulator_rendering_mode(this.__wbg_ptr);
        return ret;
    }
    /**
    * @param {RenderingMode} arg0
    */
    set rendering_mode(arg0) {
        wasm.__wbg_set_fluidsimulator_rendering_mode(this.__wbg_ptr, arg0);
    }
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
    constructor(width, height, time_step, viscosity, initial_density, initial_temperature, initial_pressure, gravity, particle) {
        _assertClass(particle, Particle);
        var ptr0 = particle.__destroy_into_raw();
        const ret = wasm.fluidsimulator_new(width, height, time_step, viscosity, initial_density, initial_temperature, initial_pressure, gravity, ptr0);
        this.__wbg_ptr = ret >>> 0;
        return this;
    }
    /**
    * @param {number} x
    * @param {number} y
    * @param {number} force_x
    * @param {number} force_y
    */
    add_force(x, y, force_x, force_y) {
        wasm.fluidsimulator_add_force(this.__wbg_ptr, x, y, force_x, force_y);
    }
    /**
    */
    step() {
        wasm.fluidsimulator_step(this.__wbg_ptr);
    }
    /**
    * @param {string} rendering_mode
    */
    set_rendering_mode(rendering_mode) {
        const ptr0 = passStringToWasm0(rendering_mode, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.fluidsimulator_set_rendering_mode(this.__wbg_ptr, ptr0, len0);
    }
    /**
    * @returns {any}
    */
    get_data() {
        const ret = wasm.fluidsimulator_get_data(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
    * @returns {string}
    */
    get_statistics() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.fluidsimulator_get_statistics(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}

const ParticleFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_particle_free(ptr >>> 0));
/**
*/
export class Particle {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Particle.prototype);
        obj.__wbg_ptr = ptr;
        ParticleFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ParticleFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_particle_free(ptr);
    }
    /**
    * @returns {Vector2D}
    */
    get position() {
        const ret = wasm.__wbg_get_particle_position(this.__wbg_ptr);
        return Vector2D.__wrap(ret);
    }
    /**
    * @param {Vector2D} arg0
    */
    set position(arg0) {
        _assertClass(arg0, Vector2D);
        var ptr0 = arg0.__destroy_into_raw();
        wasm.__wbg_set_particle_position(this.__wbg_ptr, ptr0);
    }
    /**
    * @returns {Vector2D}
    */
    get velocity() {
        const ret = wasm.__wbg_get_particle_velocity(this.__wbg_ptr);
        return Vector2D.__wrap(ret);
    }
    /**
    * @param {Vector2D} arg0
    */
    set velocity(arg0) {
        _assertClass(arg0, Vector2D);
        var ptr0 = arg0.__destroy_into_raw();
        wasm.__wbg_set_particle_velocity(this.__wbg_ptr, ptr0);
    }
    /**
    * @returns {number}
    */
    get mass() {
        const ret = wasm.__wbg_get_particle_mass(this.__wbg_ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set mass(arg0) {
        wasm.__wbg_set_particle_mass(this.__wbg_ptr, arg0);
    }
    /**
    * @param {Vector2D} position
    * @param {Vector2D} velocity
    * @param {number} mass
    */
    constructor(position, velocity, mass) {
        _assertClass(position, Vector2D);
        var ptr0 = position.__destroy_into_raw();
        _assertClass(velocity, Vector2D);
        var ptr1 = velocity.__destroy_into_raw();
        const ret = wasm.particle_new(ptr0, ptr1, mass);
        this.__wbg_ptr = ret >>> 0;
        return this;
    }
}

const Vector2DFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_vector2d_free(ptr >>> 0));
/**
*/
export class Vector2D {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Vector2D.prototype);
        obj.__wbg_ptr = ptr;
        Vector2DFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        Vector2DFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_vector2d_free(ptr);
    }
    /**
    * @returns {number}
    */
    get x() {
        const ret = wasm.__wbg_get_fluidsimulator_time_step(this.__wbg_ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set x(arg0) {
        wasm.__wbg_set_fluidsimulator_time_step(this.__wbg_ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get y() {
        const ret = wasm.__wbg_get_fluidsimulator_time(this.__wbg_ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set y(arg0) {
        wasm.__wbg_set_fluidsimulator_time(this.__wbg_ptr, arg0);
    }
    /**
    * @param {number} x
    * @param {number} y
    */
    constructor(x, y) {
        const ret = wasm.vector2d_new(x, y);
        this.__wbg_ptr = ret >>> 0;
        return this;
    }
}

async function __wbg_load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);

            } catch (e) {
                if (module.headers.get('Content-Type') != 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else {
                    throw e;
                }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);

    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };

        } else {
            return instance;
        }
    }
}

function __wbg_get_imports() {
    const imports = {};
    imports.wbg = {};
    imports.wbg.__wbindgen_string_new = function(arg0, arg1) {
        const ret = getStringFromWasm0(arg0, arg1);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_object_drop_ref = function(arg0) {
        takeObject(arg0);
    };
    imports.wbg.__wbg_log_5bb5f88f245d7762 = function(arg0) {
        console.log(getObject(arg0));
    };
    imports.wbg.__wbindgen_throw = function(arg0, arg1) {
        throw new Error(getStringFromWasm0(arg0, arg1));
    };

    return imports;
}

function __wbg_init_memory(imports, maybe_memory) {

}

function __wbg_finalize_init(instance, module) {
    wasm = instance.exports;
    __wbg_init.__wbindgen_wasm_module = module;
    cachedFloat64Memory0 = null;
    cachedInt32Memory0 = null;
    cachedUint8Memory0 = null;


    return wasm;
}

function initSync(module) {
    if (wasm !== undefined) return wasm;

    const imports = __wbg_get_imports();

    __wbg_init_memory(imports);

    if (!(module instanceof WebAssembly.Module)) {
        module = new WebAssembly.Module(module);
    }

    const instance = new WebAssembly.Instance(module, imports);

    return __wbg_finalize_init(instance, module);
}

async function __wbg_init(input) {
    if (wasm !== undefined) return wasm;

    if (typeof input === 'undefined') {
        input = new URL('fluid_simulator_bg.wasm', import.meta.url);
    }
    const imports = __wbg_get_imports();

    if (typeof input === 'string' || (typeof Request === 'function' && input instanceof Request) || (typeof URL === 'function' && input instanceof URL)) {
        input = fetch(input);
    }

    __wbg_init_memory(imports);

    const { instance, module } = await __wbg_load(await input, imports);

    return __wbg_finalize_init(instance, module);
}

export { initSync }
export default __wbg_init;
