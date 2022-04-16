export interface CommandLine {
  project: string;
  libs: string[];
}

export type Id = string;

export interface FilePosition {
  fileName: string;
  line: number;
}

