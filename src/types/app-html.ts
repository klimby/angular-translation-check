import { TranslateIdsMap } from './app-xlf';

export interface AppHtml {

  /**
   * Set files (init operation)
   * @param sourceRoots source roots map
   */
  parse(sourceRoots: Map<string, string>): void;
  /**
   * Get translate files ids map
   */
  getTranslateIdsMap(): TranslateIdsMap;

  /**
   * None report
   */
  report(): void;
}
