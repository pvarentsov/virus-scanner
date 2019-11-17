import { ConfigError } from '..';

export class Config {

    public static readonly API_HOST: string = Config.getVariable<string>('API_HOST', { type: 'string' });

    public static readonly API_PORT: number = Config.getVariable<number>('API_PORT', { type: 'number' });

    public static readonly CLAMAV_HOST: string = Config.getVariable<string>('CLAMAV_HOST', { type: 'string' });

    public static readonly CLAMAV_PORT: number = Config.getVariable<number>('CLAMAV_PORT', { type: 'number' });

    public static readonly CLAMAV_TIMEOUT: number = Config.getVariable<number>('CLAMAV_TIMEOUT', { type: 'number' });

    private static getVariable<T = (string | number)>(variable: string, options: { type: 'string' | 'number' }): T {
        const value: string | undefined = process.env[variable];

        if (!value) {
            throw ConfigError.createVariableNotSetError(variable);
        }

        /*tslint:disable-next-line*/
        let parsedValue: any = value;

        if (options.type === 'number') {
            parsedValue = parseInt(parsedValue, 10);

            if (!parsedValue) {
                throw ConfigError.createVariableParsingError(variable);
            }
        }

        return parsedValue;
    }

}
