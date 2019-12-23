import { ClamaAVCommandType } from '../../types/ClamaAVCommandType';

export class ClamAVCommandFactoryError extends Error {

    public readonly message: string;

    private constructor(message: string) {
        super();

        this.name = this.constructor.name;
        this.message = message;

        Error.captureStackTrace(this, this.constructor);
    }

    public static createCommandValidationError(
        options: { commandType: ClamaAVCommandType, needData: boolean }

    ): ClamAVCommandFactoryError {

        let message: string = `${options.commandType} command requires the data.`;

        if (!options.needData) {
            message = `${options.commandType} command does't require the data.`;
        }

        return new ClamAVCommandFactoryError(message);
    }

    public static createUnknownCommandError(unknownCommand: string): ClamAVCommandFactoryError {
        const message: string = `Unknown command: ${unknownCommand}.`;
        return new ClamAVCommandFactoryError(message);
    }

}
