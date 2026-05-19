import styled from "styled-components";
import {Link} from "react-router-dom";

export const ButtonContainerWrapper = styled.div`
    display: flex;
    justify-content: center;
    gap: 15px;
    align-items: center;
    text-align: center;
`;

export const StyledToggleButton = styled.button`
    padding: 10px 20px;
    background-color: ${({theme}) => theme.colors.primary};
    color: ${({theme}) => theme.colors.textInverse};
    text-decoration: none;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s ease, transform 0.2s ease;

    &:hover {
        background-color: ${({theme}) => theme.colors.primaryHover};
        transform: scale(1.05);
    }

    &.selected {
        background-color: ${({theme}) => theme.colors.surface};
        color: ${({theme}) => theme.colors.accentDeepPurple};
        border: 2px solid ${({theme}) => theme.colors.accentDeepPurple};
    }
`;

export const StyledLinkButton = styled(Link)`
    padding: 10px 20px;
    background-color: ${({theme}) => theme.colors.primary};
    color: ${({theme}) => theme.colors.textInverse};
    text-decoration: none;
    border-radius: 5px;
    font-size: 16px;
    transition: background-color 0.3s ease, transform 0.2s ease;
    cursor: pointer;

    &:hover {
        background-color: ${({theme}) => theme.colors.primaryHover};
        transform: scale(1.05);
    }

    &.selected {
        background-color: ${({theme}) => theme.colors.surface};
        color: ${({theme}) => theme.colors.accentDeepPurple};
        border: 2px solid ${({theme}) => theme.colors.accentDeepPurple};
    }
`;