import * as path from 'path';
import { configFactory } from '../../src/lib/config';
import { AngularJson, AngularJsonProject, AngularProjectType } from '../../src/types/angular-json';
import { AppConfig } from '../../src/types/app-config';
import { CommandLine } from '../../src/types/common';

interface TestConfig extends AppConfig {
  _root: string;
  _setSourceRoots(angularJson: Partial<AngularJson>): void;

  _getAngularJsonContent(): AngularJson;

  _parseAngularJson(angularJson: Partial<AngularJson>): void;

  _getProjectTranslationFiles(project: Partial<AngularJsonProject>): string[];

  _getProject(angularJson: Partial<AngularJson>): AngularJsonProject;

  _validateVersion(angularJson: Partial<AngularJson>): void;

  _getProjectLocale(project: Partial<AngularJsonProject>): string;
}

const defaultCommandLine: CommandLine = {
  project: '',
  libs: [],
  locale: '',
  root: '',
};

const getCommandLine = (o: Partial<CommandLine> = {}): CommandLine => Object.assign({}, defaultCommandLine, o);

const getTestConfig = (o: Partial<CommandLine>): TestConfig => configFactory(getCommandLine(o)) as TestConfig;


const angularJsonStub: AngularJson = {
  version: 1,
  projects: {
    app: {
      projectType: AngularProjectType.Application,
      sourceRoot: 'app-source',
      i18n: {
        locales: {
          en: {
            translation: 'foo'
          }
        }
      }
    },
    lib: {
      projectType: AngularProjectType.Library,
      sourceRoot: 'app-lib'
    }
  }
};

describe('config test', () => {

  it('test config factory', () => {
    const config = getTestConfig(defaultCommandLine);
    expect(config)
        .toHaveProperty('loadAngularJson');
    expect(config)
        .toHaveProperty('getLocale');
    expect(config)
        .toHaveProperty('getProject');
    expect(config)
        .toHaveProperty('getTranslationFiles');
    expect(config)
        .toHaveProperty('getSourceRoots');
  });

  it('test not found test', () => {
    const root = path.join(process.cwd(), 'test/suites');
    const config = getTestConfig({ root });
    const t = () => {
      config.loadAngularJson();
    };
    expect(t)
        .toThrow(Error);
  });

  it('test _validateVersion', () => {
    const config = getTestConfig({});
    const angularJson: Partial<AngularJson> = {
      version: 2,
    };
    const t = () => {
      config._validateVersion(angularJson);
    };
    expect(t)
        .toThrow(Error);
  });

  it('test _getProjectLocale error i18n', () => {
    const config = getTestConfig({ project: 'app' });
    const project: Partial<AngularJsonProject> = {};
    const t = () => {
      config._getProjectLocale(project);
    };
    expect(t)
        .toThrow(Error);
    expect(t)
        .toThrow(`No define i18n field in angular.json for project ${config.getProject()}`);
  });

  it('test _getProjectLocale error Undefined locale', () => {
    const config = getTestConfig({ project: 'app', locale: 'ru' });
    const project: Partial<AngularJsonProject> = {
      i18n: {
        locales: {
          en: {
            translation: 'asd',
          },
        },
      },
    };
    const t = () => {
      config._getProjectLocale(project);
    };
    expect(t)
        .toThrow(Error);
    expect(t)
        .toThrow(`Undefined locale ${config.getLocale()}`);
  });

  it('test _getProjectLocale Undefined locale', () => {
    const config = getTestConfig({ project: 'app' });
    const project: Partial<AngularJsonProject> = {
      i18n: {
        locales: {
          en: {
            translation: 'asd',
          },
        },
      },
    };
    const locale = config._getProjectLocale(project);
    expect(locale)
        .toEqual('en');
  });

  it('test _getProject error Project is not defined', () => {
    const config = getTestConfig({});
    const angularJson: Partial<AngularJson> = {
      projects: {},
    };
    const t = () => {
      config._getProject(angularJson);
    };
    expect(t)
        .toThrow(Error);
    expect(t)
        .toThrow(`Project is not defined in angular.json: ${config.getProject()}`);
  });

  it('test _getProject', () => {
    const config = getTestConfig({ project: 'app' });
    const angularJson: Partial<AngularJson> = {
      projects: {
        app: {
          projectType: AngularProjectType.Application,
          sourceRoot: 'asd',
        },
      },
    };
    const p = config._getProject(angularJson);
    expect(p.sourceRoot)
        .toEqual('asd');
    expect(config.getProject())
        .toEqual('app');
  });

  it('test _getProject without command line', () => {
    const config = getTestConfig({});
    const angularJson: Partial<AngularJson> = {
      projects: {
        app: {
          projectType: AngularProjectType.Application,
          sourceRoot: 'asd',
        },
      },
    };
    const p = config._getProject(angularJson);
    expect(p.sourceRoot)
        .toEqual('asd');
    expect(config.getProject())
        .toEqual('app');
  });

  it('test _getProjectTranslationFiles where files is string', () => {
    const config = getTestConfig({locale: 'en'});
    const project: Partial<AngularJsonProject> = {
      i18n: {
        locales: {
          en: {
            translation: 'foo',
          },
        },
      },
    };
    const translationFiles = config._getProjectTranslationFiles(project);
    const expected =  path.join(config._root, 'foo');
    expect(translationFiles).toEqual([expected]);
  });

  it('test _getProjectTranslationFiles where files is string', () => {
    const config = getTestConfig({locale: 'en'});
    const project: Partial<AngularJsonProject> = {
      i18n: {
        locales: {
          en: {
            translation: ['foo', 'bar'],
          },
        },
      },
    };
    const translationFiles = config._getProjectTranslationFiles(project);
    const foo =  path.join(config._root, 'foo');
    const bar =  path.join(config._root, 'bar');
    expect(translationFiles).toEqual([foo, bar]);
  });

  it('test _setSourceRoots', () => {
    const config = getTestConfig({project: 'app', libs: ['lib']});
    config._setSourceRoots(angularJsonStub);
    const sourceRoots = config.getSourceRoots();
    const app = sourceRoots.get('app');
    expect(app).toBeDefined();
    expect(app).toEqual(path.join(config._root, angularJsonStub.projects.app.sourceRoot));
    const lib = sourceRoots.get('lib');
    expect(lib).toBeDefined();
    expect(lib).toEqual(path.join(config._root, angularJsonStub.projects.lib.sourceRoot));
  });

  it('test _parseAngularJson', () => {
    const config = getTestConfig({});
    config._parseAngularJson(angularJsonStub);

    expect(config.getProject()).toEqual('app');
    expect(config.getLocale()).toEqual('en');
    expect(config.getTranslationFiles())
        .toEqual([path.join(config._root, angularJsonStub.projects.app.i18n!.locales.en.translation as string)]);

    const sourceRoots = config.getSourceRoots();
    const app = sourceRoots.get('app');
    expect(app).toBeDefined();
    expect(app).toEqual(path.join(config._root, angularJsonStub.projects.app.sourceRoot));
  });

  it('test _getAngularJsonContent error', () => {
    const config = getTestConfig({});
    const t = () => {
      config._getAngularJsonContent();
    };
    const angularJsonPath = path.join(config._root, 'angular.json');
    expect(t)
        .toThrow(`Not found: ${angularJsonPath}`);
  });

  it('test _getAngularJsonContent', () => {
    const config = getTestConfig({project: 'one', root: 'test/suites/01'});
    const angularJson = config._getAngularJsonContent();
    expect(angularJson.projects.one).toBeDefined();
  });

  it('test loadAngularJson', () => {
    const config = getTestConfig({project: 'one', root: 'test/suites/01'});
    config.loadAngularJson();
    expect(config.getProject()).toEqual('one');
    expect(config.getLocale()).toEqual('en');
  });

});
