import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { CommandLine } from './types/common';

const cmdParser = function(args: string[]): CommandLine {
  yargs(hideBin(args))
      .option('project', {
        default: '',
        string: true,
      })
      .option('locale', {
        default: '',
        string: true,
      })
      .option('root', {
        default: '',
        string: true,
      })
      .option('libs', {
        default: [],
        array: true,
      })
      .wrap(97)
  ;
  return yargs.argv as never as CommandLine;
};

export default cmdParser;
