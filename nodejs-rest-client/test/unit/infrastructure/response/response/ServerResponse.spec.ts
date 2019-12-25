import { ServerResponse, ServerResponseCode } from '../../../../../src/infrastructure/response';

describe('ServerResponse', () => {

    describe(`createSuccessResponse`, () => {

        const withoutInputArgumentsTestDescription: string =
            'When input arguments are not set, ' +
            'expect success response with default code and default message';

        it(withoutInputArgumentsTestDescription, async () => {
            const successResponse: ServerResponse = ServerResponse.createSuccessResponse();

            expect(successResponse.code).toBe(ServerResponseCode.SUCCESS.code);
            expect(successResponse.message).toBe(ServerResponseCode.SUCCESS.message);
            expect(successResponse.data).toEqual({});
            expect(new Date(successResponse.timestamp)).toBeInstanceOf(Date);
        });

        const withInputArgumentsTestDescription: string =
            'When data and message are set, ' +
            'expect success response with custom message and custom data';

        it(withInputArgumentsTestDescription, async () => {
            const data: { status: string } = { status: 'Ok' };
            const message: string = 'Ok';

            const successResponse: ServerResponse = ServerResponse.createSuccessResponse(data, message);

            expect(successResponse.code).toBe(ServerResponseCode.SUCCESS.code);
            expect(successResponse.message).toBe(message);
            expect(successResponse.data).toEqual(data);
            expect(new Date(successResponse.timestamp)).toBeInstanceOf(Date);
        });

    });

    describe(`createErrorResponse`, () => {

        const withoutInputArgumentsTestDescription: string =
            'When input arguments are not set, ' +
            'expect error response with default code and default message';

        it(withoutInputArgumentsTestDescription, async () => {
            const errorResponse: ServerResponse = ServerResponse.createErrorResponse();

            expect(errorResponse.code).toBe(ServerResponseCode.INTERNAL_ERROR.code);
            expect(errorResponse.message).toBe(ServerResponseCode.INTERNAL_ERROR.message);
            expect(errorResponse.data).toEqual({});
            expect(new Date(errorResponse.timestamp)).toBeInstanceOf(Date);
        });

        const withInputArgumentsTestDescription: string =
            'When data, code and message are set, ' +
            'expect error response with custom message, custom code and custom data';

        it(withInputArgumentsTestDescription, async () => {
            const data: { status: string } = { status: 'Request validation error' };
            const message: string = ServerResponseCode.REQUEST_VALIDATION_ERROR.message;
            const code: number = ServerResponseCode.REQUEST_VALIDATION_ERROR.code;

            const errorResponse: ServerResponse = ServerResponse.createErrorResponse(code, message, data);

            expect(errorResponse.code).toBe(code);
            expect(errorResponse.message).toBe(message);
            expect(errorResponse.data).toEqual(data);
            expect(new Date(errorResponse.timestamp)).toBeInstanceOf(Date);
        });

    });

});
