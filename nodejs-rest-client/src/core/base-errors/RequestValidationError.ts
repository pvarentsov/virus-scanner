export class RequestValidationError extends Error {

    public readonly message: string;

    private constructor(message: string) {
        super();

        this.name = this.constructor.name;
        this.message = message;

        Error.captureStackTrace(this, this.constructor);
    }

    public static create(message: string): RequestValidationError {
        return new RequestValidationError(message);
    }

    public static SIZE_LIMIT_EXCEEDED_MESSAGE = (limit: number): string => {
        return `File size exceeded. Limit is ${limit} bytes.`;
    }

    public static MULTIPART_FORM_EMPTY_MESSAGE = (): string => {
        return `Multipart form is empty.`;
    }

}
