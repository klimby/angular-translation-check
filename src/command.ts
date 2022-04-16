import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { CommandLine } from './types/common';

const cmdParser = function(args: string[]): CommandLine {
  yargs(hideBin(args))
      .option('project', {
        alias: 'p',
        default: '',
        string: true,
      })
      .option('libs', {
        alias: 'l',
        default: [],
        array: true,
      })
      .wrap(97)
  ;
  return yargs.argv as never as CommandLine;
};

export default cmdParser;
