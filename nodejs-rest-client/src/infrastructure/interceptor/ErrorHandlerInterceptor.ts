import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Request, Response } from 'express';
import { ServerResponse, ServerResponseCode } from '../response';
import { ServiceInputParametersValidationDetails, ServiceInputParametersValidationError } from '../../core/service';
import { ClamAVClientError } from '../../core/lib/clamav/client/errors/ClamAVClientError';
import { ClamAVCommandFactoryError } from '../../core/lib/clamav/command/factory/errors/ClamAVCommandFactoryError';
import { CoreLogger } from '../../core/logger/CoreLogger';
import { RequestValidationError } from '../../core/base-errors/RequestValidationError';

@Catch()
export class ErrorHandlerInterceptor implements ExceptionFilter {

    public catch(error: Error, host: ArgumentsHost): void {
        const request: Request = host.switchToHttp().getRequest();
        const response: Response = host.switchToHttp().getResponse<Response>();

        let errorResponse: ServerResponse = ServerResponse.createErrorResponse();

        errorResponse = this.handleRequestValidationError(error, errorResponse);
        errorResponse = this.handleClamAVError(error, errorResponse);

        const message: string =
            `Method: ${request.method}; ` +
            `Path: ${request.path};`;

        CoreLogger.error(message, error.stack, ErrorHandlerInterceptor.name);

        response.json(errorResponse);
    }

    private handleRequestValidationError(error: Error, errorResponse: ServerResponse): ServerResponse {
        if (error instanceof RequestValidationError) {
            const code: number = ServerResponseCode.REQUEST_VALIDATION_ERROR.code;
            const message: string = error.getMessage() || ServerResponseCode.REQUEST_VALIDATION_ERROR.message;

            errorResponse = ServerResponse.createErrorResponse(code, message);
        }
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
