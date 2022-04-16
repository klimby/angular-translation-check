import * as path from 'path';
import { xlfFactory } from '../../src/lib/xlf';
import { FilePosition } from '../../src/types/common';

describe('xlf test', () => {

  const locale = 'en';
  const project = 'app';
  const one = path.join(process.cwd(), 'test/suites/02/one.en.xlf');
  const two = path.join(process.cwd(), 'test/suites/02/two.en.xlf');

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('test config factory', () => {
    const xlf = xlfFactory(locale, project, []);
    expect(xlf)
        .toHaveProperty('translateIdsMap');
    expect(xlf)
        .toHaveProperty('parse');
    expect(xlf)
        .toHaveProperty('report');
  });

  it('test parse error', () => {
    const translationFiles: string[] = ['asdasd'];
    const xlf = xlfFactory(locale, project, translationFiles);
    const t = () => {
      xlf.parse();
    };
    expect(t)
        .toThrow(Error);
  });

  it('test parse one', () => {
    const translationFiles: string[] = [one];
    const xlf = xlfFactory(locale, project, translationFiles);
    xlf.parse();
    const duplicateIdsMap = xlf['_duplicateIdsMap'];
    expect(duplicateIdsMap.size)
        .toEqual(1);
    expect(duplicateIdsMap.get('one:two'))
        .toBeDefined();
    const filePositions: FilePosition[] | undefined = duplicateIdsMap.get('one:two');
    if (filePositions) {
      expect(filePositions.length)
          .toEqual(2);
      expect(filePositions[0].fileName)
          .toEqual('one.en.xlf');
      expect(filePositions[1].fileName)
          .toEqual('one.en.xlf');
      expect(filePositions[0].line)
          .toEqual(11);
      expect(filePositions[1].line)
          .toEqual(16);
    }

  });

  it('test parse one and two', () => {
    const translationFiles: string[] = [one, two];
    const xlf = xlfFactory(locale, project, translationFiles);
    xlf.parse();
    const duplicateIdsMap = xlf['_duplicateIdsMap'];
    expect(duplicateIdsMap.size)
        .toEqual(2);
    expect(duplicateIdsMap.get('one:two'))
        .toBeDefined();
    let filePositions: FilePosition[] | undefined = duplicateIdsMap.get('one:two');
    if (filePositions) {
      expect(filePositions.length)
          .toEqual(2);
      expect(filePositions[0].fileName)
          .toEqual('one.en.xlf');
      expect(filePositions[1].fileName)
          .toEqual('one.en.xlf');
      expect(filePositions[0].line)
          .toEqual(11);
      expect(filePositions[1].line)
          .toEqual(16);
    }

    expect(duplicateIdsMap.get('one:three'))
        .toBeDefined();
    filePositions = duplicateIdsMap.get('one:three');
    if (filePositions) {
      expect(filePositions.length)
          .toEqual(2);
      expect(filePositions[0].fileName)
          .toEqual('one.en.xlf');
      expect(filePositions[1].fileName)
          .toEqual('two.en.xlf');
      expect(filePositions[0].line)
          .toEqual(21);
      expect(filePositions[1].line)
          .toEqual(10);
    }

    //  console.log(duplicateIdsMap);
  });

  it('test report ok', () => {
    const translationFiles: string[] = [two];
    const xlf = xlfFactory(locale, project, translationFiles);
    xlf.parse();

    jest.spyOn(console, 'log')
        .mockImplementation();
    xlf.report();
    expect(console.log)
        .toBeCalledTimes(3);
  });

  it('test report', () => {
    const translationFiles: string[] = [one];
    const xlf = xlfFactory(locale, project, translationFiles);
    xlf.parse();

    jest.spyOn(console, 'log')
        .mockImplementation();
    xlf.report();
    expect(console.log)
        .toBeCalledTimes(5);
  });

});
