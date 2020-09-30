jest.mock('@actions/core');

const core = require('@actions/core');
const output = require('./output')

describe('output', () => {
   describe('setReleasePath', () => {
       it('asks with the right key', () => {
           output.setReleasePath('fu');
           expect(core.setOutput).toHaveBeenCalledWith('release_path', 'fu');
       })
   });
    describe('setZipName', () => {
        it('asks with the right key', () => {
            output.setZipName('fu');
            expect(core.setOutput).toHaveBeenCalledWith('zip_name', 'fu');
        })
    });
    describe('setZipPath', () => {
        it('asks with the right key', () => {
            output.setZipPath('fu');
            expect(core.setOutput).toHaveBeenCalledWith('zip_path', 'fu');
        })
    });
});
