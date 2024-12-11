export class ApiCallError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "ApiCallError";
        Object.setPrototypeOf(this, ApiCallError.prototype);
    }
}

export class ApiLoginError extends ApiCallError {
    constructor(message: string) {
        super(message);
        this.name = "ApiLoginError";
        Object.setPrototypeOf(this, ApiLoginError.prototype);
    }
}