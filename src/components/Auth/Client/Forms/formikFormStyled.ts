import styled from "styled-components";

export const FormCard = styled.form`
    width: 100%;
    max-width: 400px;
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    margin: 0 auto;
    background-color: #fff;
`;

export const FormSubmit = styled.form`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
`;

export const FormInputGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 1rem;
`;

export const FormLabel = styled.label`
    font-weight: 500;
    color: #333;
    font-size: 0.9rem;
    text-align: left;
`;

export const FormInput = styled.input`
    width: 100%;
    padding: 0.75rem;
    margin-bottom: 0;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 1rem;
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
    transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;

    &:focus {
        outline: none;
        border-color: #7f00ff;
        box-shadow: 0 0 8px rgba(127, 0, 255, 0.3);
    }
`;

export const SelectInput = styled.select`
    width: 100%;
    padding: 0.75rem;
    margin-bottom: 0;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 1rem;
    background-color: #fff;
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
    transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;

    &:focus {
        outline: none;
        border-color: #7f00ff;
        box-shadow: 0 0 8px rgba(127, 0, 255, 0.3);
    }
`;

export const ErrorMessage = styled.div`
    color: #ff4d4d;
    font-size: 0.875rem;
    text-align: left;
    margin-bottom: 0;
`;

export const SubmitButton = styled.button`
    width: 100%;
    padding: 0.75rem;
    background-color: mediumpurple;
    color: white;
    border: none;
    border-radius: 5px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.3s ease-in-out, transform 0.2s ease;

    &:hover {
        background-color: darkviolet;
        transform: scale(1.05);
    }

    &:disabled {
        background-color: #b19cd9;
        cursor: not-allowed;
    }
`;