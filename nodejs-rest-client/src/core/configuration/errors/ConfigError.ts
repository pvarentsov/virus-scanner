export class ConfigError extends Error {

    public readonly message: string;

    private constructor(message: string) {
        super();

        this.name = this.constructor.name;
        this.message = message;

        Error.captureStackTrace(this, this.constructor);
    }

    public static createVariableNotSetError(variable: string): ConfigError {
        const message: string = `${variable} not set.`;
        return new ConfigError(message);
    }

    public static createVariableParsingError(variable: string): ConfigError {
        const message: string = `${variable} parsing error.`;
        return new ConfigError(message);
    }

}
