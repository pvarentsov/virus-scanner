import { ConfigError } from '..';

export class EnvParser {
    
    public static parseString<T = string>(variable: string): T {
        const value: string | undefined = process.env[variable];

        if (value === undefined) {
            throw ConfigError.createVariableNotSetError(variable);
        }

        /*tslint:disable-next-line*/
        const result: any = value;

        return result;
    }
    
    public static parseNumber(variable: string): number {
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
