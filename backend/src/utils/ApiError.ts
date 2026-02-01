import appConfig from "../config";

class ApiError extends Error {
    public readonly success: boolean = false;
    public readonly statusCode: number;
    public readonly data: null = null;
    public readonly errors: unknown;
    public readonly stack?: string;
    public message = "Something went wrong";

    constructor(
        statusCode: number = 500,
        message: string = "Something went wrong",
        errors: unknown = "",
        stack = ""
    ) {
        super(message);
        this.success = false;
        this.statusCode = statusCode;
        this.message = message;
        this.data = null;
        this.errors = errors;

        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor)
        }

    }

    toJSON() {
        return {
            success: this.success,
            statusCode: this.statusCode,
            message: this.message,
            data: this.data,
            errors: this.errors,
            stack: appConfig.debug ? this.stack : undefined,
        }
    }

}

export default ApiError;