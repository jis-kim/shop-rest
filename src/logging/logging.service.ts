import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import * as winston from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';

import { AppConfigService } from '@/config/app/app.config.service';

const { combine, timestamp, printf, colorize, align } = winston.format;

@Injectable()
export class LoggingService implements NestLoggerService {
  private logger: winston.Logger;

  constructor(private readonly appConfigService: AppConfigService) {
    this.initializeLogger();
  }

  private initializeLogger() {
    const serviceName = 'SHOP-REST';

    // Console 로그를 위한 포맷
    const consoleFormat = combine(
      colorize({ all: true }),
      timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      align(),
      printf(({ timestamp, level, message, context, trace, ...meta }) => {
        const contextStr = context ? `[${context}] ` : '';
        const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
        const traceStr = trace ? `\nStack Trace:\n${trace}` : '';
        return `${timestamp} ${level}: ${contextStr}${message}${metaStr}${traceStr}`;
      }),
    );

    // 파일 로그를 위한 포맷
    const fileFormat = combine(
      timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      printf(({ timestamp, level, message, context, trace, ...meta }) => {
        const contextStr = context ? `[${context}] ` : '';
        const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
        const traceStr = trace ? `\nStack Trace: ${trace}` : '';
        return `${timestamp} ${level.toUpperCase()}: ${contextStr}${message}${metaStr}${traceStr}`;
      }),
    );

    const fileRotateTransport = new DailyRotateFile({
      filename: `logs/${serviceName}-%DATE%.log`,
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      format: fileFormat,
    });

    const errorWarnTransport = new DailyRotateFile({
      filename: `logs/${serviceName}-errors-%DATE%.log`,
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '30d',
      level: 'warn', // warn 레벨 이상(warn과 error)만 기록
      format: fileFormat,
    });

    this.logger = winston.createLogger({
      level: this.appConfigService.env === 'production' ? 'info' : 'debug',
      transports: [
        new winston.transports.Console({
          format: consoleFormat,
        }),
        fileRotateTransport,
        errorWarnTransport,
      ],
    });
  }

  log(message: string, context?: string) {
    this.logger.info(message, { context });
  }

  error(message: string, trace?: string, context?: string) {
    this.logger.error(message, { context, trace });
  }

  warn(message: string, context?: string) {
    this.logger.warn(message, { context });
  }

  debug(message: string, context?: string) {
    this.logger.debug(message, { context });
  }

  verbose(message: string, context?: string) {
    this.logger.verbose(message, { context });
  }
}
