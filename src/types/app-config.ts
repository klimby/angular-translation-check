import { ProjectTranslation } from './angular-json';

export interface AppConfig {
  readonly projectTranslations: Map<string, ProjectTranslation[]>;
  loadAngularJson(): void;
}

