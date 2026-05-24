export interface ApiErrorDetail {
    /**
     * Machine-readable code derived from the backend exception class name
     * (SCREAMING_SNAKE). Stable across releases — use this for any
     * localization or programmatic handling.
     */
    code: string;
    /** Human-readable English message. Localize via `code` if shown to users. */
    message?: string;
    /** Per-exception payload (dataclass fields of the raised ServiceException). */
    data?: Record<string, unknown>;
}

export interface ApiResponse<T> {
    data: T;
    meta?: Record<string, unknown>;
    errors?: ApiErrorDetail[];
}
