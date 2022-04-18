import LineByLine from 'n-readlines';
import * as path from 'path';
import { AppXlf, TranslateIdsMap } from '../types/app-xlf';
import { FilePosition, Id } from '../types/common';
import { Constants } from './constants';
import report from './report';

class XlfProcessor implements AppXlf {

  private readonly _translateIdsMap: TranslateIdsMap = new Map<Id, FilePosition[]>([]);
  private readonly _duplicateIdsMap: Map<Id, FilePosition[]> = new Map<Id, FilePosition[]>([]);

  /**
   * Get translate files ids map
   */
  getTranslateIdsMap(): TranslateIdsMap {
    return this._translateIdsMap;
  }

  /**
   * PArse translation files
   * @param translationFiles array of translation files paths
   */
  parse(translationFiles: string[]): void {
    const regexp = /<trans-unit.+id=["'](.+?)["']/i;

    for (const file of translationFiles) {
      const fileName: string = path.basename(file);

      let liner: LineByLine;
      try {
        liner = new LineByLine(file);
      } catch (err) {
        throw new Error(`File not found: ${file}`);
      }
      let line: Buffer | false;
      let lineNumber = 1;
      line = liner.next();
      while (line) {

        const str = line.toString('utf8');
        const match = str.match(regexp);
        if (match?.[1]) {
          const id: Id = match[1];
          if(id === Constants.NoneKey) {
            lineNumber++;
            line = liner.next();
            continue;
          }
          const filePosition: FilePosition = { fileName, line: lineNumber };
          const fp: FilePosition[] = this._translateIdsMap.get(id) ?? [];
          const isExists = !!fp.length;
          fp.push(filePosition);
          this._translateIdsMap.set(id, fp);
          if (isExists) {
            this._duplicateIdsMap.set(id, fp);
          }
        }
        lineNumber++;
        line = liner.next();
      }
    }
  }

  /**
   * Duplicate report
   */
  report(): void {
    if (this._duplicateIdsMap.size) {
      report.warning('\nFind duplicates in language files:');
      for (const [id, filePositions] of this._duplicateIdsMap) {
        report.warning(`\n\tID: ${id}`);
        for (const filePosition of filePositions) {
          report.warning(`\t- ${filePosition.fileName}. Line: ${filePosition.line}`);
        }
      }
    } else {
      report.success('\nNo duplicates found in language files.');
    }
  }

}

export const xlfFactory = (): AppXlf => new XlfProcessor();
