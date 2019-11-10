import { ServiceInputParametersValidationDetails } from '..';

export class ServiceInputParametersValidationError extends Error {

    public readonly message: string;

    private readonly details: ServiceInputParametersValidationDetails;

    private constructor(details: ServiceInputParametersValidationDetails) {
        super();

        this.name = this.constructor.name;
        this.message = this.constructor.name;
        this.details = details;

        Error.captureStackTrace(this, this.constructor);
    }

    public static create(details: ServiceInputParametersValidationDetails): ServiceInputParametersValidationError {
        return new ServiceInputParametersValidationError(details);
    }

    public getDetails(): ServiceInputParametersValidationDetails {
        return this.details;
    }

}
