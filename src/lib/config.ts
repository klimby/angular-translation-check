import * as fs from 'fs';
import * as path from 'path';
import { AngularJson, AngularJsonProject, AngularProjectType, LocaleName, ProjectTranslation } from '../types/angular-json';
import { AppConfig } from '../types/app-config';
import { CommandLine } from '../types/common';

export class Config implements AppConfig{

  private readonly _root: string;

  private readonly _app;

  private readonly _libs: string[];

  readonly projectTranslations: Map<LocaleName, ProjectTranslation[]> =
      new Map<string, ProjectTranslation[]>([]);



  constructor(commandLine: CommandLine, root?: string) {
    this._root = root ?? process.cwd();
    this._app = commandLine.project;
    this._libs = commandLine.libs;
  }


  loadAngularJson(): void {
    const angularJsonPath = path.join(this._root, 'angular.json');
    let angularJsonContent = '';
    try {
      angularJsonContent = fs.readFileSync(angularJsonPath, { encoding: 'utf-8' });
    } catch (err) {
      throw new Error(`Not found: ${angularJsonPath}`);
    }
    const angularJson: AngularJson = JSON.parse(angularJsonContent);
    this._parseAngularJson(angularJson);
  }

  private _parseAngularJson(angularJson: AngularJson): void {
    if (angularJson.version !== 1) {
      throw new Error(`Incompatible angular.json version: ${angularJson.version}`);
    }
    for (const [name, angularJsonProject] of Object.entries(angularJson.projects)) {
      if (angularJsonProject.projectType === AngularProjectType.Application && angularJsonProject.i18n) {
        if(this._app && this._app !== name) {
          continue;
        }
        this._setProject(name, angularJsonProject);
      }
    }
  }

  private _setProject(name: string, angularJsonProject: AngularJsonProject): void {
    if (angularJsonProject.i18n) {
      for (const [locale, translationFiles] of Object.entries(angularJsonProject.i18n.locales)) {
        const translations: string[] = [];
        if (Array.isArray(translationFiles.translation)) {
          for (const translationFile of translationFiles.translation) {
            const p = path.join(this._root, translationFile);
            translations.push(p);
          }
        } else {
          const p = path.join(this._root, translationFiles.translation as string);
          translations.push(p);
        }
        const projectTranslation: ProjectTranslation = { name, translations };
        const ps = this.projectTranslations.get(locale) ?? [];
        ps.push(projectTranslation);
        this.projectTranslations.set(locale, ps);
      }
    }
  }

}

export const configFactory = (commandLine: CommandLine, root?: string): AppConfig => new Config(commandLine, root);
