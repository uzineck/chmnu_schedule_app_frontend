import styled from "styled-components";

export const FormPage = styled.div`
    display: flex;
    justify-content: center;
    align-items: flex-start;
    min-height: 100vh;
    font-family: Arial, sans-serif;
    padding: 2rem;

    @media (max-width: 768px) {
        padding: 1rem;
    }

    @media (max-width: 480px) {
        padding: 0.5rem;
    }
`;

export const MediumFormDiv = styled.div`
    width: 100%;
    max-width: 600px;
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 4px 20px ${({theme}) => theme.colors.shadow};
    display: flex;
    flex-direction: column;
    gap: 2rem;
    margin: 4.5rem auto;
    background-color: ${({theme}) => theme.colors.surface};

    @media (max-width: 768px) {
        max-width: 500px;
        padding: 1.5rem;
    }

    @media (max-width: 480px) {
        max-width: 100%;
        padding: 1rem;
        margin: 2rem auto;
    }
`;

export const SmallFormDiv = styled.div`
    width: 100%;
    max-width: 400px;
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 4px 20px ${({theme}) => theme.colors.shadow};
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin: 2rem auto;
    background-color: ${({theme}) => theme.colors.surface};

    @media (max-width: 768px) {
        max-width: 350px;
        padding: 1.5rem;
    }

    @media (max-width: 480px) {
        max-width: 100%;
        padding: 1rem;
        margin: 1.5rem auto;
    }
`;

export const FormTitle = styled.h2`
    font-size: 1.5rem;
    font-weight: bold;
    color: ${({theme}) => theme.colors.textPrimary};
    text-align: center;

    @media (max-width: 768px) {
        font-size: 1.25rem;
    }

    @media (max-width: 480px) {
        font-size: 1rem;
    }
`;

export const FormContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1.5rem;

    @media (max-width: 768px) {
        gap: 1rem;
    }

    @media (max-width: 480px) {
        gap: 0.75rem;
    }
`;

export const FormSelect = styled.select`
    padding: 0.5rem;
    font-size: 1rem;
    border: 1px solid ${({theme}) => theme.colors.borderInput};
    border-radius: 5px;
    background-color: ${({theme}) => theme.colors.surface};

    @media (max-width: 768px) {
        font-size: 0.9rem;
        padding: 0.5rem 0.75rem;
    }

    @media (max-width: 480px) {
        font-size: 0.85rem;
        padding: 0.4rem 0.6rem;
    }
`;

export const FormSearchContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 1rem;

    > * {
        flex-shrink: 0;
        max-width: 80%;
    }

    @media (max-width: 768px) {
        gap: 0.75rem;
    }

    @media (max-width: 480px) {
        gap: 0.5rem;
    }
`;

export const FormLessonTypeContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 1rem;

    @media (max-width: 768px) {
        gap: 0.75rem;
    }

    @media (max-width: 480px) {
        gap: 0.5rem;
        flex-direction: column;
    }
`;

export const FormButton = styled.button`
    padding: 0.75rem;
    font-size: 1rem;
    background-color: ${({theme}) => theme.colors.primary};
    color: ${({theme}) => theme.colors.textInverse};
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:disabled {
        background-color: ${({theme}) => theme.colors.primaryDisabled};
        cursor: not-allowed;
    }

    &:hover {
        background-color: ${({theme}) => theme.colors.primaryHover};
        transform: scale(1.05);
    }

    @media (max-width: 768px) {
        padding: 0.6rem 1rem;
        font-size: 0.9rem;
    }

    @media (max-width: 480px) {
        padding: 0.5rem 0.8rem;
        font-size: 0.85rem;
    }
`;

export const ButtonsContainer = styled.div`
    display: flex;
    justify-content: space-between;
    gap: 1rem;

    @media (max-width: 768px) {
        flex-direction: column;
        gap: 0.75rem;
    }

    @media (max-width: 480px) {
        gap: 0.5rem;
    }
`;

export const GoBackButton = styled(FormButton)`
    background-color: ${({theme}) => theme.colors.surfaceMuted};
    color: ${({theme}) => theme.colors.textPrimary};
    border: 1px solid ${({theme}) => theme.colors.borderInput};

    &:hover {
        background-color: ${({theme}) => theme.colors.surfaceMutedHover};
    }

    @media (max-width: 768px) {
        padding: 0.6rem 1rem;
        font-size: 0.9rem;
    }

    @media (max-width: 480px) {
        padding: 0.5rem 0.8rem;
        font-size: 0.85rem;
    }
`;
