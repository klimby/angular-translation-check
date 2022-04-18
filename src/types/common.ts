/**
 * Command line args
 */
export interface CommandLine {
  /**
   * Target project name
   */
  project: string;

  /**
   * Target libs names
   */
  libs: string[];

  /**
   * Target locale
   */
  locale: string;

  /**
   * Project root
   */
  root: string;
}

export type Id = string;

export interface FilePosition {
  fileName: string;
  line: number;
}

