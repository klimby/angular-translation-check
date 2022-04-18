import report from '../../src/lib/report';
import { validatorFactory } from '../../src/lib/validator';
import { AppValidator } from '../../src/types/app-validator';
import { TranslateIdsMap } from '../../src/types/app-xlf';
import { FilePosition, Id } from '../../src/types/common';

interface TestValidator extends AppValidator {
  _xlfNotFoundIdsMap: TranslateIdsMap;
  _htmlNotFoundIdsMap: TranslateIdsMap;

  _validateHtml(htmlIdsMap: TranslateIdsMap, xlfIdsMap: TranslateIdsMap): void;

  _validateXlf(htmlIdsMap: TranslateIdsMap, xlfIdsMap: TranslateIdsMap): void;
}

const getTestValidator = (): TestValidator => validatorFactory() as TestValidator;

describe('validator test', () => {

  it('test _validateHtml', () => {

    const validator = getTestValidator();
    const htmlIdsMap: TranslateIdsMap = new Map<Id, FilePosition[]>([
      ['one', [{ fileName: 'foo.html', line: 1 }]],
      ['two', [{ fileName: 'foo.html', line: 2 }]],
    ]);
    const xlfIdsMap: TranslateIdsMap = new Map<Id, FilePosition[]>([
      ['one', [{ fileName: 'foo.xlf', line: 1 }]],
    ]);
    validator._validateHtml(htmlIdsMap, xlfIdsMap);
    const htmlNotFoundIdsMap = validator._htmlNotFoundIdsMap;
    expect(htmlNotFoundIdsMap.size).toEqual(1);
    expect(htmlNotFoundIdsMap.has('two')).toBeTruthy();
  });

  it('test _validateXlf', () => {

    const validator = getTestValidator();
    const htmlIdsMap: TranslateIdsMap = new Map<Id, FilePosition[]>([
      ['one', [{ fileName: 'foo.html', line: 1 }]],
    ]);
    const xlfIdsMap: TranslateIdsMap = new Map<Id, FilePosition[]>([
      ['one', [{ fileName: 'foo.xlf', line: 1 }]],
      ['two', [{ fileName: 'foo.xlf', line: 2 }]],
    ]);
    validator._validateXlf(htmlIdsMap, xlfIdsMap);
    const xlfNotFoundIdsMap = validator._xlfNotFoundIdsMap;
    expect(xlfNotFoundIdsMap.size).toEqual(1);
    expect(xlfNotFoundIdsMap.has('two')).toBeTruthy();
  });

  it('test validate', () => {

    const validator = getTestValidator();
    const htmlIdsMap: TranslateIdsMap = new Map<Id, FilePosition[]>([
      ['one', [{ fileName: 'foo.html', line: 1 }]],
      ['three', [{ fileName: 'foo.html', line: 3 }]],
    ]);
    const xlfIdsMap: TranslateIdsMap = new Map<Id, FilePosition[]>([
      ['one', [{ fileName: 'foo.xlf', line: 1 }]],
      ['two', [{ fileName: 'foo.xlf', line: 2 }]],
    ]);
    validator.validate(htmlIdsMap, xlfIdsMap);

    const htmlNotFoundIdsMap = validator._htmlNotFoundIdsMap;
    expect(htmlNotFoundIdsMap.size).toEqual(1);
    expect(htmlNotFoundIdsMap.has('three')).toBeTruthy();

    const xlfNotFoundIdsMap = validator._xlfNotFoundIdsMap;
    expect(xlfNotFoundIdsMap.size).toEqual(1);
    expect(xlfNotFoundIdsMap.has('two')).toBeTruthy();
  });

  it('test report warning', () => {

    const validator = getTestValidator();
    validator._xlfNotFoundIdsMap.set('one', [{ fileName: 'foo.xlf', line: 1 }]);
    validator._htmlNotFoundIdsMap.set('one', [{ fileName: 'foo.html', line: 1 }]);
    jest.spyOn(report, 'warning')
        .mockImplementation();
    validator.report();
    expect(report.warning)
        .toBeCalledTimes(6);
  });

  it('test report OK', () => {

    const validator = getTestValidator();
    jest.spyOn(report, 'success')
        .mockImplementation();
    validator.report();
    expect(report.success)
        .toBeCalledTimes(2);
  });

});
