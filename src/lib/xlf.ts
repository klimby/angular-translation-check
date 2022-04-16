import LineByLine from 'n-readlines';
import * as path from 'path';
import { LocaleName, Project } from '../types/angular-json';
import { AppXlf } from '../types/app-xlf';
import { FilePosition, Id } from '../types/common';
import report from './report';

class Xlf implements AppXlf {

  readonly translateIdsMap: Map<Id, FilePosition[]> = new Map<Id, FilePosition[]>([]);
  private readonly _duplicateIdsMap: Map<Id, FilePosition[]> = new Map<Id, FilePosition[]>([]);

  constructor(
      public locale: LocaleName,
      public project: Project,
      private _translationFiles: string[]) {
  }

  parse(): void {
    const regexp = /<trans-unit.+id=["'](.+?)["']/i;

    for (const file of this._translationFiles) {
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
          const filePosition: FilePosition = { fileName, line: lineNumber };
          const fp: FilePosition[] = this.translateIdsMap.get(id) ?? [];
          const isExists = !!fp.length;
          fp.push(filePosition);
          this.translateIdsMap.set(id, fp);
          if (isExists) {
            this._duplicateIdsMap.set(id, fp);
          }
        }
        lineNumber++;
        line = liner.next();
      }
    }
  }

  report(): void {
    if (this._duplicateIdsMap.size) {
      report.warning(`\nProject: ${this.project}`);
      report.warning(`Locale: ${this.locale}`);
      for (const [id, filePositions] of this._duplicateIdsMap) {
        report.warning(`\n\tID: ${id}`);
        for (const filePosition of filePositions) {
          report.warning(`\t- ${filePosition.fileName}. Line: ${filePosition.line}`);
        }

      }
    } else {
      report.success(`\nProject: ${this.project}`);
      report.success(`Locale: ${this.locale}`);
      report.success('No duplicates found in language files.');
    }
  }

}

export const xlfFactory = (locale: LocaleName, project: Project, translationFiles: string[]) => new Xlf(locale, project, translationFiles);
