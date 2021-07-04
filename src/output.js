const core = require('@actions/core');

module.exports.setZipName = function (zipName) {
    core.setOutput('zip_name', zipName);
}
module.exports.setZipPath = function (zipPath) {
    core.setOutput('zip_path', zipPath);
}
module.exports.setReleasePath = function (releasePath) {
    core.setOutput('release_path', releasePath);
}
module.exports.setModName = function (modName) {
    core.setOutput('mod_name', modName);
}
