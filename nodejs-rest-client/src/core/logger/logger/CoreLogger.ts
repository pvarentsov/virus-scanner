import { Logger } from '@nestjs/common';
import { ILoggerTransport, WinstonLoggerTransport } from '../transport';

const LoggerTransport: ILoggerTransport = WinstonLoggerTransport.create();

export class CoreLogger extends Logger {

    public log(message: string, context?: string): void {
        CoreLogger.log(message, context);
    }

    public error(message: string, trace?: string, context?: string): void {
        CoreLogger.error(message, trace, context);
    }

    public warn(message: string, context?: string): void {
        CoreLogger.warn(message, context);
    }

    public debug(message: string, context?: string): void {
        CoreLogger.debug(message, context);
    }

    public verbose(message: string, context?: string): void {
        CoreLogger.verbose(message, context);
    }

    public static log(message: string, context?: string): void {
        LoggerTransport.log(message, context);
    }

    public static error(message: string, trace?: string, context?: string): void {
        LoggerTransport.error(message, trace, context);
    }

    public static warn(message: string, context?: string): void {
        LoggerTransport.warn(message, context);
    }

    public static debug(message: string, context?: string): void {
        LoggerTransport.debug(message, context);
    }

    public static verbose(message: string, context?: string): void {
        LoggerTransport.verbose(message, context);
    }

}
