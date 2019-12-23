export class ClamAVClientError extends Error {

    public readonly message: string;

    private constructor(message: string) {
        super();

        this.name = this.constructor.name;
        this.message = message;

        Error.captureStackTrace(this, this.constructor);
    }

    public static createConnectionTimedOutError(): ClamAVClientError {
        const message: string = 'Connection to ClamAV timed out.';
        return new ClamAVClientError(message);
    }

    public static createScanAbortedError(reason: string): ClamAVClientError {
        let message: string = `Scan aborted.`;

        if (reason.length > 0) {
            message = message + ` Reason: ${reason}.`;
        }

        return new ClamAVClientError(message);
    }

}
