export interface AngularJson {
  /**
   * schema version. Need 1
   */
  version: number;
  projects: {
    /**
     * Project name
     */
    [key: string]: AngularJsonProject
  };
}


export interface AngularJsonProject {
  /**
   * Project type. Need application
   */
  projectType: AngularProjectType,
  /**
   * Root dir. For find html files
   */
  sourceRoot: string,
  /**
   * 118n section (optional!)
   */
  i18n?: {
    locales: {
      /**
       * Locale name
       */
      [key: string]: {
        /**
         * Translation xlf file path from app root.
         * Example: locale/messages.en.xlf
         */
        translation: string | string[];
      }
    }
  }
}

export enum AngularProjectType {
  Application = 'application',
  Library = 'library'
}
