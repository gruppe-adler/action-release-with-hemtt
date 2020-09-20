jest.mock('@actions/core');

const core = require('@actions/core');
const {join} = require('path');
const input = require('./input')

describe('input', () => {
   describe('getCwd', () => {
       it('asks with the right key', () => {
           input.getCwd();
           expect(core.getInput).toHaveBeenCalledWith('cwd');
       })
       it('normalizes the shit out of the input', () => {
           core.getInput.mockReturnValue('./foo/.././myCwd');
           expect(input.getCwd()).toEqual(join('myCwd'));
       })
       it('goes deep', () => {
           core.getInput.mockReturnValue('foo/bar/myCwd');
           expect(input.getCwd()).toEqual(join('foo', 'bar', 'myCwd'));
       })
       it('doesnt empty if just . gets passed', () => {
           core.getInput.mockReturnValue('.');
           expect(input.getCwd()).toEqual(join('.'));
       })
   });
   describe('getZipBuild', () => {
       it('asks with the right key', () => {
           input.getZipBuild();
           expect(core.getInput).toHaveBeenCalledWith('zip_build');
       })
       it('returns true for string "true', () => {
           core.getInput.mockReturnValue('true');
           expect(input.getZipBuild()).toBe(true);
       })
       it('returns true for boolean true', () => {
           core.getInput.mockReturnValue(true);
           expect(input.getZipBuild()).toBe(true);
       })
       it('returns false for everything else', () => {
           core.getInput.mockReturnValue("fu!");
           expect(input.getZipBuild()).toBe(false);
       })
   })
});
