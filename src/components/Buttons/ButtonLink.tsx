import React from "react";
import { Link } from "react-router-dom";
import "./module.css";

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
        <Link
            to={to || "#"}
            className={selectedValue === value ? "selected" : ""}
            onClick={handleClick}
        >
            {label}
        </Link>
    );
};

export default ButtonLink;
