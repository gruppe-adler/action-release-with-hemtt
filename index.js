const { join } = require('path');
const core = require('@actions/core');
const exec = require('@actions/exec');

const hemtt = join(__dirname, '../tools', (process.platform === 'linux' ? 'hemtt' : 'hemtt.exe') );

/**
 * Returns async function, which executes HEMTT with given args and given options
 * @param {string[]} args Hemtt args
 * @returns Promise which resolves in string of stdout of hemtt
 */
function execHEMTT(args) {
    return new Promise(async (resolve, reject) => {
        let stdout = '';
        try {
            await exec.exec(hemtt, args, { listeners: { stdout: (data) => { stdout += data.toString(); } } });
            resolve(stdout)
        } catch (err) {
            core.setFailed(error.message);
            reject(err);
        }
    });
};

async function run() {

    // log version
    await core.group('HEMTT Version', () => execHEMTT(['--version']));

    // build release
    await core.group('Build mod', () => execHEMTT(['build', '--release', '--force']));

    // set release path output
    const version = await execHEMTT(['var', '{{version}}']);
    core.setOutput('release_path', `./releases/${version}`);

    // check whether we want to zip
    const zipBuild = core.getInput('zip_build').toLowerCase() === "true";
    if(!zipBuild) {
        core.info('Skipping ZIP.')
        return;
    };

    // find zip name
    const zipName = await execHEMTT(['var', '{{name}}_{{version}}'])();
    const zipPath = `./releases/${zipName}.zip`;

    // zip
    await core.group('Zip release', () => execHEMTT(['zip', zipName]));

    // set outputs
    core.setOutput('zip_name', zipName);
    core.setOutput('zip_path', zipPath);
}

try {
    run();
} catch (err) {
    core.setFailed(error.message);
}

