import { createLogger, format, Logger, LoggerOptions, transports } from 'winston';
import { ILoggerTransport } from '../ILoggerTransport';
import { Config } from '../../../../configuration';

export class WinstonLoggerTransport implements ILoggerTransport {

    private readonly logger: Logger;

    private readonly pid: number;

    private constructor() {
        this.pid = process.pid;
        this.logger = createLogger(WinstonLoggerTransport.OPTIONS);
    }

    public log(message: string, context?: string): void {
        this.logger.info(message, {
            context: context || WinstonLoggerTransport.DEFAULT_CONTEXT,
            pid    : this.pid
        });
    }

    public error(message: string, trace?: string, context?: string): void {
        this.logger.error(message, {
            context: context || WinstonLoggerTransport.DEFAULT_CONTEXT,
            trace  : trace,
            pid    : this.pid
        });
    }

    public warn(message: string, context?: string): void {
        this.logger.warn(message, {
            context: context || WinstonLoggerTransport.DEFAULT_CONTEXT,
            pid    : this.pid
        });
    }

    public debug(message: string, context?: string): void {
        this.logger.debug(message, {
            context: context || WinstonLoggerTransport.DEFAULT_CONTEXT,
            pid    : this.pid
        });
    }

    public verbose(message: string, context?: string): void {
        this.logger.verbose(message, {
            context: context || WinstonLoggerTransport.DEFAULT_CONTEXT,
            pid    : this.pid });
    }

    public static create(): WinstonLoggerTransport {
        return new WinstonLoggerTransport();
    }

    private static readonly DEFAULT_CONTEXT: string = 'Global';

    private static readonly OPTIONS: LoggerOptions = {
        level: 'debug',
        transports: [ new transports.Console({}) ],
        format    : format.combine(
            format.timestamp({ format: `MM/DD/YYYY HH:mm:ss` }),
            WinstonLoggerTransport.chooseLogColor(),
            WinstonLoggerTransport.chooseLogFormat(),
        ),
    };

    /*tslint:disable-next-line*/
    private static buildMessageTemplate(info: any): string {
        const timestamp: string = `[${info.timestamp}]`;

        const level: string = `${WinstonLoggerTransport.alignValue(info.level, 7)}`;
        const pid: string = WinstonLoggerTransport.alignValue(`[${info.pid}]`, 8);

        const context: string = `[${info.context}]`;
        const message: string = `${info.message}`;
        const trace: string = info.trace ? `\n\n${info.trace}\n` : '';

        return `${timestamp} ${pid} ${level} ${context} ${message}${trace}`;
    }

    private static alignValue(value: string | number, maxWidth: number): string {
        const colorRegexp: RegExp = new RegExp(
            `[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]`, 'g'
        );

        const parsedValue: string = `${value}`.replace(colorRegexp, '');

        const valueLength: number = parsedValue.length;
        const lengthDiff: number = maxWidth - valueLength;

        let resultValue: string = `${value}`;

        if (lengthDiff > 0) {
            resultValue = resultValue.padEnd(resultValue.length + lengthDiff);
        }

        return resultValue;
    }

    /*tslint:disable-next-line*/
    private static chooseLogFormat(): any {
        if (Config.LOG_FORMAT === 'JSON') {
            return format.json();
        }

        /*tslint:disable-next-line*/
        return format.printf((info: any): string => WinstonLoggerTransport.buildMessageTemplate(info));
    }

    /*tslint:disable-next-line*/
    private static chooseLogColor(): any {
        if (Config.LOG_DISABLE_COLORS) {
            return format.uncolorize();
        }

        return format.colorize({ all: true });
    }

}
