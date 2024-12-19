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
    background-color: mediumpurple;
    color: white;
    text-decoration: none;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s ease, transform 0.2s ease;

    &:hover {
        background-color: darkviolet;
        transform: scale(1.05);
    }

    &.selected {
        background-color: white;
        color: #800080;
        border: 2px solid #800080;
    }
`;

export const StyledLinkButton = styled(Link)`
    padding: 10px 20px;
    background-color: mediumpurple;
    color: white;
    text-decoration: none;
    border-radius: 5px;
    font-size: 16px;
    transition: background-color 0.3s ease, transform 0.2s ease;
    cursor: pointer;

    &:hover {
        background-color: darkviolet;
        transform: scale(1.05);
    }

    &.selected {
        background-color: white;
        color: #800080;
        border: 2px solid #800080;
    }
`;