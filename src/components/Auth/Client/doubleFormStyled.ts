import styled from "styled-components";
import {media} from "../../../styles/media.ts";

export const DoubleFormPage = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    font-family: Arial, sans-serif;
    padding: 1rem;
    gap: 1.5rem;

    ${media.up('tablet')} {
        padding: 2rem;
    }

    ${media.up('desktop')} {
        flex-direction: row;
        align-items: flex-start;
        gap: 2rem;
    }
`;

export const MainCard = styled.div`
    width: 100%;
    max-width: 600px;
    padding: 1rem;
    border-radius: 10px;
    box-shadow: 0 4px 20px ${({theme}) => theme.colors.shadow};
    display: flex;
    flex-direction: column;
    gap: 2rem;
    margin: 1.5rem auto 0;

    ${media.up('tablet')} {
        padding: 1.5rem;
    }

    ${media.up('desktop')} {
        max-width: 480px;
        padding: 2rem;
        margin: 0;
        flex: 0 0 auto;
    }
`;

export const MainCardButtons = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-top: auto;

    > * {
        flex-direction: column;
    }

    ${media.up('tablet')} {
        gap: 0.8rem;
    }

    ${media.up('desktop')} {
        gap: 1rem;

        > * {
            flex-direction: row;
        }
    }
`;

export const SecondaryCard = styled.div`
    width: 100%;
    max-width: 600px;
    padding: 1rem;
    display: flex;
    margin: 0 auto;
    justify-content: center;
    align-items: center;

    ${media.up('tablet')} {
        padding: 1.5rem;
    }

    ${media.up('desktop')} {
        flex: 1 1 auto;
        max-width: 800px;
        padding: 2rem;
        margin: 0;
    }
`;

export const MainCardInfo = styled.div`
    text-align: center;

    ${media.up('tablet')} {
        text-align: left;
    }
`;

export const MainCardInfoItem = styled.div`
    font-size: 0.9rem;
    color: ${({theme}) => theme.colors.textSecondary};
    margin-bottom: 0.5rem;

    ${media.up('phone')} {
        font-size: 0.95rem;
    }

    ${media.up('tablet')} {
        font-size: 1rem;
    }
`;
