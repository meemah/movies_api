export class AppError extends Error {
    constructor(message: string) {
        super(message);
    }

}

export class NotFound extends Error {
    constructor(message: string) {
        super(message);
    }
}

