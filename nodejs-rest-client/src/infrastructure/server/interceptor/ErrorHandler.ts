import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { ServerResponse, ServerResponseCode } from '../response';
import { ServiceInputParametersValidationDetails, ServiceInputParametersValidationError } from '../../../core/service';
import { ClamAVClientError } from '../../../core/lib/clamav/client/errors/ClamAVClientError';
import { ClamAVCommandFactoryError } from '../../../core/lib/clamav/command/factory/errors/ClamAVCommandFactoryError';

@Catch()
export class ErrorHandler implements ExceptionFilter {

    public catch(error: Error, host: ArgumentsHost): void {
        const response: Response = host.switchToHttp().getResponse<Response>();

        let errorResponse: ServerResponse = ServerResponse.createErrorResponse();

        errorResponse = this.handleRequestValidationError(error, errorResponse);
        errorResponse = this.handleClamAVError(error, errorResponse);

        response.json(errorResponse);
    }

    private handleRequestValidationError(error: Error, errorResponse: ServerResponse): ServerResponse {
        if (error instanceof ServiceInputParametersValidationError) {
            const code: number = ServerResponseCode.REQUEST_VALIDATION_ERROR.code;
            const message: string = ServerResponseCode.REQUEST_VALIDATION_ERROR.message;
            const data: ServiceInputParametersValidationDetails = error.getDetails();

            errorResponse = ServerResponse.createErrorResponse(code, message, data);
        }

        return errorResponse;
    }

    private handleClamAVError(error: Error, errorResponse: ServerResponse): ServerResponse {
        if (error instanceof ClamAVClientError) {
            const code: number = ServerResponseCode.INTERNAL_ERROR.code;
            const message: string = error.getMessage();

            errorResponse = ServerResponse.createErrorResponse(code, message);
        }
        if (error instanceof ClamAVCommandFactoryError) {
            const code: number = ServerResponseCode.INTERNAL_ERROR.code;
            const message: string = error.getMessage();

            errorResponse = ServerResponse.createErrorResponse(code, message);
        }

        return errorResponse;
    }
}
