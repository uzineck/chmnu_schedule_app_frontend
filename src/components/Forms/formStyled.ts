import styled from "styled-components";
import { media } from "../../styles/media.ts";

export const FormCard = styled.form`
    width: 100%;
    max-width: 100%;
    padding: 16px;
    border-radius: 12px;
    box-shadow: 0 4px 16px ${({theme}) => theme.colors.shadow};
    border: 1px solid ${({theme}) => theme.colors.border};
    display: flex;
    flex-direction: column;
    gap: 14px;
    margin: 0 auto;
    background-color: ${({theme}) => theme.colors.surface};

    ${media.up('phone')} {
        padding: 20px;
        gap: 16px;
    }

    ${media.up('tablet')} {
        max-width: 460px;
        padding: 24px;
        gap: 18px;
    }
`;

export const FormSectionContainer = styled.section`
    display: flex;
    flex-direction: column;
    gap: 10px;

    & + & {
        margin-top: 8px;
        padding-top: 14px;
        border-top: 1px solid ${({theme}) => theme.colors.border};
    }

    ${media.up('tablet')} {
        gap: 12px;
    }
`;

export const FormSectionTitle = styled.h3`
    font-size: 0.85rem;
    font-weight: 600;
    color: ${({theme}) => theme.colors.textSubtle};
    text-transform: uppercase;
    letter-spacing: 0.04em;
    margin: 0;
`;

export const FormFieldRow = styled.div`
    display: flex;
    flex-direction: column;
    gap: 6px;
`;

export const FormFieldLabel = styled.label`
    font-weight: 500;
    color: ${({theme}) => theme.colors.textPrimary};
    font-size: 0.9rem;
    text-align: left;
`;

export const FormFieldInput = styled.input<{ $hasError?: boolean }>`
    width: 100%;
    padding: 10px 12px;
    border: 1px solid ${({$hasError, theme}) => $hasError ? theme.colors.error : theme.colors.border};
    border-radius: 8px;
    font-size: 0.95rem;
    background-color: ${({theme}) => theme.colors.surface};
    color: ${({theme}) => theme.colors.textPrimary};
    transition: border-color 0.15s ease, box-shadow 0.15s ease;

    &:hover:not(:disabled):not(:focus) {
        border-color: ${({$hasError, theme}) => $hasError ? theme.colors.error : theme.colors.borderInput};
    }

    &:focus {
        outline: none;
        border-color: ${({theme}) => theme.colors.primary};
        box-shadow: 0 0 0 3px ${({theme}) => theme.colors.primaryFocusShadow};
    }

    &::placeholder {
        color: ${({theme}) => theme.colors.textMuted};
    }

    &:disabled {
        background-color: ${({theme}) => theme.colors.surfaceMuted};
        color: ${({theme}) => theme.colors.textMuted};
        cursor: not-allowed;
    }

    ${media.up('tablet')} {
        padding: 11px 14px;
        font-size: 1rem;
    }
`;

export const FormFieldSelect = styled.select<{ $hasError?: boolean }>`
    width: 100%;
    padding: 10px 12px;
    border: 1px solid ${({$hasError, theme}) => $hasError ? theme.colors.error : theme.colors.border};
    border-radius: 8px;
    font-size: 0.95rem;
    background-color: ${({theme}) => theme.colors.surface};
    color: ${({theme}) => theme.colors.textPrimary};
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
    cursor: pointer;

    &:hover:not(:disabled):not(:focus) {
        border-color: ${({$hasError, theme}) => $hasError ? theme.colors.error : theme.colors.borderInput};
    }

    &:focus {
        outline: none;
        border-color: ${({theme}) => theme.colors.primary};
        box-shadow: 0 0 0 3px ${({theme}) => theme.colors.primaryFocusShadow};
    }

    &:disabled {
        background-color: ${({theme}) => theme.colors.surfaceMuted};
        color: ${({theme}) => theme.colors.textMuted};
        cursor: not-allowed;
    }

    ${media.up('tablet')} {
        padding: 11px 14px;
        font-size: 1rem;
    }
`;

export const FormFieldHelper = styled.div`
    font-size: 0.8rem;
    color: ${({theme}) => theme.colors.textMuted};
`;

export const FormFieldError = styled.div`
    color: ${({theme}) => theme.colors.error};
    font-size: 0.8rem;
    line-height: 1.4;
`;

export const FormActionsRow = styled.div`
    display: flex;
    flex-direction: column-reverse;
    gap: 10px;
    margin-top: 6px;

    ${media.up('phone')} {
        flex-direction: row;
        justify-content: flex-end;
        gap: 12px;
    }
`;

const buttonBase = `
    padding: 10px 18px;
    border-radius: 8px;
    font-size: 0.95rem;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease;
    min-height: 42px;
    flex: 1 1 auto;

    &:disabled {
        cursor: not-allowed;
        opacity: 0.6;
    }
`;

export const FormSubmitButton = styled.button`
    ${buttonBase}
    background-color: ${({theme}) => theme.colors.primary};
    color: ${({theme}) => theme.colors.textInverse};
    border: 1px solid ${({theme}) => theme.colors.primary};

    &:hover:not(:disabled), &:focus-visible:not(:disabled) {
        background-color: ${({theme}) => theme.colors.primaryHover};
        border-color: ${({theme}) => theme.colors.primaryHover};
        outline: none;
    }

    &:focus-visible {
        box-shadow: 0 0 0 3px ${({theme}) => theme.colors.primaryFocusShadow};
    }

    ${media.up('phone')} {
        flex: 0 0 auto;
        min-width: 160px;
    }
`;

export const FormCancelButton = styled.button`
    ${buttonBase}
    background-color: transparent;
    color: ${({theme}) => theme.colors.textSubtle};
    border: 1px solid ${({theme}) => theme.colors.border};

    &:hover:not(:disabled), &:focus-visible:not(:disabled) {
        background-color: ${({theme}) => theme.colors.surfaceMutedHover};
        color: ${({theme}) => theme.colors.textPrimary};
        border-color: ${({theme}) => theme.colors.borderInput};
        outline: none;
    }

    ${media.up('phone')} {
        flex: 0 0 auto;
        min-width: 120px;
    }
`;

export const FormDangerButton = styled(FormSubmitButton)`
    background-color: ${({theme}) => theme.colors.error};
    border-color: ${({theme}) => theme.colors.error};

    &:hover:not(:disabled), &:focus-visible:not(:disabled) {
        background-color: ${({theme}) => theme.colors.error};
        border-color: ${({theme}) => theme.colors.error};
        filter: brightness(0.92);
    }
`;
