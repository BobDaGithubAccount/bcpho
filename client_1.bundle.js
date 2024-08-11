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

/***/ "./src/client_1.ts":
/*!*************************!*\
  !*** ./src/client_1.ts ***!
  \*************************/
/***/ (() => {

eval("\n(function () {\n    const canvas = document.getElementById('challenge1_canvas');\n    const ctx = canvas.getContext('2d');\n    ctx.translate(canvas.width / 2, canvas.height / 2);\n    const angleInput = document.getElementById('challenge1_angle');\n    const gravityInput = document.getElementById('challenge1_gravity');\n    const speedInput = document.getElementById('challenge1_speed');\n    const heightInput = document.getElementById('challenge1_height');\n    let scale = 1;\n    let offsetX = 0;\n    let offsetY = 0;\n    let isDragging = false;\n    let startX, startY;\n    let points = [];\n    function drawAxes() {\n        ctx.clearRect(-canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);\n        ctx.save();\n        ctx.translate(offsetX, offsetY);\n        ctx.scale(scale, scale);\n        ctx.beginPath();\n        ctx.moveTo(-canvas.width, 0);\n        ctx.lineTo(canvas.width, 0);\n        ctx.strokeStyle = 'black';\n        ctx.stroke();\n        ctx.beginPath();\n        ctx.moveTo(0, -canvas.height);\n        ctx.lineTo(0, canvas.height);\n        ctx.strokeStyle = 'black';\n        ctx.stroke();\n        ctx.restore();\n    }\n    function drawProjectile() {\n        const angle = parseFloat(angleInput.value) * (Math.PI / 180);\n        const gravity = parseFloat(gravityInput.value);\n        const speed = parseFloat(speedInput.value);\n        const height = parseFloat(heightInput.value);\n        const timeIncrement = 0.1;\n        ctx.save();\n        ctx.translate(offsetX, offsetY);\n        ctx.scale(scale, scale);\n        let t = 0;\n        let x = 0;\n        let y = height;\n        points = [];\n        while (y >= 0) {\n            x = speed * t * Math.cos(angle);\n            y = height + speed * t * Math.sin(angle) - 0.5 * gravity * t * t;\n            points.push({ x, y });\n            t += timeIncrement;\n        }\n        ctx.beginPath();\n        ctx.moveTo(points[0].x, -points[0].y);\n        for (const point of points) {\n            ctx.lineTo(point.x, -point.y);\n        }\n        ctx.strokeStyle = 'red';\n        ctx.stroke();\n        ctx.restore();\n    }\n    function draw() {\n        drawAxes();\n        drawProjectile();\n    }\n    function handleMouseDown(e) {\n        isDragging = true;\n        startX = e.clientX - offsetX;\n        startY = e.clientY - offsetY;\n    }\n    function handleMouseMove(e) {\n        if (isDragging) {\n            offsetX = e.clientX - startX;\n            offsetY = e.clientY - startY;\n            draw();\n        }\n        const rect = canvas.getBoundingClientRect();\n        const x = (e.clientX - rect.left - canvas.width / 2 - offsetX) / scale;\n        const y = -(e.clientY - rect.top - canvas.height / 2 - offsetY) / scale;\n        draw();\n        ctx.save();\n        ctx.translate(offsetX, offsetY);\n        ctx.scale(scale, scale);\n        ctx.fillStyle = 'black';\n        if (points.length > 0) {\n            const closestPoint = points.reduce((prev, curr) => Math.abs(curr.x - x) < Math.abs(prev.x - x) ? curr : prev);\n            ctx.fillText(`(${Math.round(closestPoint.x * 1000) / 1000}, ${Math.round(closestPoint.y * 1000) / 1000}`, x, -y);\n            ctx.beginPath();\n            ctx.arc(closestPoint.x, -closestPoint.y, 2, 0, 2 * Math.PI);\n            ctx.fillStyle = 'blue';\n            ctx.fill();\n        }\n        ctx.restore();\n    }\n    function handleMouseUp() {\n        isDragging = false;\n    }\n    function handleWheel(e) {\n        e.preventDefault();\n        const zoom = e.deltaY < 0 ? 1.1 : 0.9;\n        scale *= zoom;\n        draw();\n    }\n    angleInput.addEventListener('input', draw);\n    gravityInput.addEventListener('input', draw);\n    speedInput.addEventListener('input', draw);\n    heightInput.addEventListener('input', draw);\n    canvas.addEventListener('mousedown', handleMouseDown);\n    canvas.addEventListener('mousemove', handleMouseMove);\n    canvas.addEventListener('mouseup', handleMouseUp);\n    canvas.addEventListener('wheel', handleWheel);\n    draw();\n})();\n\n\n//# sourceURL=webpack://bcpho/./src/client_1.ts?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/client_1.ts"]();
/******/ 	
/******/ })()
;