import path from 'path';
import { htmlFactory } from '../../src/lib/html-processor';
import report from '../../src/lib/report';
import { AppHtml } from '../../src/types/app-html';
import { FilePosition } from '../../src/types/common';

interface TestHtml extends AppHtml {
  _nonePositions: FilePosition[];

  _setTranslateIdsMap(filesMap: Map<string, string[]>): void;

  _getFilesMap(sourceRoots: Map<string, string>): Map<string, string[]>;
}

const getTestHtml = (): TestHtml => htmlFactory() as TestHtml;

const one = path.join(process.cwd(), 'test/suites/03/one.html');
const two = path.join(process.cwd(), 'test/suites/03/sub/two.html');

describe('html processor test', () => {

  it('test _setTranslateIdsMap', () => {
    const filesMap: Map<string, string[]> = new Map<string, string[]>([]);
    filesMap.set('app', [one, two]);
    const html = getTestHtml();
    html._setTranslateIdsMap(filesMap);
    const translateIdsMap = html.getTranslateIdsMap();
    const nonePositions = html._nonePositions;

    expect(translateIdsMap.size)
        .toEqual(3);
    expect(translateIdsMap.get('one:one')![0].fileName)
        .toEqual('one.html');
    expect(translateIdsMap.get('one:one')![0].line)
        .toEqual(2);
    expect(translateIdsMap.get('two:one')![0].fileName)
        .toEqual('two.html');
    expect(translateIdsMap.get('two:one')![0].line)
        .toEqual(1);
    expect(translateIdsMap.get('one:two')!.length)
        .toEqual(2);

    expect(nonePositions)
        .toHaveLength(1);

    const nonePosition = nonePositions[0];
    expect(nonePosition.fileName)
        .toEqual('one.html');
    expect(nonePosition.line)
        .toEqual(1);
  });

  it('test _setTranslateIdsMap with error', () => {
    const filesMap: Map<string, string[]> = new Map<string, string[]>([]);
    filesMap.set('app', [one, 'asdasd']);
    const html = getTestHtml();
    jest.spyOn(report, 'error')
        .mockImplementation();
    html._setTranslateIdsMap(filesMap);
    expect(report.error)
        .toBeCalledTimes(1);
  });

  it('test _getFilesMap', () => {
    const sourceRoots: Map<string, string> = new Map<string, string>([]);
    sourceRoots.set('app', path.join(process.cwd(), 'test/suites/03'));
    const html = getTestHtml();

    const filesMap = html._getFilesMap(sourceRoots);

    expect(filesMap.get('app'))
        .toBeDefined();
    const files: string[] = filesMap.get('app')!;
    expect(files)
        .toHaveLength(2);
    expect(files)
        .toContain(one);
    expect(files)
        .toContain(two);
  });

  it('test report', () => {
    const html = getTestHtml();
    html._nonePositions = [
      {
        fileName: 'foo',
        line: 1
      }
    ];
    jest.spyOn(report, 'warning')
        .mockImplementation();
    html.report();
    expect(report.warning)
        .toBeCalledTimes(2);
  });

  it('test parse', () => {
    const sourceRoots: Map<string, string> = new Map<string, string>([]);
    sourceRoots.set('app', path.join(process.cwd(), 'test/suites/03'));
    const html = getTestHtml();
    html.parse(sourceRoots);
    const translateIdsMap = html.getTranslateIdsMap();
    expect(translateIdsMap.has('one:one')).toBeTruthy();
    expect(translateIdsMap.has('one:two')).toBeTruthy();
    expect(translateIdsMap.has('two:one')).toBeTruthy();
  });

});
