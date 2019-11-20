import { Logger } from '@nestjs/common';
import { SignaleLogger } from './SignaleLogger';

export class CoreLogger extends Logger {

    public log<T>(message: T, context?: string): void {
        CoreLogger.log(message, context);
    }

    public error<T>(message: T, trace?: string, context?: string): void {
        CoreLogger.error(message, trace, context);
    }

    public warn<T>(message: T, context?: string): void {
        CoreLogger.warn(message, context);
    }

    public debug<T>(message: T, context?: string): void {
        CoreLogger.debug(message, context);
    }

    public verbose<T>(message: T, context?: string): void {
        CoreLogger.verbose(message, context);
    }

    public static log<T>(message: T, context?: string): void {
        SignaleLogger.log(message, context);
    }

    public static error<T>(message: T, trace?: string, context?: string): void {
        SignaleLogger.error(message, trace, context);
    }

    public static warn<T>(message: T, context?: string): void {
        SignaleLogger.warn(message, context);
    }

    public static debug<T>(message: T, context?: string): void {
        SignaleLogger.debug(message, context);
    }

}
