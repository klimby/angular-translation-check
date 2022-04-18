import { glob } from 'glob';
import LineByLine from 'n-readlines';
import path from 'path';
import { AppHtml } from '../types/app-html';
import { TranslateIdsMap } from '../types/app-xlf';
import { FilePosition, Id } from '../types/common';
import { Constants } from './constants';
import report from './report';

class HtmlProcessor implements AppHtml {

  /**
   * Translate map. Key - translate id, value - file and position/
   */
  private readonly _translateIdsMap: TranslateIdsMap = new Map<Id, FilePosition[]>([]);

  /**
   * "None" array - existing @@none in translation i18n field
   */
  private readonly _nonePositions: FilePosition[] = [];

  /**
   * Set files (init operation)
   * @param sourceRoots source roots map
   */
  parse(sourceRoots: Map<string, string>): void {
    const filesMap = this._getFilesMap(sourceRoots);
    this._setTranslateIdsMap(filesMap);
  }

  /**
   * Get translate files ids map
   */
  getTranslateIdsMap(): TranslateIdsMap {
    return this._translateIdsMap;
  }

  /**
   * None report
   */
  report(): void {
    if (this._nonePositions.length) {
      report.warning(`\nFind ${Constants.NoneKey} in html files:`);
      for (const filePosition of this._nonePositions) {
        report.warning(`\t- ${filePosition.fileName}. Line: ${filePosition.line}`);
      }
    }
  }

  /**
   * Get files map. Key - project name, value - html paths array
   * @param sourceRoots source root map
   */
  private _getFilesMap(sourceRoots: Map<string, string>): Map<string, string[]> {
    const filesMap: Map<string, string[]> = new Map<string, string[]>([]);
    for (const [name, root] of sourceRoots) {
      const files = glob.sync(root + '/**/*.html');
      filesMap.set(name, files);
    }
    return filesMap;
  }

  /**
   * Set translate ids map
   * @param filesMap files map
   */
  private _setTranslateIdsMap(filesMap: Map<string, string[]>): void {
    for (const files of filesMap.values()) {
      this._setTranslateMap(files);
    }
  }

  /**
   * Set translate map for project or lib
   * @param files project files
   */
  private _setTranslateMap(files: string[]): void {
    const regexp = /"@@(.+?)"/i;
    for (const file of files) {
      const fileName: string = path.basename(file);

      let liner: LineByLine;
      try {
        liner = new LineByLine(file);
      } catch (err) {
        report.error(`File not found: ${file}`);
        continue;
      }
      let line: Buffer | false;
      let lineNumber = 1;
      line = liner.next();
      while (line) {

        const str = line.toString('utf8');
        const match = str.match(regexp);
        if (match?.[1]) {
          const id: Id = match[1];
          const filePosition: FilePosition = { fileName, line: lineNumber };
          if (id === Constants.NoneKey) {
            this._nonePositions.push(filePosition);
          } else {
            const fp: FilePosition[] = this._translateIdsMap.get(id) ?? [];
            fp.push(filePosition);
            this._translateIdsMap.set(id, fp);
          }
        }
        lineNumber++;
        line = liner.next();
      }
    }
  }

}

export const htmlFactory = (): AppHtml => new HtmlProcessor();
