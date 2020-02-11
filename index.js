const { join } = require('path');
const core = require('@actions/core');
const exec = require('@actions/exec');

const hemtt = join(__dirname, '../tools', (process.platform === 'linux' ? 'hemtt' : 'hemtt.exe') );

async function execHEMTT(args, options) {
    try {
        return exec.exec(hemtt, args, Object.assign({ cwd: '.' }, options || {}) );
    } catch (err) {
        core.setFailed(error.message);
    }
};

async function run() {
    // log version
    await core.group('HEMTT Version', () => execHEMTT(['--version']));
    
    // build release
    await core.group('Build mod', () => execHEMTT(['build', '--release', '--force']));
    
    let zipName = 'mod';
    // template doesn't seem to work with the current version
    // TODO: uncomment
    // await execHEMTT(
    //     ['template', '{{name}}_{{version}}'],
    //     {
    //         listeners: { stdout: (data) => { zipName += data.toString(); } }
    //     }
    // );
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

