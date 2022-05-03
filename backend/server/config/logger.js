/**
 * Archivo de configuración para logs
 *
 * @author Juan-CamiloF
 */

const { createLogger, format, transports } = require("winston");
const winston = require("winston");
winston.addColors({
  error: "red",
  warn: "yellow",
  info: "cyan",
  debug: "green",
});

const log = createLogger({
  silent: process.env.NODE_ENV === "test",
  transports: [
    new transports.Console({
      level: "debug",
      format: format.combine(
        format.simple(),
        format.colorize(),
        format.printf(
          (info) => `[${new Date()}]  ${info.level} ${info.message}`
        )
      ),
    }),
    new transports.File({
      maxsize: 5120000,
      maxFiles: 5,
      filename: `${__dirname}/../logs/logs-api.log`,
      format: format.combine(
        format.simple(),
        format.printf((info) => `[${new Date()}] ${info.level} ${info.message}`)
      ),
    }),
  ],
});

module.exports = log;
