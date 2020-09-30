jest.mock('./input');
jest.mock('@actions/exec');
jest.mock('@actions/core');

const exec = require('@actions/exec');
const core = require('@actions/core');
const input = require('./input')
const path = require('path');
const hemtt = require('./hemtt')

describe('hemtt', () => {
    describe('exec call', () => {
        it('passes the cwd option', () => {
            input.getCwd.mockReturnValue('myCwd');

            return hemtt('arg').then(_ => {
                expect(input.getCwd).toHaveBeenCalled();
                expect(exec.exec.mock.calls.pop()[2].cwd).toBe('myCwd');
            })
        })
        it('collects the output', () => {
            expect.assertions(4);
            exec.exec.mockImplementation((cmd, args, opts) => {
                expect(opts).toBeTruthy();
                expect(opts.listeners).toBeTruthy();
                expect(opts.listeners.stdout).toBeInstanceOf(Function);
                opts.listeners.stdout('foo data!');
            })
            return hemtt('arg').then(result => {
                expect(result).toBe('foo data!');
            })
        })

        it('calls hemtt in the correct path', () => {
            expect.assertions(1);
            exec.exec.mockImplementation(() => {});
            return hemtt('arg').then(_ => {

                const execPath = exec.exec.mock.calls[0][0];

                if (process.platform === 'linux') {
                    expect(execPath).toBe(`${process.cwd()}` + '/tools/hemtt')
                } else {
                    expect(execPath).toBe(`${process.cwd()}` + '\\tools\\hemtt.exe')
                }
            })
        })
        it('registers failure', () => {
            expect.assertions(2);
            exec.exec.mockRejectedValueOnce(new Error('*dies*'));

            return hemtt('fu').catch(e => {
                expect(core.setFailed).toHaveBeenCalled();
                expect(e.message).toBe('*dies*');
            });
        })
    });
    describe('getVersion', () => {
        it('calls hemtt with --version', () => {
            exec.exec = jest.fn();
            return hemtt.getVersion().then(_ => {
                expect(exec.exec.mock.calls[0][1]).toEqual(['--version']);
            })
        })
    })
    describe('modBuildRelease', () => {
        it('calls hemtt with "build --release --force"', () => {
            exec.exec = jest.fn();
            return hemtt.modBuildRelease().then(_ => {
                expect(exec.exec.mock.calls[0][1]).toEqual(['build', '--release', '--force']);
            })
        })
    })
    describe('modZip', () => {
        it('calls hemtt with "zip $name"', () => {
            exec.exec = jest.fn();
            return hemtt.modZip('fooName').then(_ => {
                expect(exec.exec.mock.calls[0][1]).toEqual(['zip', 'fooName']);
            })
        })
    })
    describe('modVars', () => {
        it('calls hemtt with "var $formatString"', () => {
            exec.exec = jest.fn();
            return hemtt.modVar('formatString').then(_ => {
                expect(exec.exec.mock.calls[0][1]).toEqual(['var', 'formatString']);
            })
        })
    })
    describe('modGetVersion', () => {
        it('calls hemtt with "var {{version}}"', () => {
            exec.exec = jest.fn();
            return hemtt.modGetVersion().then(_ => {
                expect(exec.exec.mock.calls[0][1]).toEqual(['var', '{{version}}']);
            })
        })
    })
    describe('modVars', () => {
        it('calls hemtt with "var {{name}}"', () => {
            exec.exec = jest.fn();
            return hemtt.modGetName().then(_ => {
                expect(exec.exec.mock.calls[0][1]).toEqual(['var', '{{name}}']);
            })
        })
    })
});
