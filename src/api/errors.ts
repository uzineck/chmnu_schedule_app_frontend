export class ApiCallError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "ApiCallError";
        Object.setPrototypeOf(this, ApiCallError.prototype);
    }
}