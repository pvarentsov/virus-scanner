import { Readable } from 'stream';
import { SyncScanInputParameters } from '../../../../../src/application/scanner';
import { MockHelper } from '../../../../.helper/MockHelper';
import { ServiceInputParametersValidationError } from '../../../../../src/core/service';

describe('ServiceInputParameters', () => {

    describe(`validate`, () => {

        const testDescription: string =
            `When input "fileSizeInBytes" is not number, ` +
            `expect ServiceInputParametersValidationError says that "fileSizeInBytes" must be number`;

        it(testDescription, async () => {
            const file: Readable = MockHelper.createReadStream();
            const fileSizeInBytes: unknown = '42 bytes';

            try {
                await SyncScanInputParameters.create(file, fileSizeInBytes as number);

            } catch (error) {

                const catchError: ServiceInputParametersValidationError = error;

                expect(catchError).toBeInstanceOf(ServiceInputParametersValidationError);
                expect(catchError.getDetails().context).toBe(SyncScanInputParameters.name);
                expect(catchError.getDetails().details.length).toBe(1);
                expect(catchError.getDetails().details[0].property).toBe('fileSizeInBytes');
            }
        });

    });

});
