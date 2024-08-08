"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
(function () {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        let wasmModule;
        function initWasm() {
            return __awaiter(this, void 0, void 0, function* () {
                const moduleFactory = yield Promise.resolve().then(() => __importStar(require('./fluid_simulator')));
                wasmModule = yield moduleFactory.default(); // Initialize the module
            });
        }
        function calculateTrajectoriesWithWasm() {
            return __awaiter(this, void 0, void 0, function* () {
                if (!wasmModule) {
                    yield initWasm();
                }
                const density = parseFloat(document.getElementById('challenge8_density').value);
                const fluidVelocityX = parseFloat(document.getElementById('challenge8_velocity_x').value);
                const fluidVelocityY = parseFloat(document.getElementById('challenge8_velocity_y').value);
                const angle = parseFloat(document.getElementById('challenge8_angle').value);
                const gravity = parseFloat(document.getElementById('challenge8_gravity').value);
                const speed = parseFloat(document.getElementById('challenge8_speed').value);
                const height = parseFloat(document.getElementById('challenge8_height').value);
                const fluidSimulator = new wasmModule.FluidSimulator(density, { x: fluidVelocityX, y: fluidVelocityY });
                const points = fluidSimulator.calculateTrajectory(angle, gravity, speed, height, 0.01, 1000);
                drawTrajectory(points);
            });
        }
        function drawTrajectory(points) {
            const canvas = document.getElementById('challenge8_canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx)
                return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.beginPath();
            points.forEach((point, index) => {
                if (index === 0) {
                    ctx.moveTo(point.x, canvas.height - point.y);
                }
                else {
                    ctx.lineTo(point.x, canvas.height - point.y);
                }
            });
            ctx.strokeStyle = 'blue';
            ctx.stroke();
        }
        (_a = document.getElementById('challenge8_calculate')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', calculateTrajectoriesWithWasm);
    });
})();
