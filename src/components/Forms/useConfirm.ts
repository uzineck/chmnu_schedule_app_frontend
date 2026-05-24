import { useCallback } from "react";
import { Modal } from "antd";

interface ConfirmOptions {
    title: string;
    content?: string;
    okText?: string;
    cancelText?: string;
    /** Show as destructive (red OK button). */
    danger?: boolean;
}

/**
 * Wrap a callback in an antd confirm modal. Used by destructive actions
 * (delete forms) so the submit isn't a one-click footgun.
 *
 * Usage:
 *   const confirm = useConfirm();
 *   const handleSubmit = (values) => confirm({...}, () => doDelete(values));
 */
export const useConfirm = () => {
    return useCallback(
        (
            options: ConfirmOptions,
            onConfirm: () => void | Promise<void>,
        ) => {
            Modal.confirm({
                title: options.title,
                content: options.content,
                okText: options.okText ?? "Підтвердити",
                cancelText: options.cancelText ?? "Скасувати",
                okButtonProps: options.danger ? { danger: true } : undefined,
                centered: true,
                onOk: onConfirm,
            });
        },
        [],
    );
};
