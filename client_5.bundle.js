/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/client_5.ts":
/*!*************************!*\
  !*** ./src/client_5.ts ***!
  \*************************/
/***/ (() => {

eval("\n(function () {\n    const canvas = document.getElementById('challenge5_canvas');\n    const ctx = canvas.getContext('2d');\n    ctx.translate(canvas.width / 2, canvas.height / 2);\n    const gravityInput = document.getElementById('challenge5_gravity');\n    const fixedXInput = document.getElementById('challenge5_fixedX');\n    const fixedYInput = document.getElementById('challenge5_fixedY');\n    const heightInput = document.getElementById('challenge5_height');\n    const telemetry = document.getElementById('challenge5_telemetry');\n    let scale = 1;\n    let offsetX = 0;\n    let offsetY = 0;\n    let isDragging = false;\n    let startX, startY;\n    let telemetryArray = [];\n    const curves = new Map();\n    function drawAxes() {\n        ctx.clearRect(-canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);\n        ctx.save();\n        ctx.translate(offsetX, offsetY);\n        ctx.scale(scale, scale);\n        ctx.beginPath();\n        ctx.moveTo(-canvas.width, 0);\n        ctx.lineTo(canvas.width, 0);\n        ctx.strokeStyle = 'black';\n        ctx.stroke();\n        ctx.beginPath();\n        ctx.moveTo(0, -canvas.height);\n        ctx.lineTo(0, canvas.height);\n        ctx.strokeStyle = 'black';\n        ctx.stroke();\n        ctx.restore();\n    }\n    function calculateTrajectories() {\n        calculateTrajectoriesLowHigh();\n        calculateBoundingTrajectory();\n        calculateMaxTrajectory();\n        calculateMinTrajectory();\n    }\n    function calculateMaxTrajectory() {\n        const g = parseFloat(gravityInput.value);\n        const X = parseFloat(fixedXInput.value);\n        const Y = parseFloat(fixedYInput.value);\n        const h = parseFloat(heightInput.value);\n        if (isNaN(g) || isNaN(X) || isNaN(Y) || isNaN(h) || X <= 0 || g <= 0) {\n            console.error(\"Invalid input values\");\n            return;\n        }\n        const u = Math.sqrt(g * (Y + Math.sqrt((X * X) + (Y * Y))));\n        const angle = Math.asin(1 / (Math.sqrt(2 + (2 * g * h) / (Math.pow(u, 2)))));\n        const R = (u * Math.cos(angle) / g) * (u * Math.sin(angle) + Math.sqrt(Math.pow((u * Math.sin(angle)), 2) + 2 * g * h));\n        const step = R / 100;\n        const points = [];\n        for (let x = 0; x <= R; x += step) {\n            const t = x / (u * Math.cos(angle));\n            const y = h + x * Math.tan(angle) - (g / (2 * Math.pow(u, 2) * Math.pow(Math.cos(angle), 2))) * Math.pow(x, 2);\n            points.push({ x, y });\n        }\n        curves.set('red', { points });\n    }\n    function calculateBoundingTrajectory() {\n        const g = parseFloat(gravityInput.value);\n        const X = parseFloat(fixedXInput.value);\n        const Y = parseFloat(fixedYInput.value);\n        const h = parseFloat(heightInput.value);\n        if (isNaN(g) || isNaN(X) || isNaN(Y) || isNaN(h) || X <= 0 || g <= 0) {\n            console.error(\"Invalid input values\");\n            return;\n        }\n        const minSpeed = Math.sqrt(g * (Y + Math.sqrt((X * X) + (Y * Y))));\n        const u2 = minSpeed * minSpeed;\n        const functionPoints = [];\n        const step = 0.1;\n        for (let x = 0; 1 == 1; x += step) {\n            const y = ((u2 / (2 * g)) - (g * x * x) / (2 * u2)) + h;\n            functionPoints.push({ x, y });\n            if (y < 0)\n                break;\n        }\n        curves.set('pink', { points: functionPoints });\n    }\n    function calculateMinTrajectory() {\n        const g = parseFloat(gravityInput.value);\n        const X = parseFloat(fixedXInput.value);\n        const Y = parseFloat(fixedYInput.value);\n        const h = parseFloat(heightInput.value);\n        if (isNaN(g) || isNaN(X) || isNaN(Y) || isNaN(h) || X <= 0 || g <= 0) {\n            console.error(\"Invalid input values\");\n            return;\n        }\n        const minSpeed = Math.sqrt(g * (Y + Math.sqrt((X * X) + (Y * Y))));\n        const functionPoints = [];\n        const step = 0.1;\n        for (let x = 0; 1 == 1; x += step) {\n            const y = (x * ((Y + Math.sqrt((X * X) + (Y * Y))) / X)) - (((x * x) * Math.sqrt((X * X) + (Y * Y))) / (X * X));\n            functionPoints.push({ x, y });\n            if (y < 0)\n                break;\n        }\n        curves.set('grey', { points: functionPoints });\n    }\n    function calculateTrajectoriesLowHigh() {\n        const g = parseFloat(gravityInput.value);\n        const X = parseFloat(fixedXInput.value);\n        const Y = parseFloat(fixedYInput.value);\n        const h = parseFloat(heightInput.value);\n        if (isNaN(g) || isNaN(X) || isNaN(Y) || isNaN(h) || X <= 0 || g <= 0) {\n            console.error(\"Invalid input values\");\n            return;\n        }\n        const minSpeed = Math.sqrt(g * (Y + Math.sqrt((X * X) + (Y * Y))));\n        const u2 = minSpeed * minSpeed;\n        const A = (g / (2 * u2)) * X * X;\n        const B = -X;\n        const C = Y - h + (g * X * X) / (2 * u2);\n        const discriminant = (B * B) - (4 * A * C);\n        if (discriminant < 0) {\n            // console.error(\"No real solution exists for the given input values\", discriminant);\n            return;\n        }\n        const sqrtDiscriminant = Math.sqrt(discriminant);\n        const tanTheta1 = (-B + sqrtDiscriminant) / (2 * A);\n        const tanTheta2 = (-B - sqrtDiscriminant) / (2 * A);\n        const theta1 = Math.atan(tanTheta1);\n        const theta2 = Math.atan(tanTheta2);\n        const lowBallPoints = [];\n        const highBallPoints = [];\n        const timeStep = 0.01;\n        let t = 0;\n        let x = 0;\n        let y = h;\n        let vx = minSpeed * Math.cos(theta1);\n        let vy = minSpeed * Math.sin(theta1);\n        while (y >= 0) {\n            lowBallPoints.push({ x, y });\n            t += timeStep;\n            x += vx * timeStep;\n            y += vy * timeStep - 0.5 * g * timeStep * timeStep;\n            vy -= g * timeStep;\n        }\n        t = 0;\n        x = 0;\n        y = h;\n        vx = minSpeed * Math.cos(theta2);\n        vy = minSpeed * Math.sin(theta2);\n        while (y >= 0) {\n            highBallPoints.push({ x, y });\n            t += timeStep;\n            x += vx * timeStep;\n            y += vy * timeStep - 0.5 * g * timeStep * timeStep;\n            vy -= g * timeStep;\n        }\n        curves.set('green', { points: lowBallPoints });\n        curves.set('blue', { points: highBallPoints });\n        telemetryArray.push(\"Min speed: \" + minSpeed.toString());\n    }\n    function drawCurve(color) {\n        const curve = curves.get(color);\n        if (!curve || !ctx)\n            return;\n        ctx.save();\n        ctx.translate(offsetX, offsetY);\n        ctx.scale(scale, scale);\n        ctx.beginPath();\n        for (let i = 0; i < curve.points.length; i++) {\n            const point = curve.points[i];\n            if (i === 0) {\n                ctx.moveTo(point.x, -point.y);\n            }\n            else {\n                ctx.lineTo(point.x, -point.y);\n            }\n        }\n        ctx.strokeStyle = color;\n        ctx.stroke();\n        ctx.restore();\n    }\n    function drawTargetPoint() {\n        if (!ctx)\n            return;\n        const X = parseFloat(fixedXInput.value);\n        const Y = parseFloat(fixedYInput.value);\n        if (isNaN(X) || isNaN(Y)) {\n            console.error(\"Invalid input values\");\n            return;\n        }\n        ctx.save();\n        ctx.translate(offsetX, offsetY);\n        ctx.scale(scale, scale);\n        ctx.beginPath();\n        ctx.arc(X, -Y, 5, 0, 2 * Math.PI);\n        ctx.fillStyle = 'red';\n        ctx.fill();\n        ctx.restore();\n    }\n    function draw() {\n        calculateTrajectories();\n        drawAxes();\n        curves.forEach((_, color) => drawCurve(color));\n        drawTargetPoint();\n        telemetry.innerHTML = telemetryArray.join('<br>');\n        telemetryArray = [];\n    }\n    function handleMouseDown(e) {\n        isDragging = true;\n        startX = e.clientX - offsetX;\n        startY = e.clientY - offsetY;\n    }\n    function handleMouseMove(e) {\n        if (isDragging) {\n            offsetX = e.clientX - startX;\n            offsetY = e.clientY - startY;\n            draw();\n        }\n        const rect = canvas.getBoundingClientRect();\n        const x = (e.clientX - rect.left - canvas.width / 2 - offsetX) / scale;\n        const y = -(e.clientY - rect.top - canvas.height / 2 - offsetY) / scale;\n        draw();\n        ctx.save();\n        ctx.translate(offsetX, offsetY);\n        ctx.scale(scale, scale);\n        ctx.fillStyle = 'black';\n        curves.forEach((curve, color) => {\n            const points = curve.points;\n            if (points.length > 0) {\n                const closestPoint = points.reduce((prev, curr) => {\n                    const prevDistance = Math.abs(prev.x - x);\n                    const currDistance = Math.abs(curr.x - x);\n                    return currDistance < prevDistance ? curr : prev;\n                });\n                ctx.beginPath();\n                ctx.arc(closestPoint.x, -closestPoint.y, 2, 0, 2 * Math.PI);\n                ctx.fillStyle = color;\n                ctx.fill();\n                telemetryArray.push(`<p1>${color}: (${Math.round(closestPoint.x * 1000) / 1000}, ${Math.round(closestPoint.y * 1000) / 1000})<p1>`);\n            }\n        });\n        ctx.restore();\n    }\n    function handleMouseUp() {\n        isDragging = false;\n    }\n    function handleWheel(e) {\n        e.preventDefault();\n        const zoom = e.deltaY < 0 ? 1.1 : 0.9;\n        scale *= zoom;\n        draw();\n    }\n    gravityInput.addEventListener('input', draw);\n    fixedXInput.addEventListener('input', draw);\n    fixedYInput.addEventListener('input', draw);\n    heightInput.addEventListener('input', draw);\n    canvas.addEventListener('mousedown', handleMouseDown);\n    canvas.addEventListener('mousemove', handleMouseMove);\n    canvas.addEventListener('mouseup', handleMouseUp);\n    canvas.addEventListener('wheel', handleWheel);\n    draw();\n})();\n\n\n//# sourceURL=webpack://bcpho/./src/client_5.ts?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/client_5.ts"]();
/******/ 	
/******/ })()
;