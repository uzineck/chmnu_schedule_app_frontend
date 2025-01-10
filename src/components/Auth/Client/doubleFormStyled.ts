import styled from "styled-components";

export const DoubleFormPage = styled.div`
    display: flex;
    justify-content: center;
    align-items: flex-start;
    min-height: 100vh;
    font-family: Arial, sans-serif;
    padding: 2rem;

    @media (max-width: 768px) {
        align-items: center;
        padding: 1.5rem;
    }

    @media (max-width: 480px) {
        flex-direction: column;
        padding: 1rem;
    }
`;

export const MainCard = styled.div`
    width: 100%;
    max-width: 600px;
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    gap: 2rem;
    margin: 4.5rem auto;

    @media (max-width: 768px) {
        max-width: 500px;
        padding: 1.5rem;
    }

    @media (max-width: 480px) {
        max-width: 100%;
        padding: 1rem;
        margin: 3rem auto;
    }
`;

export const MainCardButtons = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-top: auto;

    @media (max-width: 768px) {
        gap: 0.8rem;
    }

    @media (max-width: 480px) {
        gap: 0.5rem;
        > * {
            flex-direction: column;
        };
    }
`;

export const SecondaryCard = styled.div`
    flex: 1;
    max-width: 800px;
    padding: 2rem;
    display: flex;
    margin-top: revert;
    justify-content: center;
    align-items: center;

    @media (max-width: 768px) {
        max-width: 100%;
        padding: 1.5rem;
    }

    @media (max-width: 480px) {
        padding: 1rem;
        
    }
`;

export const MainCardInfo = styled.div`
    text-align: left;

    @media (max-width: 768px) {
        text-align: center;
    }

    @media (max-width: 480px) {
        text-align: center;
    }
`;

export const MainCardInfoItem = styled.div`
    font-size: 1rem;
    color: #555;
    margin-bottom: 0.5rem;

    @media (max-width: 768px) {
        font-size: 0.95rem;
    }

    @media (max-width: 480px) {
        font-size: 0.9rem;
    }
`;
