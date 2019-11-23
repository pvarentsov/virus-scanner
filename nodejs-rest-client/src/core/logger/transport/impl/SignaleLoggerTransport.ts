import { Signale, SignaleOptions } from 'signale';
import { Config } from '../../../configuration';
import { ILoggerTransport } from '../ILoggerTransport';

export class SignaleLoggerTransport implements ILoggerTransport {

    private logger: Signale;

    private constructor() {
        this.logger = new Signale(SignaleLoggerTransport.OPTIONS);
    }

    public log(message: string, context?: string): void {
        this.logger.log(SignaleLoggerTransport.buildMessageObject(message, undefined, context));
    }

    public error(message: string, trace?: string, context?: string): void {
        this.logger.error(SignaleLoggerTransport.buildMessageObject(message, trace, context));
    }

    public warn(message: string, context?: string): void {
        this.logger.warn(SignaleLoggerTransport.buildMessageObject(message, undefined, context));
    }

    public debug(message: string, context?: string): void {
        this.logger.debug(SignaleLoggerTransport.buildMessageObject(message, undefined, context));
    }

    public verbose(message: string, context?: string): void {
        this.logger.info(SignaleLoggerTransport.buildMessageObject(message, undefined, context));
    }

    public static create(): SignaleLoggerTransport {
        return new SignaleLoggerTransport();
    }

    private static buildMessageObject(message: string, trace?: string, context?: string): object {
        const resultContext: string = context
            ? `[${context}]`
            : '[Global]';

        let resultMessage: unknown[] = [resultContext, message];

        if (trace) {
            resultMessage.push(`\n\nStack Trace: ${trace}\n`);
        }

        if (Config.LOG_FORMAT === 'JSON') {
            resultMessage = [resultContext, SignaleLoggerTransport.toJSON(message, trace)];
        }

        return { message: resultMessage };
    }

    private static toJSON(message: string, trace?: string): string {
        const messagePayload: { message: unknown, trace?: string } = {message};

        if (trace) {
            messagePayload.trace = trace;
        }

        return JSON.stringify(messagePayload);
    }

    private static readonly OPTIONS: SignaleOptions = {
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
            },
            info: {
                badge   : '✏️',
                color   : Config.LOG_DISABLE_COLORS ? 'black' : 'red',
                label   : 'VERBOSE',
            }
        }
    };

}
