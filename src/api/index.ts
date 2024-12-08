import { ApiCallError } from "./errors.ts";
import {updateAccessToken} from "./client/auth.ts";
import {TokenSchema} from "../models/client/request/TokenSchema.ts";

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
	const accessToken = localStorage.getItem('accessToken');

	const requestHeaders: Record<string, string> = {
		...defaultHeaders,
		...headers,
	};

	if (csrfToken) {
		requestHeaders['X-CSRFToken'] = csrfToken;
	}

	if (accessToken) {
		requestHeaders['Authorization'] = `Bearer ${accessToken}`;
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
		if (response.status === 401) {
			console.warn('Access token expired. Attempting to refresh...');
			const refreshToken = localStorage.getItem('refreshToken');

			if (refreshToken) {
				try {
					const data: TokenSchema = { token: refreshToken };
					const newToken = await updateAccessToken(data);

					localStorage.setItem('accessToken', newToken.data.access_token);

					requestHeaders['Authorization'] = `Bearer ${newToken.data.access_token}`;
					const retryResponse = await fetch(url, {
						...requestOptions,
						headers: requestHeaders,
					});

					if (!retryResponse.ok) {
						throw new ApiCallError('Failed after token refresh');
					}

					return await retryResponse.json();
				} catch (refreshError) {
					console.error('Token refresh failed:', refreshError);
					throw new ApiCallError('Session expired. Please log in again.');
				}
			} else {
				throw new ApiCallError('Refresh token missing. Please log in again.');
			}
		} else {
			let errorDetail = 'An error occurred';
			try {
				const errorBody = await response.json();
				if (errorBody?.detail) {
					errorDetail = errorBody.detail;
				}
			} catch (e) {
				console.error('Failed to parse error response:', e);
			}

			throw new ApiCallError(errorDetail);
		}
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