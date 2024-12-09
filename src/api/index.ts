import { ApiCallError } from "./errors.ts";
import { updateAccessToken } from "./client/auth.ts";
import { TokenSchema } from "../models/client/request/TokenSchema.ts";

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

let tokenRefreshPromise: Promise<void> | null = null;

const refreshAccessToken = async (): Promise<void> => {
	if (!tokenRefreshPromise) {
		const refreshToken = localStorage.getItem("refreshToken");
		if (!refreshToken) {
			clearTokens();
			throw new ApiCallError("Please log in again.");
		}

		tokenRefreshPromise = (async () => {
			try {
				const data: TokenSchema = { token: refreshToken };
				const newToken = await updateAccessToken(data);

				localStorage.setItem("accessToken", newToken.data.access_token);
			} catch {
				clearTokens();
				throw new ApiCallError("Please log in again.");
			} finally {
				tokenRefreshPromise = null;
			}
		})();
	}

	return tokenRefreshPromise;
};

const clearTokens = () => {
	localStorage.removeItem("accessToken");
	localStorage.removeItem("refreshToken");
};

const handleResponse = async (
	response: Response,
	requestUrl: string,
	requestOptions: RequestInit
) => {
	if (response.ok) {
		return await response.json();
	}

	if (response.status === 401) {
		try {
			await refreshAccessToken();

			const newAccessToken = localStorage.getItem("accessToken");
			if (newAccessToken) {
				requestOptions.headers = {
					...requestOptions.headers,
					Authorization: `Bearer ${newAccessToken}`,
				};
			}

			const retryResponse = await fetch(requestUrl, requestOptions);
			if (!retryResponse.ok) {
				throw new ApiCallError("Failed after token refresh");
			}
			return await retryResponse.json();
		} catch {
			throw new ApiCallError("Unauthorized request. Please log in again.");
		}
	}

	let errorDetail = "An error occurred";
	try {
		const errorBody = await response.json();
		if (errorBody?.detail) {
			errorDetail = errorBody.detail;
		}
	} catch {
		throw new ApiCallError(errorDetail)
	}

	throw new ApiCallError(errorDetail);
};

interface FetchOptions extends RequestInit {
	headers?: Record<string, string>;
	body?: string;
}

// Вспомогательная функция fetch
const fetchWrapper = async (requestUrl: string, options: FetchOptions = {}) => {
	const { headers = {}, body, ...restOptions } = options;

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

	const response = await fetch(url, requestOptions);

	return handleResponse(response, url, requestOptions);
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
