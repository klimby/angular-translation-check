import { FilePosition, Id } from './common';

export interface AppXlf {

  /**
   * Get translate files ids map
   */
  getTranslateIdsMap(): TranslateIdsMap;

  /**
   * PArse translation files
   * @param translationFiles array of translation files paths
   */
  parse(translationFiles: string[]): void;

  /**
   * Duplicate report
   */
  report(): void;
}

/**
 * Is - translate id, FilePositions - position in translate file
 */
export type TranslateIdsMap = Map<Id, FilePosition[]>;
