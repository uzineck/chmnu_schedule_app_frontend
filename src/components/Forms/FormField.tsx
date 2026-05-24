import React from "react";
import { FormFieldError, FormFieldHelper, FormFieldInput, FormFieldLabel, FormFieldRow } from "./formStyled.ts";

interface FormFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "name"> {
    name: string;
    label: string;
    helper?: string;
    error?: string | false;
    touched?: boolean;
    /**
     * Render a custom control (search component, select, etc.) instead of the
     * default text input. The wrapper still handles label + error styling.
     */
    children?: React.ReactNode;
}

const FormField: React.FC<FormFieldProps> = ({
    name,
    label,
    helper,
    error,
    touched,
    children,
    ...inputProps
}) => {
    const showError = Boolean(touched && error);
    const errorText = showError ? error : null;
    const id = inputProps.id ?? name;

    return (
        <FormFieldRow>
            <FormFieldLabel htmlFor={id}>{label}</FormFieldLabel>
            {children ?? (
                <FormFieldInput
                    id={id}
                    name={name}
                    $hasError={showError}
                    aria-invalid={showError || undefined}
                    aria-describedby={
                        errorText ? `${id}-error` : helper ? `${id}-helper` : undefined
                    }
                    {...inputProps}
                />
            )}
            {helper && !errorText && (
                <FormFieldHelper id={`${id}-helper`}>{helper}</FormFieldHelper>
            )}
            {errorText && <FormFieldError id={`${id}-error`}>{errorText}</FormFieldError>}
        </FormFieldRow>
    );
};

export default FormField;
