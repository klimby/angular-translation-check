import cmdParser from './command';
import { configFactory } from './lib/config';
import report from './lib/report';


const angularTranslationCheck = async function angularTranslationCheck(arg: string[]) {
  const argv = cmdParser(arg);
  try {
    const config = configFactory(argv);
    config.loadAngularJson();

  } catch (err) {
    if (err instanceof Error) {
      report.error(err.message);
    }
  }
};

module.exports = angularTranslationCheck;
export default angularTranslationCheck;

