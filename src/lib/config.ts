import * as fs from 'fs';
import * as path from 'path';
import { AngularJson, AngularJsonProject, AngularProjectType } from '../types/angular-json';
import { AppConfig } from '../types/app-config';
import { CommandLine } from '../types/common';

class Config implements AppConfig {

  /**
   * Project root dir
   */
  private readonly _root: string;

  /**
   * Project name
   */
  private _project: string;

  /**
   * Selected locale
   */
  private _locale: string;

  /**
   * Additional libs names (define in command line)
   */
  private readonly _libs: string[];

  /**
   * Library roots
   */
  private readonly __sourceRoots: Map<string, string> = new Map<string, string>([]);

  /**
   * Project translation files
   */
  private _translationFiles: string[] = [];

  constructor(commandLine: CommandLine) {
    this._root = commandLine.root ? commandLine.root : process.cwd();
    this._project = commandLine.project;
    this._libs = commandLine.libs;
    this._locale = commandLine.locale;
  }

  /**
   * Get translation files
   */
  getTranslationFiles(): string[] {
    return this._translationFiles;
  }

  /**
   * Get project name
   */
  getProject(): string {
    return this._project;
  }

  /**
   * Get target locale
   */
  getLocale(): string {
    return this._locale;
  }

  /**
   * Get source roots map: key - project or lib name, value - root full path
   */
  getSourceRoots(): Map<string, string> {
    return this.__sourceRoots;
  }

  /**
   * Load and parse angular.json file
   */
  loadAngularJson(): void {
    const angularJson: AngularJson = this._getAngularJsonContent();
    this._parseAngularJson(angularJson);
  }
  /**
   * Get angular json content
   */
  private _getAngularJsonContent(): AngularJson {
    const angularJsonPath = path.join(this._root, 'angular.json');
    let angularJsonContent = '';
    try {
      angularJsonContent = fs.readFileSync(angularJsonPath, { encoding: 'utf-8' });
    } catch (err) {
      throw new Error(`Not found: ${angularJsonPath}`);
    }
    return JSON.parse(angularJsonContent);
  }

  /**
   * Parse angular.json file content
   * @param angularJson parsed angular.json
   */
  private _parseAngularJson(angularJson: AngularJson): void {
    this._validateVersion(angularJson);
    const project = this._getProject(angularJson);
    this._locale = this._getProjectLocale(project);
    this._translationFiles = this._getProjectTranslationFiles(project);
    this._setSourceRoots(angularJson);
  }

  /**
   * Set project roots
   * @param angularJson parsed angular.json file
   */
  private _setSourceRoots(angularJson: AngularJson): void {
    for (const [projectName, project] of Object.entries(angularJson.projects)) {
      if (projectName === this.getProject() || this._libs.includes(projectName)) {
        const sourceRoot = project.sourceRoot;
        const sourceRootPath = path.join(this._root, sourceRoot);
        this.__sourceRoots.set(projectName, sourceRootPath);
      }
    }
  }

  /**
   * Get translation files paths array
   * @param project target project
   */
  private _getProjectTranslationFiles(project: AngularJsonProject): string[] {
    const locale = this.getLocale();
    const translationFiles: string[] = [];
    if (project.i18n) {
      const translations: string | string[] = project.i18n.locales[locale].translation;
      if (Array.isArray(translations)) {
        for (const translationFile of translations) {
          const p = path.join(this._root, translationFile);
          translationFiles.push(p);
        }
      } else {
        const p = path.join(this._root, translations as string);
        translationFiles.push(p);
      }
    }
    return translationFiles;
  }

  /**
   * Get project from angular.json file.
   * If project name define in command line - get project, else get first of projects.
   * @param angularJson parsed angular.json
   */
  private _getProject(angularJson: AngularJson): AngularJsonProject {
    let project: AngularJsonProject | undefined;
    const hasProject = this.getProject() &&
                       this.getProject() in angularJson.projects &&
                       angularJson.projects[this.getProject()].projectType === AngularProjectType.Application;
    if (hasProject) {
      project = angularJson.projects[this.getProject()];
    } else {
      for (const [projectName, projectContent] of Object.entries(angularJson.projects)) {
        if (projectContent.projectType === AngularProjectType.Application) {
          this._project = projectName;
          project = projectContent;
          break; // first of projects
        }
      }
    }
    if (project) {
      return project;
    } else {
      throw new Error(`Project is not defined in angular.json: ${this.getProject()}`);
    }
  }

  /**
   * Validate angular.json version. Valid - 1
   * @param angularJson
   */
  private _validateVersion(angularJson: AngularJson): void {
    if (angularJson.version !== 1) {
      throw new Error(`Incompatible angular.json version: ${angularJson.version}`);
    }
  }

  /**
   * Get project locale
   * @param project angular project
   */
  private _getProjectLocale(project: AngularJsonProject): string {
    let locale = this.getLocale();
    if (!project.i18n) {
      throw new Error(`No define i18n field in angular.json for project ${this.getProject()}`);
    }
    if (locale && !(locale in project.i18n.locales)) {
      throw new Error(`Undefined locale ${locale}`);
    }
    if (!locale) {
      locale = Object.keys(project.i18n.locales)[0];
    }
    return locale;
  }

}

export const configFactory = (commandLine: CommandLine): AppConfig => new Config(commandLine);
