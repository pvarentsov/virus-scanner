import {
    ServiceInputParametersValidationDetails,
    ServiceInputParametersValidationError
} from '../../../../../src/core/service';

describe('ServiceInputParametersValidationError', () => {

    describe(`Create ServiceInputParametersValidationError instance`, () => {

        it(`Expect ServiceInputParametersValidationError with required attributes`, () => {

            const details: ServiceInputParametersValidationDetails = {
                context: 'SyncScanInputParameters',
                details: [
                    {property: 'fileSizeInBytes', errors: ['must be positive integer']}
                ]
            };

            const error: ServiceInputParametersValidationError = ServiceInputParametersValidationError.create(details);

            expect(error).toBeInstanceOf(ServiceInputParametersValidationError);
            expect(error.message).toBe('ServiceInputParametersValidationError');
            expect(error.getDetails()).toEqual(details);
        });

    });

});
