import cmdParser from './command';
import { configFactory } from './lib/config';
import { htmlFactory } from './lib/html-processor';
import report from './lib/report';
import { validatorFactory } from './lib/validator';
import { xlfFactory } from './lib/xlf-processor';

const angularTranslationCheck = async function angularTranslationCheck(arg: string[]) {

  const argv = cmdParser(arg);
  try {
    const config = configFactory(argv);
    const xlf = xlfFactory();
    const html = htmlFactory();
    const validator = validatorFactory();

    config.loadAngularJson();

    xlf.parse(config.getTranslationFiles());
    html.parse(config.getSourceRoots());
    validator.validate(html.getTranslateIdsMap(), xlf.getTranslateIdsMap());

    report.success('\nCheck translate files in angular project.');
    report.success(`Project: ${config.getProject()}`);
    report.success(`Locale: ${config.getLocale()}`);

    xlf.report();
    html.report();
    validator.report();

  } catch (err) {
    if (err instanceof Error) {
      report.error(err.message);
    }
  }
};

module.exports = angularTranslationCheck;
export default angularTranslationCheck;

