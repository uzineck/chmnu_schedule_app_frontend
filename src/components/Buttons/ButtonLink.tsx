import React from "react";
import {StyledLinkButton} from "./buttonStyled.ts";

interface ButtonLinkProps {
    label: string;
    value: any;
    selectedValue: any;
    to?: string;
    onClick: (value: any) => void;
}

const ButtonLink: React.FC<ButtonLinkProps> = ({ label, value, selectedValue, to, onClick }) => {
    const handleClick = () => {
        onClick(value);
    };

    return (
        <StyledLinkButton
            to={to || "#"}
            className={selectedValue === value ? "selected" : ""}
            onClick={handleClick}
        >
            {label}
        </StyledLinkButton>
    );
};

export default ButtonLink;
