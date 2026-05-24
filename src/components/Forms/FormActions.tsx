import React from "react";
import { useNavigate } from "react-router-dom";
import { FormActionsRow, FormCancelButton, FormDangerButton, FormSubmitButton } from "./formStyled.ts";

interface FormActionsProps {
    submitLabel: string;
    submitLoadingLabel?: string;
    cancelLabel?: string;
    /** Where Cancel navigates to. If omitted, navigate(-1) is used. */
    cancelTo?: string;
    onCancel?: () => void;
    isSubmitting?: boolean;
    danger?: boolean;
    disabled?: boolean;
}

const FormActions: React.FC<FormActionsProps> = ({
    submitLabel,
    submitLoadingLabel,
    cancelLabel = "Скасувати",
    cancelTo,
    onCancel,
    isSubmitting,
    danger,
    disabled,
}) => {
    const navigate = useNavigate();

    const handleCancel = () => {
        if (onCancel) {
            onCancel();
            return;
        }
        if (cancelTo) {
            navigate(cancelTo);
            return;
        }
        navigate(-1);
    };

    const SubmitTag = danger ? FormDangerButton : FormSubmitButton;
    const labelWhenLoading = submitLoadingLabel ?? "Завантаження...";

    return (
        <FormActionsRow>
            <FormCancelButton type="button" onClick={handleCancel} disabled={isSubmitting}>
                {cancelLabel}
            </FormCancelButton>
            <SubmitTag type="submit" disabled={isSubmitting || disabled}>
                {isSubmitting ? labelWhenLoading : submitLabel}
            </SubmitTag>
        </FormActionsRow>
    );
};

export default FormActions;
