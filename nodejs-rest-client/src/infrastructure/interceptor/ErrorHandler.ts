import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { ServerResponse, ServerResponseCode } from '../response';
import { ServiceInputParametersValidationDetails, ServiceInputParametersValidationError } from '../../core/service';

@Catch()
export class ErrorHandler implements ExceptionFilter {

    public catch(error: Error, host: ArgumentsHost): void {
        const response: Response = host.switchToHttp().getResponse<Response>();

        let errorResponse: ServerResponse = ServerResponse.createErrorResponse();

        if (error instanceof ServiceInputParametersValidationError) {
            const code: number = ServerResponseCode.REQUEST_VALIDATION_ERROR.code;
            const message: string = ServerResponseCode.REQUEST_VALIDATION_ERROR.message;
            const data: ServiceInputParametersValidationDetails = error.getDetails();

            errorResponse = ServerResponse.createErrorResponse(code, message, data);
        }

        response.json(errorResponse);
    }
}
