import { ConfigError } from '../../../../../src/core/configuration';

describe('ConfigError', () => {

    describe(`Create "Variable not set error" `, () => {

        it(`When variable is HOST, expect ConfigError says that HOST variable is not set`, () => {
            const expectedErrorMessage: string = 'HOST not set.';

            const error: ConfigError = ConfigError.createVariableNotSetError('HOST');

            expect(error).toBeInstanceOf(ConfigError);
            expect(error.message).toBe(expectedErrorMessage);
        });

    });

    describe(`Create "Variable parsing error"`, () => {

        it(`When variable is HOST, expect ConfigError says there is an error when parsing a HOST variable`, () => {
            const expectedErrorMessage: string = 'HOST parsing error.';

            const error: ConfigError = ConfigError.createVariableParsingError('HOST');

            expect(error).toBeInstanceOf(ConfigError);
            expect(error.message).toBe(expectedErrorMessage);
        });

    });

});
