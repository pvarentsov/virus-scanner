import { validate, ValidationError } from 'class-validator';
import { ServiceInputParametersValidationError } from '..';

export class ServiceInputParameters {

    public async validate(context?: string): Promise<void> {
        const validationErrors: ValidationError[] = await validate(this);
        const validationContext: string = context || this.constructor.name;

        if (validationErrors.length > 0) {
            const details: ServiceInputParametersValidationDetails = {
                context: validationContext,
                details : []
            };

            for (const validationError of validationErrors) {
                const dtoValidationMessage: { property: string, errors: string[] } = {
                    property: validationError.property,
                    errors  : Object.values(validationError.constraints)
                };
                details.details.push(dtoValidationMessage);
            }

            throw ServiceInputParametersValidationError.create(details);
        }
    }

}

export type ServiceInputParametersValidationDetails = {
    context: string;
    details: Array<{ property: string, errors: string[] }>
};
