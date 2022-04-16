import { FilePosition, Id } from './common';

export interface AppXlf {
  readonly translateIdsMap: Map<Id, FilePosition[]>;

  parse(): void;

  report(): void;
}

