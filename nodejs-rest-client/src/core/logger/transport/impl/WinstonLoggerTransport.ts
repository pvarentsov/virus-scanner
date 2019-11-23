import { createLogger, format, Logger, LoggerOptions, transports } from 'winston';
import { ILoggerTransport } from '../ILoggerTransport';
import { Config } from '../../../configuration';

export class WinstonLoggerTransport implements ILoggerTransport {

    private logger: Logger;

    private constructor() {
        this.logger = createLogger(WinstonLoggerTransport.OPTIONS);
    }

    public log(message: string, context?: string): void {
        this.logger.info(message, { context });
    }

    public error(message: string, trace?: string, context?: string): void {
        this.logger.error(message, { context, trace });
    }

    public warn(message: string, context?: string): void {
        this.logger.warn(message, { context });
    }

    public debug(message: string, context?: string): void {
        this.logger.debug(message, { context });
    }

    public verbose(message: string, context?: string): void {
        this.logger.verbose(message, { context });
    }

    public static create(): WinstonLoggerTransport {
        return new WinstonLoggerTransport();
    }

    private static readonly OPTIONS: LoggerOptions = {
        transports : [ new transports.Console({}) ],
        format     : format.combine(
            format.timestamp({ format: `MM/DD/YYYY HH:mm:ss` }),
            WinstonLoggerTransport.chooseLogColor(),
            WinstonLoggerTransport.chooseLogFormat(),
        ),
    };

    /*tslint:disable-next-line*/
    private static buildMessageTemplate(info: any): string {
        const timestamp: string = `[${info.timestamp}]`;
        const level: string = `${WinstonLoggerTransport.alignLevel(info.level)} - `;
        const context: string = `[${info.context || 'Global'}]`;
        const message: string = `${info.message}`;
        const trace: string = info.trace ? `\n\n${info.trace}\n` : '';

        return `${timestamp} ${level} ${context} ${message}${trace}`;
    }

    private static alignLevel(level: string): string {
        const colorRegexp: RegExp = new RegExp(
            `[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]`, 'g'
        );

        const parsedLevel: string = level.replace(colorRegexp, '');

        const maxLevelLength: number = 8;
        const levelLength: number = parsedLevel.length;
        const lengthDiff: number = maxLevelLength - levelLength;

        let resultLevel: string = level;

        if (lengthDiff > 0) {
            resultLevel = resultLevel.padEnd(resultLevel.length + lengthDiff);
        }

        return resultLevel;
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
