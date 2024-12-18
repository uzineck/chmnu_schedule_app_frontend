import React from 'react';
import './titleStyled.ts';
import {TitleStyled} from "./titleStyled.ts";

interface TitleProps {
    text: string;
}

const Title: React.FC<TitleProps> = ({ text }) => {
    return (
        <TitleStyled>{text}</TitleStyled>
    );
};

export default Title;
