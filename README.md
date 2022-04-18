![MIT license](https://img.shields.io/badge/license-MIT-green.svg?style=plastic "MIT")
![Version v0.0.10](https://img.shields.io/badge/version-v0.0.10-blue.svg?style=plastic "Version v0.0.10")

[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)

![Node.js](https://img.shields.io/badge/Node.js-14.18.2(Fermium)-yellow.svg?style=plastic "Node.js")

# Angular Translation Files checker

Check [Angular translation](https://angular.io/guide/i18n-common-overview) file for single project or monorepository. Work with XLIFF translation files.

## Highlights
- Find duplicate ids in XLIFF translation files
- Search for missing XLIFF ids (available in html, not in XLIFF)
- Search for missing html ids (available in XLIFF, not in html)
- Find @@none ids in html

## Install

```
npm i @klimby/angular-translation-check --save-dev
```

## Usage

Add script to Angular project `package.json` file. Example:

```
...
 "scripts": {
        "translate-test": "angular-translation-check"
    },
...

```

Run npm script.

### Command line options

#### --project

Angular project name from `angular.json` file. If not specified, the first project from file `angular.json` will be taken.
Example: 
```
"translate-test": "angular-translation-check --project app"
```

#### --libs

For use in monorepository with libraries. Example, in `angular.json`:

```
{
  ...
  "projects": {
    "app": {
      "projectType": "application",
      ...
    },
    "lib01": {
      "projectType": "library",
      ...
    },
    "lib02": {
      "projectType": "library",
      ...
    }
  }
}
```

Example:
```
"translate-test": "angular-translation-check --project app --libs lib01 lib02"
```
Several libraries are specified with a space

#### --locale

An example of using multiple locales in `angular.json` file:

```
{
  ...
  "projects": {
    "app": {
      "projectType": "application",
      "i18n": {
        "locales": {
          "en": {
            "translation": "locale/app.en.xlf"
          },
          "fr": {
            "translation": "locale/app.fr.xlf"
          }
        }
      },
      ...
    },
  }
}
```

To select a specific locale, you must specify:
```
"translate-test": "angular-translation-check --project app --locale fr"
```
If no locale is specified, the first specified locale will be selected.

#### --root

Used to specify the project root directory (location of the `angular.json` file). As a rule, the `angular.json` file is located in the script launch directory and does not need to be changed.

Example:

```
"translate-test": "angular-translation-check --project app --root path/to/angular"
```


## Dev

```
git clone ssh://git@github.com/klimby/angular-translation-check.git
cd angular-translation-check
npm install
```
