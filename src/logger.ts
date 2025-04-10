import { createLogger, format, transports } from 'winston';

const logger = createLogger({
  level: 'info', // You can change this to 'error', 'warn', etc.
  format: format.combine(
    format.timestamp(),
    format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
  ),
  transports: [
    new transports.Console(), // Log to the console
    new transports.File({ filename: 'logs/error.log', level: 'error' }), 
    new transports.File({ filename: 'logs/combined.log' }), 
  ],
});

export default logger;
