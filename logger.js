/**
 * @file logger.js
 * @description This library is a pretty console logger for web browsers.
 *
 * @version 1.0.0
 * @license GPLv3
 * @author Hylke Hellinga
 */


// --- Configuration ---

const STYLES = {
  time: "background: #333; color: #eee; font-weight: bold; padding: 2px 4px; border-radius: 3px;",
  success: "background: #2e7d32; color: white; font-weight: bold; padding: 2px 4px; border-radius: 3px; margin-left: 6px;",
  fatal: "background: #b71c1c; color: white; font-weight: bold; padding: 2px 4px; border-radius: 3px; margin-left: 6px;",
  error: "background: #d32f2f; color: white; font-weight: bold; padding: 2px 4px; border-radius: 3px; margin-left: 6px;",
  warn: "background: #f9a825; color: black; font-weight: bold; padding: 2px 4px; border-radius: 3px; margin-left: 6px;",
  info: "background: #1976d2; color: white; font-weight: bold; padding: 2px 4px; border-radius: 3px; margin-left: 6px;",
  debug: "background: #4caf50; color: white; font-weight: bold; padding: 2px 4px; border-radius: 3px; margin-left: 6px;",
  trace: "background: #673ab7; color: white; font-weight: bold; padding: 2px 4px; border-radius: 3px; margin-left: 6px;",
  group: "background: #0097a7; color: white; font-weight: bold; padding: 2px 4px; border-radius: 3px; margin-left: 6px;",
};

const STACK_STYLES = {
  success: "background: #e8f5e9; color: #1e4620; padding: 4px 8px; font-family: monospace; border-radius: 3px; line-height: 1.6; margin-right: 6px;",
  fatal:   "background: #ffcdd2; color: #611a15; padding: 4px 8px; font-family: monospace; border-radius: 3px; line-height: 1.6; margin-right: 6px;",
  error:   "background: #ffcdd2; color: #611a15; padding: 4px 8px; font-family: monospace; border-radius: 3px; line-height: 1.6; margin-right: 6px;",
  warn:    "background: #ffe0b2; color: #663c00; padding: 4px 8px; font-family: monospace; border-radius: 3px; line-height: 1.6; margin-right: 6px;",
  info:    "background: #bbdefb; color: #0d3c61; padding: 4px 8px; font-family: monospace; border-radius: 3px; line-height: 1.6; margin-right: 6px;",
  debug:   "background: #e8f5e9; color: #1e4620; padding: 4px 8px; font-family: monospace; border-radius: 3px; line-height: 1.6; margin-right: 6px;",
  trace:   "background: #d1c4e9; color: #32254a; padding: 4px 8px; font-family: monospace; border-radius: 3px; line-height: 1.6; margin-right: 6px;",
};

const LOG_ICONS = {
  success: "✅", fatal: "🛑", error: "❌",
  warn: "⚠️", info: "ℹ️", debug: "🐞", trace: "👣",
};

/**
 * @typedef {'success' | 'fatal' | 'error' | 'warn' | 'info' | 'debug' | 'trace'} LogLevel
 */

// --- Internal Helper ---

/**
 * Builds the array of arguments for a console method.
 * @param {LogLevel} level - The log level.
 * @param {string} group - The pre-configured group name.
 * @param {string} message - The main message string.
 * @param {any[]} interpolatedValues - Values from the template literal.
 * @returns {any[]} The array of arguments to be spread into a console method.
 */
function buildLogArguments(level, group, message, interpolatedValues) {
  const icon = LOG_ICONS[level] || '';
  const messageStyle = STACK_STYLES[level] || "";
  
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const milliseconds = String(now.getMilliseconds()).padStart(3, '0');
  const timestamp = `${hours}:${minutes}:${seconds}.${milliseconds}`;

  const formatParts = ['%c' + timestamp];
  const styles = [STYLES.time];

  formatParts.push('%c' + icon + ' ' + level.toUpperCase());
  styles.push(STYLES[level]);

  if (group) {
    formatParts.push('%c' + group);
    styles.push(STYLES.group);
  }
  
  formatParts.push('%c' + message);
  styles.push(messageStyle);

  const logArguments = [formatParts.join(''), ...styles];

  if (!interpolatedValues || interpolatedValues.length === 0) {
    return logArguments;
  }

  if (interpolatedValues.length === 1 && interpolatedValues[0] instanceof Error) {
    // Handle the special case of a single Error object.
    logArguments.push('\nError Details:', interpolatedValues[0]);
  } else {
    // Handle all other cases where interpolated values exist.
    logArguments.push('\nInterpolated Values:', interpolatedValues);
  }

  return logArguments;
}

// --- Public API ---

/**
 * @typedef {Record<LogLevel, (strings: TemplateStringsArray, ...values: any[]) => any[]>} TaggedLogger
 */

/**
 * Creates a new logger instance with a pre-configured group name.
 * @param {{ group?: string }} [options={}] - Configuration options.
 * @returns {TaggedLogger} A logger object where each method is a tag function.
 */
export function createLogger(options = {}) {
  const { group = '' } = options;
  const logger = {};

  for (const level of Object.keys(LOG_ICONS)) {
    logger[level] = (strings, ...values) => {
      const message = strings.reduce((acc, str, i) => acc + str + (values[i] || ''), '');
      return buildLogArguments(level, group, message, values);
    };
  }
  return logger;
}

/** A default base logger for general use. */
export const baseLogger = createLogger();
