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

/***/ "./src/client_2.ts":
/*!*************************!*\
  !*** ./src/client_2.ts ***!
  \*************************/
/***/ (() => {

eval("\n(function () {\n    // HTML Elements\n    const canvas = document.getElementById('challenge2_canvas');\n    const ctx = canvas.getContext('2d');\n    ctx.translate(canvas.width / 2, canvas.height / 2);\n    const angleInput = document.getElementById('challenge2_angle');\n    const gravityInput = document.getElementById('challenge2_gravity');\n    const speedInput = document.getElementById('challenge2_speed');\n    const heightInput = document.getElementById('challenge2_height');\n    let scale = 1;\n    let offsetX = 0;\n    let offsetY = 0;\n    let isDragging = false;\n    let startX, startY;\n    let points = [];\n    function drawAxes() {\n        ctx.clearRect(-canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);\n        ctx.save();\n        ctx.translate(offsetX, offsetY);\n        ctx.scale(scale, scale);\n        ctx.beginPath();\n        ctx.moveTo(-canvas.width, 0);\n        ctx.lineTo(canvas.width, 0);\n        ctx.strokeStyle = 'black';\n        ctx.stroke();\n        ctx.beginPath();\n        ctx.moveTo(0, -canvas.height);\n        ctx.lineTo(0, canvas.height);\n        ctx.strokeStyle = 'black';\n        ctx.stroke();\n        ctx.restore();\n    }\n    function calculateTrajectory() {\n        const angle = parseFloat(angleInput.value) * Math.PI / 180;\n        const g = parseFloat(gravityInput.value);\n        const u = parseFloat(speedInput.value);\n        const h = parseFloat(heightInput.value);\n        //Using the direct one off of the sheet doesnt seem to work D:\n        const R = (u * Math.cos(angle) / g) * (u * Math.sin(angle) + Math.sqrt(Math.pow((u * Math.sin(angle)), 2) + 2 * g * h));\n        // const R = ((u^2)/g)*((Math.sin(angle*2)/2) + Math.cos(angle)*Math.sqrt(Math.sin(angle)*Math.sin(angle) + ((2*g*h)/u)));\n        const step = R / 100; // 100 steps for the trajectory\n        points = [];\n        for (let x = 0; x <= R; x += step) {\n            const t = x / (u * Math.cos(angle));\n            const y = h + x * Math.tan(angle) - (g / (2 * Math.pow(u, 2) * Math.pow(Math.cos(angle), 2))) * Math.pow(x, 2);\n            points.push({ x, y });\n        }\n    }\n    function drawProjectile() {\n        ctx.save();\n        ctx.translate(offsetX, offsetY);\n        ctx.scale(scale, scale);\n        ctx.beginPath();\n        for (let i = 0; i < points.length; i++) {\n            const point = points[i];\n            if (i === 0) {\n                ctx.moveTo(point.x, -point.y);\n            }\n            else {\n                ctx.lineTo(point.x, -point.y);\n            }\n        }\n        ctx.strokeStyle = 'blue';\n        ctx.stroke();\n        if (points.length > 0) {\n            const apogee = points.reduce((prev, curr) => curr.y > prev.y ? curr : prev);\n            ctx.beginPath();\n            ctx.arc(apogee.x, -apogee.y, 3, 0, 2 * Math.PI);\n            ctx.fillStyle = 'red';\n            ctx.fill();\n        }\n        ctx.restore();\n    }\n    function draw() {\n        calculateTrajectory();\n        drawAxes();\n        drawProjectile();\n    }\n    function handleMouseDown(e) {\n        isDragging = true;\n        startX = e.clientX - offsetX;\n        startY = e.clientY - offsetY;\n    }\n    function handleMouseMove(e) {\n        if (isDragging) {\n            offsetX = e.clientX - startX;\n            offsetY = e.clientY - startY;\n            draw();\n        }\n        const rect = canvas.getBoundingClientRect();\n        const x = (e.clientX - rect.left - canvas.width / 2 - offsetX) / scale;\n        const y = -(e.clientY - rect.top - canvas.height / 2 - offsetY) / scale;\n        draw();\n        ctx.save();\n        ctx.translate(offsetX, offsetY);\n        ctx.scale(scale, scale);\n        ctx.fillStyle = 'black';\n        if (points.length > 0) {\n            const closestPoint = points.reduce((prev, curr) => Math.abs(curr.x - x) < Math.abs(prev.x - x) ? curr : prev);\n            ctx.fillText(`(${Math.round(closestPoint.x * 1000) / 1000}, ${Math.round(closestPoint.y * 1000) / 1000}`, x, -y);\n            ctx.beginPath();\n            ctx.arc(closestPoint.x, -closestPoint.y, 2, 0, 2 * Math.PI);\n            ctx.fillStyle = 'blue';\n            ctx.fill();\n        }\n        ctx.restore();\n    }\n    function handleMouseUp() {\n        isDragging = false;\n    }\n    function handleWheel(e) {\n        e.preventDefault();\n        const zoom = e.deltaY < 0 ? 1.1 : 0.9;\n        scale *= zoom;\n        draw();\n    }\n    angleInput.addEventListener('input', draw);\n    gravityInput.addEventListener('input', draw);\n    speedInput.addEventListener('input', draw);\n    heightInput.addEventListener('input', draw);\n    canvas.addEventListener('mousedown', handleMouseDown);\n    canvas.addEventListener('mousemove', handleMouseMove);\n    canvas.addEventListener('mouseup', handleMouseUp);\n    canvas.addEventListener('wheel', handleWheel);\n    draw();\n})();\n\n\n//# sourceURL=webpack://bcpho/./src/client_2.ts?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/client_2.ts"]();
/******/ 	
/******/ })()
;