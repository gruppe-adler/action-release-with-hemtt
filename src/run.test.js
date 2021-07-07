jest.mock('./hemtt');
jest.mock('./input');
jest.mock('./output');
jest.mock('@actions/core');

const hemtt = require('./hemtt');
const input = require('./input');
const output = require('./output');
const core = require('@actions/core');
const {join} = require('path');

const run = require('./run');

describe('run', () => {
    beforeEach(() => {

        core.group.mockImplementation((str, fn) => {
            return fn();
        })
        hemtt.modGetVersion.mockImplementation( () => {
            return Promise.resolve('1.2.3');
        });
        hemtt.modGetName.mockImplementation(() => {
            return Promise.resolve('myMod');
        })
        hemtt.modVar.mockImplementation((formatString) => {
            return Promise.resolve(formatString.replace('{{name}}', 'myMod').replace('{{version}}', '1.2.3').replace('{{modname}}', 'my_mod'));
        })
    });

    it('fails without inputs', () => {
        expect.assertions(1);
        return run().catch(e => expect(e).toBeTruthy());
    });

    it('calls hemtt to build the mod when inputs are defined', () => {
        expect.assertions(1);
        input.getCwd.mockReturnValue('myCwd');
        input.getZipBuild.mockReturnValue(true);
        return run().then(_ => expect(hemtt.modBuildRelease).toBeCalled());
    });
    describe('output', () => {

        beforeEach(() => {
            input.getCwd.mockReturnValue('myCwd');
            output.setReleasePath.mockClear();
            output.setZipName.mockClear();
            output.setZipPath.mockClear();
            output.setModName.mockClear();
        })

        it('sets zip_name', () => {
            input.getZipBuild.mockReturnValue(true);
            return run().then(_ => {
                expect(output.setReleasePath).toHaveBeenCalledWith(join('myCwd', 'releases', '1.2.3'));
                expect(output.setModName).toHaveBeenCalledWith('my_mod');
                expect(output.setZipName).toHaveBeenCalledWith('myMod_1.2.3');
                expect(output.setZipPath).toHaveBeenCalledWith(join('myCwd', 'releases', 'myMod_1.2.3.zip'));
            })
        });
        it('does not set zip output if zip_build parameter is false', () => {
            input.getZipBuild.mockReturnValue(false);
            return run().then(_ => {
                expect(output.setReleasePath).toHaveBeenCalledWith(join('myCwd', 'releases', '1.2.3'));
                expect(output.setModName).toHaveBeenCalledWith('my_mod');
                expect(output.setZipName).not.toHaveBeenCalled();
                expect(output.setZipPath).not.toHaveBeenCalled();
            })
        });
    });
});
