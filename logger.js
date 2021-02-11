const pino = require("pino");
const pinoInstance = pino();
const fs = require('fs');

const logger = {
  log: msg => fs.appendFileSync("/tmp/logs.out", msg + "\n"),
  logInfo: pinoInstance.info.bind(pinoInstance),
  logError: pinoInstance.error.bind(pinoInstance),
};

module.exports = logger;
