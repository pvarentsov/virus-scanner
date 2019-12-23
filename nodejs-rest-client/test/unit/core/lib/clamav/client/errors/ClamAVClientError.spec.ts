import { ClamAVClientError } from '../../../../../../../src/core/lib/clamav/client/errors/ClamAVClientError';

describe('ClamAVClientError', () => {

    describe(`Create "Connection timed out error" `, () => {

        it(`Expect ClamAVClientError says that the connection to ClamAV was timed out`, () => {
            const expectedErrorMessage: string = 'Connection to ClamAV timed out.';

            const error: ClamAVClientError = ClamAVClientError.createConnectionTimedOutError();

            expect(error).toBeInstanceOf(ClamAVClientError);
            expect(error.message).toBe(expectedErrorMessage);
        });

    });

    describe(`Create "Scan aborted error"`, () => {

        const scanAbortedDescription: { when: string, expect: string } = {
            when  : `When reason is "Internal error"`,
            expect: `expect ClamAVClientError says that the scanning was aborted due to "Intern ERROR"`
        };

        it(`${scanAbortedDescription.when}, ${scanAbortedDescription.expect}`, () => {
            const expectedErrorMessage: string = 'Scan aborted. Reason: Internal error.';

            const error: ClamAVClientError = ClamAVClientError.createScanAbortedError('Internal error');

            expect(error).toBeInstanceOf(ClamAVClientError);
            expect(error.message).toBe(expectedErrorMessage);
        });

    });

});
