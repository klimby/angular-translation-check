import report from '../../src/lib/report';

describe('report test', () => {

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('error test', () => {
    jest.spyOn(console, 'log')
        .mockImplementation();
    report.error('message');
    expect(console.log)
        .toBeCalledTimes(1);
  });

  it('warning test', () => {
    jest.spyOn(console, 'log')
        .mockImplementation();
    report.warning('message');
    expect(console.log)
        .toBeCalledTimes(1);
  });

  it('success test', () => {
    jest.spyOn(console, 'log')
        .mockImplementation();
    report.success('message');
    expect(console.log)
        .toBeCalledTimes(1);
  });

});
