import {
    ApiCallError,
    AuthError,
    BadRequestError,
    ConflictError,
    ForbiddenError,
    NetworkError,
    NotFoundError,
    RateLimitError,
    ServerError,
} from "./errors.ts";
import { updateAccessToken } from "./client/auth.ts";
import { ApiErrorDetail } from "../models/ApiResponse.ts";

const DOMAIN = `${import.meta.env.VITE_API_DOMAIN}`;
const API = `${DOMAIN}/api`;
const BASE_URL = `${API}/v1`;

const defaultHeaders = {
    "Content-Type": "application/json",
};

const getCsrfToken = (): string | undefined => {
    return document.cookie
        .split("; ")
        .find((row) => row.startsWith("csrftoken="))
        ?.split("=")[1];
};

const getAuthorizationHeaders = (): Record<string, string> => {
    const headers: Record<string, string> = { ...defaultHeaders };

    const csrfToken = getCsrfToken();
    if (csrfToken) {
        headers["X-CSRFToken"] = csrfToken;
    }

    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
    }

    return headers;
};

const clearTokens = () => {
    localStorage.removeItem("accessToken");
};

/**
 * Event the Http wrapper dispatches when the session is unrecoverable
 * (refresh attempt failed). AuthProvider listens for it and transitions
 * the React state to logged-out so the UI catches up with reality.
 */
export const AUTH_EXPIRED_EVENT = "auth:expired";

const dispatchAuthExpired = () => {
    if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent(AUTH_EXPIRED_EVENT));
    }
};

// Single-flight refresh: only ONE refresh request can be in the air at a time.
// Any caller that arrives while a refresh is in progress awaits the same
// promise rather than firing its own. The `authFlow: true` option on the
// auth endpoints themselves prevents reentry from within the refresh request.
let refreshInFlight: Promise<string> | null = null;

const refreshAccessToken = (): Promise<string> => {
    if (refreshInFlight) {
        return refreshInFlight;
    }
    refreshInFlight = (async () => {
        try {
            const newToken = await updateAccessToken();
            const accessToken = newToken.data.access_token;
            localStorage.setItem("accessToken", accessToken);
            return accessToken;
        } catch {
            clearTokens();
            dispatchAuthExpired();
            // Always surface the SAME friendly message regardless of what the
            // backend said. Raw backend details like "invalid uat" should not
            // leak into user-facing toasts.
            throw new AuthError("Сесія завершена. Увійдіть знову.");
        } finally {
            refreshInFlight = null;
        }
    })();
    return refreshInFlight;
};

interface FetchOptions extends RequestInit {
    headers?: Record<string, string>;
    body?: string;
    /**
     * Set on auth-flow requests (log-in, log-out, update_access_token).
     * When true, 401 responses do NOT trigger refresh-and-retry —
     * they surface directly as AuthError. Prevents recursive refresh deadlock.
     */
    authFlow?: boolean;
}

/**
 * Backend error envelope (4xx/5xx) per OpenAPI `ApiErrorResponse`:
 *   { data: {}, meta: {}, errors: [{ code, message?, data? }, ...] }
 * We surface the first error's message + code. `detail` is kept for
 * call-sites that read it, mirroring the legacy field name.
 */
const parseApiError = async (
    response: Response,
): Promise<{ message?: string; code?: string }> => {
    try {
        const body = await response.clone().json();
        const first: ApiErrorDetail | undefined = body?.errors?.[0];
        if (first) {
            return { message: first.message, code: first.code };
        }
    } catch {
        // body wasn't JSON or was empty — fall through
    }
    return {};
};

const throwForStatus = async (response: Response): Promise<never> => {
    const parsed = await parseApiError(response);
    const message = parsed.message || response.statusText || `HTTP ${response.status}`;
    const detail = parsed.message;
    const code = parsed.code;

    if (response.status === 400) {
        throw new BadRequestError(message, detail, code);
    }
    if (response.status === 401) {
        throw new AuthError(message, 401, detail, code);
    }
    if (response.status === 403) {
        throw new ForbiddenError(message, detail, code);
    }
    if (response.status === 404) {
        throw new NotFoundError(message, detail, code);
    }
    if (response.status === 409) {
        throw new ConflictError(message, detail, code);
    }
    if (response.status === 429) {
        throw new RateLimitError(message, detail, code);
    }
    if (response.status >= 500) {
        throw new ServerError(message, response.status, detail, code);
    }
    throw new ApiCallError(message, response.status, detail, code);
};

const handleResponse = async (
    response: Response,
    requestUrl: string,
    requestOptions: RequestInit,
    options: FetchOptions,
) => {
    if (response.ok) {
        return await response.json();
    }

    // Auth-flow requests never trigger refresh — surface the error directly.
    if (options.authFlow) {
        return throwForStatus(response);
    }

    if (response.status === 401) {
        try {
            const newAccessToken = await refreshAccessToken();

            requestOptions.headers = {
                ...requestOptions.headers,
                Authorization: `Bearer ${newAccessToken}`,
            };
            const retryResponse = await fetch(requestUrl, requestOptions);

            if (retryResponse.ok) {
                return await retryResponse.json();
            }
            return throwForStatus(retryResponse);
        } catch (err) {
            if (err instanceof ApiCallError) {
                throw err;
            }
            throw new AuthError("Помилка автентифікації.");
        }
    }

    return throwForStatus(response);
};

const fetchWrapper = async (requestUrl: string, options: FetchOptions = {}) => {
    const { headers = {}, body, authFlow, ...restOptions } = options;
    void authFlow;

    const requestHeaders = {
        ...getAuthorizationHeaders(),
        ...headers,
    };

    const requestOptions: RequestInit = {
        ...restOptions,
        headers: requestHeaders,
        body,
        credentials: "include",
    };

    const url = BASE_URL + requestUrl;
    let response: Response;
    try {
        response = await fetch(url, requestOptions);
    } catch {
        throw new NetworkError();
    }
    return handleResponse(response, url, requestOptions, options);
};

const Http = {
    get: (url: string, options: FetchOptions = {}) =>
        fetchWrapper(url, { ...options, method: "GET" }),

    post: <T>(url: string, body: T, options: FetchOptions = {}) =>
        fetchWrapper(url, {
            ...options,
            method: "POST",
            body: body ? JSON.stringify(body) : undefined,
        }),

    patch: <T>(url: string, body: T, options: FetchOptions = {}) =>
        fetchWrapper(url, {
            ...options,
            method: "PATCH",
            body: body ? JSON.stringify(body) : undefined,
        }),

    delete: (url: string, options: FetchOptions = {}) =>
        fetchWrapper(url, { ...options, method: "DELETE" }),
};

export default Http;

export const ping = async () => {
    return await Http.get(`/ping`);
};
