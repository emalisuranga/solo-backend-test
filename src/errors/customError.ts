export class CustomError extends Error {
    statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, CustomError.prototype);
    }
}

export class NotFoundError extends CustomError {
    constructor(message: string) {
        super(message, 404);
    }
}

export class BadRequestError extends CustomError {
    constructor(message: string) {
        super(message, 400);
    }
}

export class InternalServerError extends CustomError {
    constructor(message: string) {
        super(message, 500);
    }
}