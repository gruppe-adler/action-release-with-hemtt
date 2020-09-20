const core = require('@actions/core');
const path = require('path');

module.exports.getCwd = function () {
    return path.normalize(core.getInput('cwd') || '.');
}

module.exports.getZipBuild = function () {
    return core.getInput('zip_build') === 'true' || core.getInput('zip_build') === true
}
