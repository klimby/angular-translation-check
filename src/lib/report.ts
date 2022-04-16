// eslint-disable-next-line @typescript-eslint/no-var-requires
const chalk = require('chalk');


class Report {
  private _error = chalk.bold.red;
  private _warning = chalk.hex('#FFA500');
  private _success = chalk.green;


  error(message: string): void {
    console.log(this._error(message));
  }

  warning(message: string): void {
    console.log(this._warning(message));
  }

  success(message: string): void {
    console.log(this._success(message));
  }

}

const report = new Report();
export default report;
