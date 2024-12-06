import {ApiCallError} from "./errors.ts";

const DOMAIN = `${import.meta.env.VITE_API_DOMAIN}`;
const API = `${DOMAIN}/api`;
const BASE_URL = `${API}/v1`;

const defaultHeaders = {
    "Content-Type": "application/json",
};

const getCsrfToken = (): string | null => {
    const csrfToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('csrftoken='))
        ?.split('=')[1];
    return csrfToken || null;
};

interface FetchOptions extends RequestInit {
    headers?: Record<string, string>;
    body?: string;
}

const fetchWrapper = async (requestUrl: string, options: FetchOptions = {}) => {
    const { headers = {}, body, ...restOptions } = options;

    const csrfToken = getCsrfToken();

    const requestHeaders: Record<string, string> = {
        ...defaultHeaders,
        ...headers,
    };

    if (csrfToken) {
        requestHeaders['X-CSRFToken'] = csrfToken;
    }

    const requestOptions: RequestInit = {
        ...restOptions,
        headers: requestHeaders,
        body,
        credentials: 'include',
    };

    const url = BASE_URL + requestUrl;
    const response = await fetch(url, requestOptions);

    if (!response.ok) {
        let errorDetail = 'An error occurred';
        try {
            const errorBody = await response.json();
            if (errorBody?.detail) {
                errorDetail = errorBody.detail;
            }
        } catch (e) {
            console.error("Failed to parse error response:", e);
        }

        throw new ApiCallError(errorDetail);
    }

    return await response.json();
};
const Http = {
    // GET request
    get: (url: string, options: FetchOptions = {}) =>
        fetchWrapper(url, { ...options, method: 'GET' }),

    // POST request
    post: <T>(url: string, body: T, options: FetchOptions = {}) =>
        fetchWrapper(url, {
            ...options,
            method: 'POST',
            body: body ? JSON.stringify(body) : undefined, // Serialize body to string
        }),

    // PUT request
    put: <T>(url: string, body: T, options: FetchOptions = {}) =>
        fetchWrapper(url, {
            ...options,
            method: 'PUT',
            body: body ? JSON.stringify(body) : undefined, // Serialize body to string
        }),

    // DELETE request
    delete: (url: string, options: FetchOptions = {}) =>
        fetchWrapper(url, { ...options, method: 'DELETE' }),
};


export default Http;

export const ping = async () => {
    return await Http.get(`/ping`);
};