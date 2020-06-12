const { join } = require('path');
const core = require('@actions/core');
const exec = require('@actions/exec');

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
    // get input
    const zipBuild = core.getInput('zip_build').toLowerCase() === "true";

    // log version
    await core.group('HEMTT Version', execHEMTT(['--version']));

    // build release
    await core.group('Build mod', execHEMTT(['build', '--release', '--force']));

    if(zipBuild) {
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
}

try {
    run();
} catch (err) {
    core.setFailed(error.message);
}

