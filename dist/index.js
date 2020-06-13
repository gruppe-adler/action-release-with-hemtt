module.exports =
/******/ (function(modules, runtime) { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete installedModules[moduleId];
/******/ 		}
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	__webpack_require__.ab = __dirname + "/";
/******/
/******/ 	// the startup function
/******/ 	function startup() {
/******/ 		// Load entry module and return exports
/******/ 		return __webpack_require__(439);
/******/ 	};
/******/
/******/ 	// run startup
/******/ 	return startup();
/******/ })
/************************************************************************/
/******/ ({

/***/ 147:
/***/ (function(module) {

module.exports = eval("require")("@actions/core");


/***/ }),

/***/ 439:
/***/ (function(__unusedmodule, __unusedexports, __webpack_require__) {

const { join } = __webpack_require__(622);
const core = __webpack_require__(147);
const exec = __webpack_require__(793);

const hemtt = join(__dirname, '../tools', (process.platform === 'linux' ? 'hemtt' : 'hemtt.exe') );

/**
 * Returns async function, which executes HEMTT with given args and given options
 * @param {*} args Hemtt args
 */
function execHEMTT(args) {
    return async () => {
        try {
            return exec.exec(hemtt, args);
        } catch (err) {
            core.setFailed(error.message);
        }
    }
};

async function run() {

    // log version
    await core.group('HEMTT Version', execHEMTT(['--version']));

    // build release
    await core.group('Build mod', execHEMTT(['build', '--release', '--force']));

    core.debug(core.getInput('zip_build'));
    
    // check whether we want to zip
    const zipBuild = core.getInput('zip_build').toLowerCase() === "true";
    core.debug(zipBuild);
    if(!zipBuild) return;

    let zipName = '';
    await execHEMTT(
        ['var', '{{name}}_{{version}}'],
        {
            listeners: { stdout: (data) => { zipName += data.toString(); } }
        }
    );
    const zipPath = `./releases/${zipName}.zip`;

    // zip
    await core.group('Zip release', execHEMTT(['zip', zipName]));

    // set outputs
    core.setOutput('zip_name', zipName);
    core.setOutput('zip_path', zipPath);
}

try {
    run();
} catch (err) {
    core.setFailed(error.message);
}



/***/ }),

/***/ 622:
/***/ (function(module) {

module.exports = require("path");

/***/ }),

/***/ 793:
/***/ (function(module) {

module.exports = eval("require")("@actions/exec");


/***/ })

/******/ });