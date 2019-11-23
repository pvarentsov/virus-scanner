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

    public getMessage(): string {
        return this.message;
    }

}
