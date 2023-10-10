import pino from "pino";

const pinoOptions:pino.LoggerOptions = {
  browser: { disabled: !localStorage.bwLoggingStatus },
  level: localStorage.bwLoggingLevel || "info",
};

export default pino(pinoOptions);
