// eslint-disable-next-line @typescript-eslint/no-var-requires
//const angularTranslationCheck = require('../dist/index');

import angularTranslationCheck from '../src';
import report from '../src/lib/report';
import { ProjectTranslation } from '../src/types/angular-json';

describe('index test', () => {

  it('test error', async () => {
    jest.spyOn(report, 'error')
        .mockImplementation();

    await angularTranslationCheck([]);
    expect(report.error)
        .toBeCalledTimes(1);
  });

  it('test OK', async () => {

    jest.mock('../src/lib/config', () => {
      return jest.fn()
          .mockImplementation(() => {
            return {
              projectTranslations: new Map<string, ProjectTranslation[]>([]),
              loadAngularJson: jest.fn(),
            };
          });
    });

    jest.spyOn(report, 'error')
        .mockImplementation();

    await angularTranslationCheck([]);
    expect(report.error)
        .toBeCalledTimes(0);
  });

});
