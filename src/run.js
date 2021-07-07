const { join } = require('path');
const core = require('@actions/core');
const hemtt = require('./hemtt');
const getCwd = require('./input').getCwd;
const getZipBuild = require('./input').getZipBuild
const {setReleasePath, setZipName, setZipPath} = require('./output');

module.exports = async function run() {

    const cwd = getCwd();

    // log version
    await core.group('HEMTT Version', () => hemtt.getVersion());

    // build release
    await core.group('Build mod', () => hemtt.modBuildRelease());

    if (process.platform !== 'win32') {
        core.warning('Signing with HEMTT on Linux is broken at the moment! (see https://github.com/gruppe-adler/action-release-with-hemtt/issues/10 and https://github.com/BrettMayson/HEMTT/issues/278)')
    }

    // set release path output
    const version = await hemtt.modGetVersion();
    setReleasePath(join(cwd, 'releases', version));

    if(!getZipBuild()) {
        core.info('Skipping ZIP.')
        return;
    }

    // find zip name
    const zipName = await hemtt.modVar('{{name}}_{{version}}');
    const zipPath = join(cwd, 'releases', `${zipName}.zip`);

    // zip
    await core.group('Zip release', () => hemtt.modZip(zipName));

    // set outputs
    setZipName(zipName);
    setZipPath(zipPath);

    return null;
}
