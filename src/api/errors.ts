export class ApiCallError extends Error {
    public readonly status?: number;
    public readonly detail?: string;

    constructor(message: string, status?: number, detail?: string) {
        super(message);
        this.name = "ApiCallError";
        this.status = status;
        this.detail = detail;
        Object.setPrototypeOf(this, ApiCallError.prototype);
    }
}

export class AuthError extends ApiCallError {
    constructor(message: string, status?: number, detail?: string) {
        super(message, status, detail);
        this.name = "AuthError";
        Object.setPrototypeOf(this, AuthError.prototype);
    }
}

export class BadRequestError extends ApiCallError {
    constructor(message: string, detail?: string) {
        super(message, 400, detail);
        this.name = "BadRequestError";
        Object.setPrototypeOf(this, BadRequestError.prototype);
    }
}

export class ForbiddenError extends ApiCallError {
    constructor(message: string, detail?: string) {
        super(message, 403, detail);
        this.name = "ForbiddenError";
        Object.setPrototypeOf(this, ForbiddenError.prototype);
    }
}

export class NotFoundError extends ApiCallError {
    constructor(message: string, detail?: string) {
        super(message, 404, detail);
        this.name = "NotFoundError";
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }
}

export class RateLimitError extends ApiCallError {
    constructor(message = "Забагато спроб. Спробуйте пізніше.", detail?: string) {
        super(message, 429, detail);
        this.name = "RateLimitError";
        Object.setPrototypeOf(this, RateLimitError.prototype);
    }
}

export class ServerError extends ApiCallError {
    constructor(message = "Помилка сервера. Спробуйте пізніше.", status?: number, detail?: string) {
        super(message, status, detail);
        this.name = "ServerError";
        Object.setPrototypeOf(this, ServerError.prototype);
    }
}

export class NetworkError extends ApiCallError {
    constructor(message = "Не вдалось зв'язатись із сервером.") {
        super(message);
        this.name = "NetworkError";
        Object.setPrototypeOf(this, NetworkError.prototype);
    }
}

/**
 * Legacy alias kept so existing call-sites that imported ApiLoginError still compile.
 * New code should throw AuthError directly.
 * @deprecated use AuthError
 */
export class ApiLoginError extends AuthError {
    constructor(message: string, status?: number, detail?: string) {
        super(message, status, detail);
        this.name = "ApiLoginError";
        Object.setPrototypeOf(this, ApiLoginError.prototype);
    }
}
