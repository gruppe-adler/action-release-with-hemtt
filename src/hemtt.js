const join = require('path').join;
const exec = require('@actions/exec');
const core = require('@actions/core');
const getCwd = require('./input').getCwd;

const binName = process.platform === 'linux' ? 'hemtt' : 'hemtt.exe';
let dir = __dirname.split('?'); // fuckery to suppress https://github.com/vercel/webpack-asset-relocator-loader#asset-relocation
const hemtt = join(dir.join('?'), '..', 'tools', binName);

function call(args) {
    return new Promise(async (resolve, reject) => {
        let stdout = '';
        try {
            const options = {
                listeners: {
                    stdout: (data) => { stdout += data.toString(); }
                },
                cwd: getCwd()
            };
            await exec.exec(hemtt, args, options);
            stdout = stdout.replace(/(\n)+$/i, '');
            resolve(stdout)
        } catch (err) {
            core.setFailed(err.message);
            reject(err);
        }
    });
}

module.exports = call;

module.exports.getVersion = async function() {
    return call(['--version']);
};

module.exports.modBuildRelease = async function() {
    return call(['build', '--release', '--force']);
};

module.exports.modZip = async function(zipName) {
    return call(['zip', zipName]);
};

module.exports.modVar = async function (formatString) {
    return call(['var', formatString]);
}

module.exports.modGetVersion = async function () {
    return this.modVar('{{version}}');
}

module.exports.modGetName = async function () {
    return this.modVar('{{name}}');
}
