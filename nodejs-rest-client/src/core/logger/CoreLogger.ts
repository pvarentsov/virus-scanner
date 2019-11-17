import { Logger } from '@nestjs/common';
import { Config } from '../configuration';

// TODO: Add ability to disable colors

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
        let resultMessage: unknown = message;

        if (Config.LOG_FORMAT === 'JSON') {
            resultMessage = CoreLogger.toJSON(message);
        }

        super.log(resultMessage, context, false);
    }

    public static error<T>(message: T, trace?: string, context?: string): void {
        let resultMessage: unknown = message;
        let resultTrace: string | undefined = trace;

        if (Config.LOG_FORMAT === 'JSON') {
            resultMessage = CoreLogger.toJSON(message, trace);
            resultTrace = undefined;
        }

        super.error(resultMessage, resultTrace, context, false);
    }

    public static warn<T>(message: T, context?: string): void {
        let resultMessage: unknown = message;

        if (Config.LOG_FORMAT === 'JSON') {
            resultMessage = CoreLogger.toJSON(message);
        }

        super.warn(resultMessage, context, false);
    }

    public static debug<T>(message: T, context?: string): void {
        let resultMessage: unknown = message;

        if (Config.LOG_FORMAT === 'JSON') {
            resultMessage = CoreLogger.toJSON(message);
        }

        super.debug(resultMessage, context, false);
    }

    public static verbose<T>(message: T, context?: string): void {
        let resultMessage: unknown = message;

        if (Config.LOG_FORMAT === 'JSON') {
            resultMessage = CoreLogger.toJSON(message);
        }

        super.verbose(resultMessage, context, false);
    }

    private static toJSON<T>(message: T, trace?: string): string {
        const messagePayload: { message: unknown, trace?: string } = { message };

        if (trace) {
            messagePayload.trace = trace;
        }

        return JSON.stringify(messagePayload);
    }

}
