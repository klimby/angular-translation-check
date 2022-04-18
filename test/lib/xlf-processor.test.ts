import * as path from 'path';
import report from '../../src/lib/report';
import { xlfFactory } from '../../src/lib/xlf-processor';
import { AppXlf } from '../../src/types/app-xlf';
import { FilePosition, Id } from '../../src/types/common';

interface TestXlf extends AppXlf {
  _duplicateIdsMap: Map<Id, FilePosition[]>;
}

const getTestXlf = (): TestXlf => xlfFactory() as TestXlf;

describe('xlf test', () => {

  const one = path.join(process.cwd(), 'test/suites/02/one.en.xlf');
  const two = path.join(process.cwd(), 'test/suites/02/two.en.xlf');

  it('test factory', () => {
    const xlf = getTestXlf();
    expect(xlf)
        .toHaveProperty('getTranslateIdsMap');
    expect(xlf)
        .toHaveProperty('parse');
    expect(xlf)
        .toHaveProperty('report');
  });

  it('test parse error', () => {
    const translationFile = 'asd';
    const xlf = getTestXlf();
    const t = () => {
      xlf.parse([translationFile]);
    };
    expect(t)
        .toThrow(`File not found: ${translationFile}`);
  });



  it('test parse one', async () => {
    const xlf = getTestXlf();
    xlf.parse([one]);

    const duplicateIdsMap = xlf._duplicateIdsMap;

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
          .toEqual(16);
      expect(filePositions[1].line)
          .toEqual(21);
    }

    const translateIdsMap = xlf.getTranslateIdsMap();
    expect(translateIdsMap.get('none')).toBeUndefined();
    expect(translateIdsMap.get('one:one')).toBeDefined();
    expect(translateIdsMap.get('one:two')).toBeDefined();
    expect(translateIdsMap.get('one:three')).toBeDefined();

  });

  it('test parse one and two', () => {
    const xlf = getTestXlf();
    xlf.parse([one, two]);

    const duplicateIdsMap = xlf._duplicateIdsMap;
    expect(duplicateIdsMap.size)
        .toEqual(2);
    expect(duplicateIdsMap.get('one:two'))
        .toBeDefined();

    expect(duplicateIdsMap.get('one:three'))
        .toBeDefined();
    const filePositions = duplicateIdsMap.get('one:three');
    if (filePositions) {
      expect(filePositions.length)
          .toEqual(2);
      expect(filePositions[0].fileName)
          .toEqual('one.en.xlf');
      expect(filePositions[1].fileName)
          .toEqual('two.en.xlf');
      expect(filePositions[0].line)
          .toEqual(26);
      expect(filePositions[1].line)
          .toEqual(10);
    }

    const translateIdsMap = xlf.getTranslateIdsMap();
    expect(translateIdsMap.get('none')).toBeUndefined();
    expect(translateIdsMap.get('one:one')).toBeDefined();
    expect(translateIdsMap.get('one:two')).toBeDefined();
    expect(translateIdsMap.get('one:three')).toBeDefined();
    expect(translateIdsMap.get('two:one')).toBeDefined();
    //  console.log(duplicateIdsMap);
  });

  it('test report ok', () => {
    const xlf = getTestXlf();
    xlf.parse([two]);

    jest.spyOn(report, 'success')
        .mockImplementation();
    xlf.report();
    expect(report.success)
        .toBeCalledTimes(1);
  });

  it('test report', () => {
    const xlf = getTestXlf();
    xlf.parse([one]);

    jest.spyOn(report, 'warning')
        .mockImplementation();
    xlf.report();
    expect(report.warning)
        .toBeCalledTimes(4);
  });

});
