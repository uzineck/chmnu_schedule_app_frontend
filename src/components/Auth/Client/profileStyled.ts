import styled from "styled-components";

export const ProfilePage = styled.div`
    display: flex;
    justify-content: center;
    align-items: flex-start;
    min-height: 100vh;
    font-family: Arial, sans-serif;
    padding: 2rem;
`;

export const ProfileCard = styled.div`
    width: 100%;
    max-width: 600px;
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    gap: 2rem;
    margin: 4.5rem auto;
`;

export const ProfileInfo = styled.div`
    text-align: left;
`;

export const ProfileInfoItem = styled.div`
    font-size: 1rem;
    color: #555;
    margin-bottom: 0.5rem;
`;

export const ProfileButtons = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-top: auto;
`;

export const ProfileContent = styled.div`
    flex: 1;
    max-width: 800px;
    padding: 2rem;
    display: flex;
    margin-top: revert;
    justify-content: center;
    align-items: center;
`;