import cmdParser from '../src/command';

describe('command test', () => {

  it('test command arg', () => {

    const arg: string[] = [
      '/home/klim/.nvm/versions/node/v14.18.2/bin/node',
      '/home/klim/Projects/angular-translation-check/bin/cli.js',
      '--project',
      'app',
      '--libs',
      'lib1',
      'lib2',

    ];

    const argv = cmdParser(arg);
    expect(argv).toHaveProperty('project');
    expect(argv).toHaveProperty('libs');
    expect(argv.project).toEqual('app');
    expect(argv.libs).toEqual(['lib1', 'lib2']);
  });

});
