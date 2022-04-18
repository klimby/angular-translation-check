import { TranslateIdsMap } from './app-xlf';

export interface AppValidator {

  /**
   * Validate translate keys
   * @param htmlIdsMap html files ids map
   * @param xlfIdsMap translate files ids map
   */
  validate(htmlIdsMap: TranslateIdsMap, xlfIdsMap: TranslateIdsMap): void

  /**
   * Report validation result
   */
  report(): void;
}
