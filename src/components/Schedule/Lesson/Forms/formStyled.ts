import styled from "styled-components";

export const FormPage = styled.div`
    display: flex;
    justify-content: center;
    align-items: flex-start;
    min-height: 100vh;
    font-family: Arial, sans-serif;
    padding: 2rem;
`;

export const MediumFormDiv = styled.div`
    width: 100%;
    max-width: 600px;
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    gap: 2rem;
    margin: 4.5rem auto;
    background-color: #fff;
`;

export const SmallFormDiv = styled.div`
    width: 100%;
    max-width: 400px;
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin: 2rem auto;
    background-color: #fff;
`;

export const FormTitle = styled.h2`
    font-size: 1.5rem;
    font-weight: bold;
    color: #333;
    text-align: center;
`;

export const FormContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
`;

export const FormSelect = styled.select`
    padding: 0.5rem;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: #fff;
`;

export const FormSearchContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    
    > *{
        flex-shrink: 0;
        max-width: 80%;
    }
`;

export const FormLessonTypeContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 1rem;
`;

export const FormButton = styled.button`
    padding: 0.75rem;
    font-size: 1rem;
    background-color: mediumpurple;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:disabled {
        background-color: #b19cd9;
        cursor: not-allowed;
    }

    &:hover {
        background-color: darkviolet;
        transform: scale(1.05);
    }
`;

export const ButtonsContainer = styled.div`
    display: flex;
    justify-content: space-between;
    gap: 1rem;
`;

export const GoBackButton = styled(FormButton)`
    background-color: #f5f5f5;
    color: #333;
    border: 1px solid #ccc;

    &:hover {
        background-color: #e0e0e0;
    }
`;
