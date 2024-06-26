import winston from 'winston';
import fs from 'fs';

if (!fs.existsSync('logs')) {
  fs.mkdirSync('logs', { recursive: true });
}

const config = {
    levels: {
      error: 0,
      debug: 1,
      warn: 2,
      data: 3,
      info: 4,
      verbose: 5,
      silly: 6
    },
    colors: {
      error: 'red',
      debug: 'blue',
      warn: 'yellow',
      data: 'magenta',
      info: 'green',
      verbose: 'cyan',
      silly: 'grey'
    }
  };
  
  winston.addColors(config.colors);
  const wLogger = (input: { logName: string; level: string }): winston.Logger =>
    winston.createLogger({
      levels: config.levels,
      level: `${input.level}`,
      transports: [
        new winston.transports.Console({
          level: `${input.level}`,
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.printf(
              info =>
                `${new Date(info.timestamp).toLocaleDateString('tr-Tr', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit'
                })} ${info.level.toLocaleUpperCase()}: ${info.message}`
            ),
            winston.format.colorize({ all: true })
          )
        }),
        new winston.transports.File({
          filename: `logs/${input.logName}/${input.logName}-Error.log`,
          level: 'error',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.printf(
              info =>
                `${new Date(info.timestamp).toLocaleDateString('tr-Tr', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit'
                })} ${info.level.toLocaleUpperCase()}: ${info.message}`
            )
          )
        }),
        new winston.transports.File({
          filename: `logs/${input.logName}/${input.logName}-Error.log`,
          level: 'warn',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.printf(
              info =>
                `${new Date(info.timestamp).toLocaleDateString('tr-Tr', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit'
                })} ${info.level.toLocaleUpperCase()}: ${info.message}`
            )
          )
        }),
        new winston.transports.File({
          filename: `logs/${input.logName}/${input.logName}-Error.log`,
          level: 'silly',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.printf(
              info =>
                `${new Date(info.timestamp).toLocaleDateString('tr-Tr', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit'
                })} ${info.level.toLocaleUpperCase()}: ${info.message}`
            )
          )
        }),
  
        new winston.transports.File({
          filename: `logs/globalLog.log`,
          level: 'silly',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.printf(
              info =>
                `${new Date(info.timestamp).toLocaleDateString('tr-Tr', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit'
                })} ${info.level.toLocaleUpperCase()}: ${info.message}`
            )
          )
        })
      ]
    });
  
    
export default wLogger;
