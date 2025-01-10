import styled from "styled-components";

export const HeaderContainer = styled.header`
    display: flex;
    flex-wrap: wrap; /* Забезпечує адаптацію для вузьких екранів */
    justify-content: space-between;
    align-items: center;
    background-color: mediumpurple;
    color: white;
    padding: clamp(8px, 2vw, 10px) clamp(10px, 4vw, 20px);
    box-shadow: 0 4px 6px rgba(250, 50, 200, 0.3);
    transition: background-color 0.3s, padding 0.3s;

    @media (max-width: 768px) {
        flex-direction: column;
        align-items: center;
    }

    @media (max-width: 480px) {
        padding: 8px 15px;
    }
`;

export const HeaderButtons = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: clamp(8px, 2vw, 20px);

    @media (max-width: 768px) {
        flex-wrap: wrap;
        gap: 10px;
    }

    @media (max-width: 480px) {
        flex-direction: column;
        gap: 8px;
        width: 100%;
    }

    button {
        padding: 8px;
        font-size: 14px;
        text-align: center;
    }
`;

export const HeaderTitleWrapper = styled.div`
    flex-grow: 1; /* Заголовок займає доступний простір */
    display: flex;
    justify-content: center; /* Центрування заголовка */
    align-items: center;
    text-align: center;
    order: 0; /* Забезпечує, що заголовок буде на своєму місці */

    @media (max-width: 768px) {
        order: 0; /* Переміщення заголовка нижче кнопок на маленьких екранах */
        margin-top: 10px;
    }
`;

export const HeaderTitle = styled.h1`
    font-size: clamp(2rem, 5vw, 3rem);
    color: white;
    margin: 0;
    padding: 0.5rem 0;

    @media (max-width: 768px) {
        font-size: clamp(1.8rem, 4vw, 2.5rem);
    }

    @media (max-width: 480px) {
        font-size: clamp(1.5rem, 3.5vw, 2rem); 
    }
`;
