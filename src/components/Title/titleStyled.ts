import styled from "styled-components";
import {media} from "../../styles/media.ts";

export const TitleStyled = styled.h1`
    font-size: 1.2rem;
    font-weight: bold;
    color: ${({theme}) => theme.colors.accentDeepPurple};
    text-align: center;
    text-transform: uppercase;
    letter-spacing: 2px;
    margin: 10px 0;
    padding: 6px;
    border-radius: 10px;
    box-shadow: 0px 4px 6px ${({theme}) => theme.colors.shadow};

    ${media.up('phone')} {
        font-size: 1.5rem;
        margin: 15px 0;
        padding: 8px;
    }

    ${media.up('tablet')} {
        font-size: 2rem;
        margin: 20px 0;
        padding: 10px;
    }
`;
