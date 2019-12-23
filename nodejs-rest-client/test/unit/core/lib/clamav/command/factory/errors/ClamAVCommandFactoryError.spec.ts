import { ClamAVCommandFactoryError } from '../../../../../../../../src/core/lib/clamav/command/factory/errors/ClamAVCommandFactoryError';
import { ClamaAVCommandType } from '../../../../../../../../src/core/lib/clamav/command/types/ClamaAVCommandType';

describe('ClamAVCommandFactoryError', () => {

    describe(`Create command validation error`, () => {

        const instreamWithDataDescription: { when: string, expect: string } = {
            when  : `When commandType is INSTREAM and needData is truthy`,
            expect: `expect ClamAVCommandFactoryError says that INSTREAM command requires the data`
        };

        it(`${instreamWithDataDescription.when}, ${instreamWithDataDescription.expect}`, () => {
            const expectedErrorMessage: string = 'INSTREAM command requires the data.';

            const errorOptions: { commandType: ClamaAVCommandType, needData: boolean } = {
                commandType: ClamaAVCommandType.INSTREAM,
                needData   : true,
            };

            const error: ClamAVCommandFactoryError
                = ClamAVCommandFactoryError.createCommandValidationError(errorOptions);

            expect(error).toBeInstanceOf(ClamAVCommandFactoryError);
            expect(error.message).toBe(expectedErrorMessage);
        });

        const pingWithoutDataDescription: { when: string, expect: string } = {
            when  : `When commandType is PING and needData is falsy`,
            expect: `expect ClamAVCommandFactoryError says that PING command does't require the data`
        };

        it(`${pingWithoutDataDescription.when}, ${pingWithoutDataDescription.expect}`, () => {
            const expectedErrorMessage: string = `PING command does't require the data.`;

            const errorOptions: { commandType: ClamaAVCommandType, needData: boolean } = {
                commandType: ClamaAVCommandType.PING,
                needData   : false,
            };

            const error: ClamAVCommandFactoryError
                = ClamAVCommandFactoryError.createCommandValidationError(errorOptions);

            expect(error).toBeInstanceOf(ClamAVCommandFactoryError);
            expect(error.message).toBe(expectedErrorMessage);
        });

    });

    describe(`Create unknown command error`, () => {

        it(`When command is UNKNOWN, expect ClamAVCommandFactoryError says that this command is unknown`, () => {
            const expectedErrorMessage: string = `Unknown command: UNKNOWN.`;

            const error: ClamAVCommandFactoryError = ClamAVCommandFactoryError.createUnknownCommandError('UNKNOWN');

            expect(error).toBeInstanceOf(ClamAVCommandFactoryError);
            expect(error.message).toBe(expectedErrorMessage);
        });

    });

});
