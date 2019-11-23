export type ResponseCodeDescription = { code: number, message: string };

export class ServerResponseCode {

    public static readonly SUCCESS: ResponseCodeDescription = {
        code   : 200,
        message: 'Success.'
    };

    public static readonly REQUEST_VALIDATION_ERROR: ResponseCodeDescription = {
        code   : 400,
        message: 'Request validation error.'
    };

    public static readonly INTERNAL_ERROR: ResponseCodeDescription = {
        code   : 500,
        message: 'Internal error.'
    };

}
