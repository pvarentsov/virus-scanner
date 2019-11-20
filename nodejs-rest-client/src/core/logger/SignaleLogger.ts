import { Signale, SignaleOptions } from 'signale';
import { Config } from '../configuration';

const options: SignaleOptions = {
    config: {
        displayFilename : false,
        displayTimestamp: true,
        displayDate     : true,
        underlineLabel  : false,
    },
    disabled   : false,
    interactive: true,
    types: {
        log: {
            badge   : '✅',
            color   : Config.LOG_DISABLE_COLORS ? 'black' : 'green',
            label   : 'LOG',
        },
        warn: {
            badge   : '⚠️',
            color   : Config.LOG_DISABLE_COLORS ? 'black' : 'yellow',
            label   : 'WARN',
        },
        debug: {
            badge   : '☕',
            color   : Config.LOG_DISABLE_COLORS ? 'black' : 'blue',
            label   : 'DEBUG',
        },
        error: {
            badge   : '🔥',
            color   : Config.LOG_DISABLE_COLORS ? 'black' : 'red',
            label   : 'ERROR',
        }
    }
};

const logger: Signale = new Signale(options);

export class SignaleLogger {

    public static log<T>(message: T, context?: string): void {
        logger.log(SignaleLogger.buildMessageObject(message, undefined, context));
    }

    public static error<T>(message: T, trace?: string, context?: string): void {
        logger.error(SignaleLogger.buildMessageObject(message, trace, context));
    }

    public static warn<T>(message: T, context?: string): void {
        logger.warn(SignaleLogger.buildMessageObject(message, undefined, context));
    }

    public static debug<T>(message: T, context?: string): void {
        logger.debug(SignaleLogger.buildMessageObject(message, undefined, context));
    }

    private static buildMessageObject<T>(message: T, trace?: string, context?: string): object {
        const resultContext: string = context
            ? `[${context}]`
            : '[Global]';

        let resultMessage: unknown[] = [resultContext, message];

        if (trace) {
            resultMessage.push(`\n\nStack Trace: ${trace}\n`);
        }

        if (Config.LOG_FORMAT === 'JSON') {
            resultMessage = [resultContext, SignaleLogger.toJSON(message, trace)];
        }

        return { message: resultMessage };
    }

    private static toJSON<T>(message: T, trace?: string): string {
        const messagePayload: { message: unknown, trace?: string } = {message};

        if (trace) {
            messagePayload.trace = trace;
        }

        return JSON.stringify(messagePayload);
    }

}
