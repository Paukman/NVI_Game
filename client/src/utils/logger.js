import { appSettings } from '../config/appSettings';

/**
 * This is a wrapper class that will allow us to use any necessary 3rd party logger library or even send logs to 3rd party service for analysis.
 */
class Logger {
  debug(...params) {
    if (appSettings.isProduction) {
      return;
    }

    const args = Array.prototype.slice.call(params);
    console.log.apply(console, [...args]);
  }

  log(...params) {
    if (appSettings.isProduction) {
      return;
    }

    const args = Array.prototype.slice.call(params);
    console.log.apply(console, [...args]);
  }

  warn(...params) {
    const args = Array.prototype.slice.call(params);
    console.log.apply(console, [...args]);
  }

  error(...params) {
    const args = Array.prototype.slice.call(params);
    console.error.apply(console, [...args]);
  }
}

export default new Logger();
