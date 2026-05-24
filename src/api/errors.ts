export class ApiCallError extends Error {
    public readonly status?: number;
    public readonly detail?: string;
    /**
     * Machine-readable code from `ApiErrorResponse.errors[0].code` (SCREAMING_SNAKE).
     * Stable across releases — use for programmatic handling / localization keys.
     */
    public readonly code?: string;

    constructor(message: string, status?: number, detail?: string, code?: string) {
        super(message);
        this.name = "ApiCallError";
        this.status = status;
        this.detail = detail;
        this.code = code;
        Object.setPrototypeOf(this, ApiCallError.prototype);
    }
}

export class AuthError extends ApiCallError {
    constructor(message: string, status?: number, detail?: string, code?: string) {
        super(message, status, detail, code);
        this.name = "AuthError";
        Object.setPrototypeOf(this, AuthError.prototype);
    }
}

export class BadRequestError extends ApiCallError {
    constructor(message: string, detail?: string, code?: string) {
        super(message, 400, detail, code);
        this.name = "BadRequestError";
        Object.setPrototypeOf(this, BadRequestError.prototype);
    }
}

export class ForbiddenError extends ApiCallError {
    constructor(message: string, detail?: string, code?: string) {
        super(message, 403, detail, code);
        this.name = "ForbiddenError";
        Object.setPrototypeOf(this, ForbiddenError.prototype);
    }
}

export class NotFoundError extends ApiCallError {
    constructor(message: string, detail?: string, code?: string) {
        super(message, 404, detail, code);
        this.name = "NotFoundError";
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }
}

export class ConflictError extends ApiCallError {
    constructor(message: string, detail?: string, code?: string) {
        super(message, 409, detail, code);
        this.name = "ConflictError";
        Object.setPrototypeOf(this, ConflictError.prototype);
    }
}

export class RateLimitError extends ApiCallError {
    constructor(message = "Забагато спроб. Спробуйте пізніше.", detail?: string, code?: string) {
        super(message, 429, detail, code);
        this.name = "RateLimitError";
        Object.setPrototypeOf(this, RateLimitError.prototype);
    }
}

export class ServerError extends ApiCallError {
    constructor(message = "Помилка сервера. Спробуйте пізніше.", status?: number, detail?: string, code?: string) {
        super(message, status, detail, code);
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
