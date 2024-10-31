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

/***/ "./src/main.js":
/*!*********************!*\
  !*** ./src/main.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\nObject(function webpackMissingModule() { var e = new Error(\"Cannot find module './utils.js'\"); e.code = 'MODULE_NOT_FOUND'; throw e; }());\n// explictly import only the functions we are interested in\n\n // OR give all of the exported `utils` functions a namespace\n\nlet temp = \"main.js temp value\"; // does not conflict with `temp` in utils.js\n\nconst input = document.querySelector(\"#input-firstname\");\nconst output = document.querySelector(\"#output\");\nconst cbForcefully = document.querySelector(\"#cb-forcefully\");\n\nconst helloButton = document.querySelector(\"#btn-hello\");\nconst goodbyeButton = document.querySelector(\"#btn-goodbye\");\n\nlet forcefully = cbForcefully.checked;\n\n//cbForcefully.onchange = () => forcefully = cbForcefully.checked;\ncbForcefully.onchange = e => forcefully = e.target.checked;\nhelloButton.onclick = () => output.innerHTML = Object(function webpackMissingModule() { var e = new Error(\"Cannot find module './utils.js'\"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(\"Hello\",input.value.trim(),forcefully);\ngoodbyeButton.onclick = () => output.innerHTML = Object(function webpackMissingModule() { var e = new Error(\"Cannot find module './utils.js'\"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(\"Goodbye\",input.value.trim(),forcefully);\n\nconsole.log(\"formatGreeting('Hey There') = \", Object(function webpackMissingModule() { var e = new Error(\"Cannot find module './utils.js'\"); e.code = 'MODULE_NOT_FOUND'; throw e; }())('Hey there'));\nconsole.log(\"doubleIt(10) = \", Object(function webpackMissingModule() { var e = new Error(\"Cannot find module './utils.js'\"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(10));\nconsole.log(\"defaultName = \", Object(function webpackMissingModule() { var e = new Error(\"Cannot find module './utils.js'\"); e.code = 'MODULE_NOT_FOUND'; throw e; }())); // FAILS - we need to import it\nconsole.log(\"meaningOfLife = \", Object(function webpackMissingModule() { var e = new Error(\"Cannot find module './utils.js'\"); e.code = 'MODULE_NOT_FOUND'; throw e; }())); // FAILS - it is not being exported by utils.js\n\nconsole.log(\"temp = \", temp);\nconsole.log(\"utils.temp = \", Object(function webpackMissingModule() { var e = new Error(\"Cannot find module './utils.js'\"); e.code = 'MODULE_NOT_FOUND'; throw e; }())); // named import\n\n\n//# sourceURL=webpack://greeter-modules/./src/main.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/main.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;