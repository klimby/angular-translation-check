import { AppValidator } from '../types/app-validator';
import { TranslateIdsMap } from '../types/app-xlf';
import { FilePosition, Id } from '../types/common';
import report from './report';

class Validator implements AppValidator {

  /**
   * Translate files error map
   */
  private _xlfNotFoundIdsMap: TranslateIdsMap = new Map<Id, FilePosition[]>([]);

  /**
   * Html files error map
   */
  private _htmlNotFoundIdsMap: TranslateIdsMap = new Map<Id, FilePosition[]>([]);

  /**
   * Validate translate keys
   * @param htmlIdsMap html files ids map
   * @param xlfIdsMap translate files ids map
   */
  validate(htmlIdsMap: TranslateIdsMap, xlfIdsMap: TranslateIdsMap): void {
    this._validateHtml(htmlIdsMap, xlfIdsMap);
    this._validateXlf(htmlIdsMap, xlfIdsMap);
  }

  /**
   * Validate html translate ids
   * @param htmlIdsMap html files ids map
   * @param xlfIdsMap translate files ids map
   */
  private _validateHtml(htmlIdsMap: TranslateIdsMap, xlfIdsMap: TranslateIdsMap): void {
    for (const [id, filePositions] of htmlIdsMap) {
      if (!xlfIdsMap.has(id)) {
        this._htmlNotFoundIdsMap.set(id, filePositions);
      }
    }
  }

  /**
   * Validate translate ids
   * @param htmlIdsMap html files ids map
   * @param xlfIdsMap translate files ids map
   */
  private _validateXlf(htmlIdsMap: TranslateIdsMap, xlfIdsMap: TranslateIdsMap): void {
    for (const [id, filePositions] of xlfIdsMap) {
      if (!htmlIdsMap.has(id)) {
        this._xlfNotFoundIdsMap.set(id, filePositions);
      }
    }
  }

  /**
   * Report validation result
   */
  report(): void {

    if (this._xlfNotFoundIdsMap.size) {
      report.warning('\nIds exists in language files and not exists in html:');
      for (const [id, filePositions] of this._xlfNotFoundIdsMap) {
        report.warning(`\n\tID: ${id}`);
        for (const filePosition of filePositions) {
          report.warning(`\t- ${filePosition.fileName}. Line: ${filePosition.line}`);
        }
      }
    } else {
      report.success('\nAll translate ids in language files is use.');
    }

    if (this._htmlNotFoundIdsMap.size) {
      report.warning('\nMissing translation for ids:');
      for (const [id, filePositions] of this._htmlNotFoundIdsMap) {
        report.warning(`\n\tID: ${id}`);
        for (const filePosition of filePositions) {
          report.warning(`\t- ${filePosition.fileName}. Line: ${filePosition.line}`);
        }
      }
    } else {
      report.success('\nHtml translate ok!');
    }

  }
}

export const validatorFactory = (): AppValidator => new Validator();
