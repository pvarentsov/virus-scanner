import { ServerResponseCode } from '..';

export class ServerResponse {

    public readonly code: number;

    public readonly message: string;

    public readonly timestamp: number;

    public readonly data: {};

    private constructor(code: number, message: string, data?: {}) {
        this.code = code;
        this.message = message;
        this.data = data || {};
        this.timestamp = Date.now();
    }

    public static createSuccessResponse(data?: {}, message?: string): ServerResponse {
        const resultCode: number = ServerResponseCode.SUCCESS.code;
        const resultMessage: string = message || ServerResponseCode.SUCCESS.message;

        return new ServerResponse(resultCode, resultMessage, data);
    }

    public static createErrorResponse(code?: number, message?: string, data?: {}): ServerResponse {
        const resultCode: number = code || ServerResponseCode.INTERNAL_ERROR.code;
        const resultMessage: string = message || ServerResponseCode.INTERNAL_ERROR.message;

        return new ServerResponse(resultCode, resultMessage, data);
    }

}
