import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import type { MessageInstance } from "antd/es/message/interface";
import { ApiCallError } from "../../api/errors.ts";

interface UseFormSubmitOptions<TValues, TResult> {
    submit: (values: TValues) => Promise<TResult>;
    /**
     * Path to navigate to on success. Pass a function to derive it from the
     * resolved result (e.g. `/lesson/${result.data.uuid}/add`).
     * Ignored when `onSuccess` is provided.
     */
    successTo?: string | ((result: TResult, values: TValues) => string);
    /** Success toast text. */
    successMessage: string;
    /** Extra location.state to merge (e.g. response.data passthrough). */
    successStateExtra?: (result: TResult, values: TValues) => Record<string, unknown>;
    /** Custom toast key — defaults to "form". */
    loadingKey?: string;
    /** Custom loading toast text — defaults to "Завантаження...". */
    loadingMessage?: string;
    /**
     * Custom error → user-facing message mapper. Overrides the default
     * (ApiCallError.message / "Виникла невідома помилка"). Use this when you
     * need granular handling of error subclasses (AuthError, RateLimitError,
     * NetworkError, etc.).
     */
    formatError?: (error: unknown) => string;
    /**
     * If provided, called on success instead of navigating. The hook shows
     * the success toast itself (since there's no route change to carry it
     * via location.state). Use for in-place forms (e.g. inline-expand
     * sections) that should stay on the page.
     */
    onSuccess?: (result: TResult, values: TValues) => void;
    /**
     * External `messageApi` to use for loading/success/error toasts. When
     * provided, the hook does NOT create its own — `contextHolder` returned
     * is `null`. Use when the form may unmount immediately after success
     * (e.g. inline-expand sections that collapse on save) so the toast
     * survives unmount via a parent-owned context holder.
     */
    messageApi?: MessageInstance;
}

interface FormikLike {
    setSubmitting: (submitting: boolean) => void;
}

/**
 * Consolidates the loading-toast / try / api / navigate / catch / setSubmitting
 * boilerplate that every form was duplicating. Returns an `onSubmit` ready
 * to drop straight into `useFormik({ onSubmit })`.
 */
export const useFormSubmit = <TValues, TResult = unknown>({
    submit,
    successTo,
    successMessage,
    successStateExtra,
    loadingKey = "form",
    loadingMessage = "Завантаження...",
    formatError,
    onSuccess,
    messageApi: externalMessageApi,
}: UseFormSubmitOptions<TValues, TResult>) => {
    const navigate = useNavigate();
    const [internalMessageApi, internalContextHolder] = message.useMessage();
    const messageApi = externalMessageApi ?? internalMessageApi;
    const contextHolder = externalMessageApi ? null : internalContextHolder;

    const onSubmit = useCallback(
        async (values: TValues, helpers: FormikLike) => {
            messageApi.loading({ key: loadingKey, content: loadingMessage });
            try {
                const result = await submit(values);
                messageApi.destroy(loadingKey);
                if (onSuccess) {
                    messageApi.success({ content: successMessage, duration: 2 });
                    onSuccess(result, values);
                } else if (successTo !== undefined) {
                    const extra = successStateExtra ? successStateExtra(result, values) : {};
                    const to = typeof successTo === "function" ? successTo(result, values) : successTo;
                    navigate(to, { state: { successMessage, ...extra } });
                }
            } catch (error) {
                const errorText = formatError
                    ? formatError(error)
                    : error instanceof ApiCallError
                        ? error.message
                        : "Виникла невідома помилка";
                messageApi.error({ key: loadingKey, content: errorText, duration: 3 });
            } finally {
                helpers.setSubmitting(false);
            }
        },
        [messageApi, submit, successTo, successMessage, successStateExtra, loadingKey, loadingMessage, formatError, navigate, onSuccess],
    );

    return { onSubmit, contextHolder };
};
