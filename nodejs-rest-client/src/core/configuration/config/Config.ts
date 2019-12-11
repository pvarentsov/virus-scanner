import { ConfigError } from '..';

export class Config {

    public static readonly API_HOST: string = Config.parseStringVariable('API_HOST');

    public static readonly API_PORT: number = Config.parseNumberVariable('API_PORT');

    public static readonly API_BASE_PATH: string = Config.parseStringVariable('API_BASE_PATH');

    public static readonly API_DOCUMENTATION_HOST: string = Config.parseStringVariable('API_DOCUMENTATION_HOST');

    public static readonly API_CLUSTER_ENABLE: number = Config.parseNumberVariable('API_CLUSTER_ENABLE');

    public static readonly CLAMAV_HOST: string = Config.parseStringVariable('CLAMAV_HOST');

    public static readonly CLAMAV_PORT: number = Config.parseNumberVariable('CLAMAV_PORT');

    public static readonly CLAMAV_TIMEOUT: number = Config.parseNumberVariable('CLAMAV_TIMEOUT');

    public static readonly LOG_FORMAT: 'TEXT'|'JSON' = Config.parseStringVariable('LOG_FORMAT');

    public static readonly LOG_DISABLE_COLORS: number = Config.parseNumberVariable('LOG_DISABLE_COLORS');

    public static readonly MAX_SYNC_SCAN_FILE_SIZE: number = Config.parseNumberVariable('MAX_SYNC_SCAN_FILE_SIZE');

    private static parseStringVariable<T = string>(variable: string): T {
        const value: string | undefined = process.env[variable];

        if (value === undefined) {
            throw ConfigError.createVariableNotSetError(variable);
        }

        /*tslint:disable-next-line*/
        const result: any = value;

        return result;
    }

    private static parseNumberVariable(variable: string): number {
        const value: string | undefined = process.env[variable];

        if (value === undefined) {
            throw ConfigError.createVariableNotSetError(variable);
        }

        const parsedValue: number = parseInt(value.replace(new RegExp('_', 'g'), ''), 10);

        if (isNaN(parsedValue)) {
            throw ConfigError.createVariableParsingError(variable);
        }

        return parsedValue;
    }

}
