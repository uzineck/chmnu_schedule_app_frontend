const BASE_URL = 'http://localhost:80/api/v1';

const defaultHeaders = {
    "Content-Type": "application/json",
};

interface FetchOptions extends RequestInit {
    headers?: Record<string, string>;
    body?: string;
}

const fetchWrapper = async (requestUrl: string, options: FetchOptions = {}) => {
    const { headers = {}, body, ...restOptions } = options;

    const requestOptions: RequestInit = {
        ...restOptions,
        headers: {
            ...defaultHeaders,
            ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
    };

    const url = BASE_URL + requestUrl;
    const response = await fetch(url, requestOptions);

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status} in request to ${url}`);
    }
    return await response.json();
};

const Http = {
    // GET request
    get: (url: string, options: FetchOptions = {}) =>
        fetchWrapper(url, { ...options, method: 'GET' }),

    // POST request
    post: (url: string, body: never, options: FetchOptions = {}) =>
        fetchWrapper(url, { ...options, method: 'POST', body }),

    // PUT request
    put: (url: string, body: never, options: FetchOptions = {}) =>
        fetchWrapper(url, { ...options, method: 'PUT', body }),

    // DELETE request
    delete: (url: string, options: FetchOptions = {}) =>
        fetchWrapper(url, { ...options, method: 'DELETE' }),
};

// export const buildQueryParams = (params: Record<string, unknown>): string => {
//     return new URLSearchParams(
//         Object.entries(params)
//             .filter(([, value]) => value != null)
//             .map(([key, value]) => [key, String(value)])
//     ).toString();
// };

export default Http;
