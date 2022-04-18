import angularTranslationCheck from '../src';
import report from '../src/lib/report';

describe('index test', () => {


  it('test error', async () => {

    jest.spyOn(report, 'error')
        .mockImplementation();
    await angularTranslationCheck([]);
    expect(report.error)
        .toBeCalledTimes(1);
  });

  it('test Ok', async () => {

    jest.spyOn(report, 'error')
        .mockImplementation();
    jest.spyOn(console, 'log')
        .mockImplementation();
    await angularTranslationCheck([
      '--project',
      'one',
      '--locale',
      'en',
      '--root',
      'test/suites/01',
      '--libs',
      'lib',
    ]);
    expect(report.error)
        .toBeCalledTimes(0);
    expect(console.log)
        .toBeCalled();
  });

});
