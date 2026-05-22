import styled from "styled-components";
import {media} from "../../../../styles/media.ts";

export const FormCard = styled.form`
    width: 100%;
    max-width: 100%;
    padding: 1rem;
    border-radius: 10px;
    box-shadow: 0 4px 20px ${({theme}) => theme.colors.shadow};
    display: flex;
    flex-direction: column;
    margin: 0 auto;
    background-color: ${({theme}) => theme.colors.surface};

    ${media.up('phone')} {
        padding: 1.5rem;
    }

    ${media.up('tablet')} {
        max-width: 400px;
        padding: 2rem;
    }
`;

export const FormSubmit = styled.form`
    display: flex;
    flex-direction: column;
    gap: 0.3rem;

    ${media.up('phone')} {
        gap: 0.4rem;
    }

    ${media.up('tablet')} {
        gap: 0.5rem;
    }
`;

export const FormInputGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
    margin-bottom: 0.6rem;

    ${media.up('phone')} {
        gap: 0.4rem;
        margin-bottom: 0.8rem;
    }

    ${media.up('tablet')} {
        gap: 0.5rem;
        margin-bottom: 1rem;
    }
`;

export const FormLabel = styled.label`
    font-weight: 500;
    color: ${({theme}) => theme.colors.textPrimary};
    font-size: 0.8rem;
    text-align: left;

    ${media.up('phone')} {
        font-size: 0.85rem;
    }

    ${media.up('tablet')} {
        font-size: 0.9rem;
    }
`;

export const FormInput = styled.input`
    width: 100%;
    padding: 0.6rem;
    margin-bottom: 0;
    border: 1px solid ${({theme}) => theme.colors.border};
    border-radius: 5px;
    font-size: 0.9rem;
    box-shadow: inset 0 1px 3px ${({theme}) => theme.colors.shadow};
    transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;

    &:focus {
        outline: none;
        border-color: ${({theme}) => theme.colors.primaryFocusRing};
        box-shadow: 0 0 8px ${({theme}) => theme.colors.primaryFocusShadow};
    }

    ${media.up('phone')} {
        padding: 0.7rem;
        font-size: 0.95rem;
    }

    ${media.up('tablet')} {
        padding: 0.75rem;
        font-size: 1rem;
    }
`;

export const SelectInput = styled.select`
    width: 100%;
    padding: 0.6rem;
    margin-bottom: 0;
    border: 1px solid ${({theme}) => theme.colors.border};
    border-radius: 5px;
    font-size: 0.9rem;
    background-color: ${({theme}) => theme.colors.surface};
    box-shadow: inset 0 1px 3px ${({theme}) => theme.colors.shadow};
    transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;

    &:focus {
        outline: none;
        border-color: ${({theme}) => theme.colors.primaryFocusRing};
        box-shadow: 0 0 8px ${({theme}) => theme.colors.primaryFocusShadow};
    }

    ${media.up('phone')} {
        padding: 0.7rem;
        font-size: 0.95rem;
    }

    ${media.up('tablet')} {
        padding: 0.75rem;
        font-size: 1rem;
    }
`;

export const ErrorMessage = styled.div`
    color: ${({theme}) => theme.colors.error};
    font-size: 0.8rem;
    text-align: left;
    margin-bottom: 0;

    ${media.up('phone')} {
        font-size: 0.85rem;
    }

    ${media.up('tablet')} {
        font-size: 0.875rem;
    }
`;

export const SubmitButton = styled.button`
    width: 100%;
    padding: 0.6rem;
    background-color: ${({theme}) => theme.colors.primary};
    color: ${({theme}) => theme.colors.textInverse};
    border: none;
    border-radius: 5px;
    font-size: 0.9rem;
    cursor: pointer;
    transition: background-color 0.3s ease-in-out, transform 0.2s ease;

    &:hover {
        background-color: ${({theme}) => theme.colors.primaryHover};
        transform: scale(1.05);
    }

    &:disabled {
        background-color: ${({theme}) => theme.colors.primaryDisabled};
        cursor: not-allowed;
    }

    ${media.up('phone')} {
        padding: 0.7rem;
        font-size: 0.95rem;
    }

    ${media.up('tablet')} {
        padding: 0.75rem;
        font-size: 1rem;
    }
`;
