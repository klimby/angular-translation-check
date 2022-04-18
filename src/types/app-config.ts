export interface AppConfig {
  /**
   * Load and parse angular.json file
   */
  loadAngularJson(): void;

  /**
   * Get target locale
   */
  getLocale(): string;

  /**
   * Get project name
   */
  getProject(): string;

  /**
   * Get translation files
   */
  getTranslationFiles(): string[];

  /**
   * Get source roots map: key - project or lib name, value - root full path
   */
  getSourceRoots(): Map<string, string>;
}

