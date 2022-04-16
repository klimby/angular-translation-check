import * as path from 'path';
import { Config, configFactory } from '../../src/lib/config';
import { AngularJson, AngularProjectType } from '../../src/types/angular-json';
import { CommandLine } from '../../src/types/common';

const defaultCommandLine: CommandLine = {
  project: '',
  libs: [],
};

describe('config test', () => {

  it('test config factory', () => {
    const root = path.join(process.cwd(), 'test/suites');
    const config = configFactory(defaultCommandLine, root);
    expect(config)
        .toHaveProperty('projectTranslations');
    expect(config)
        .toHaveProperty('loadAngularJson');
  });

  it('test not found test', () => {
    const root = path.join(process.cwd(), 'test/suites');
    const config = configFactory(defaultCommandLine, root);
    const t = () => {
      config.loadAngularJson();
    };
    expect(t)
        .toThrow(Error);
  });

  it('test Incompatible angular.json version', () => {
    const config = new Config(defaultCommandLine);
    const angularJson: AngularJson = {
      version: 2,
      projects: {
        app: {
          projectType: AngularProjectType.Application,
          sourceRoot: 'asd',
        },
      },
    };
    const t = () => {
      config['_parseAngularJson'](angularJson);
    };
    expect(t)
        .toThrow(Error);
  });

  it('test projectTranslations suite 01', () => {
    const root = path.join(process.cwd(), 'test/suites/01');
    const config = configFactory(defaultCommandLine, root);
    config.loadAngularJson();
    expect(config.projectTranslations.size)
        .toEqual(1);
    expect(config.projectTranslations.has('en'))
        .toBeTruthy();
    const ps = config.projectTranslations.get('en');
    expect(ps)
        .toBeDefined();
    if (ps) {
      expect(ps.length)
          .toEqual(2);
    }
  });

  it('test projectTranslations suite 01 with project', () => {
    const root = path.join(process.cwd(), 'test/suites/01');
    const commandLine: CommandLine = {
      project: 'one',
      libs: [],
    };
    const config = configFactory(commandLine, root);
    config.loadAngularJson();
    const ps = config.projectTranslations.get('en');
    if (ps) {
      expect(ps.length)
          .toEqual(1);
    }
  });
});
