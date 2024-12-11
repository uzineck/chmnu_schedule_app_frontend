import React from "react";
import { Link } from "react-router-dom";
import ToggleButton from "./ToggleButton.tsx";
import "./module.css";

interface ButtonContainerProps {
    options: {
        label: string;
        value: any;
        isLink?: boolean;
        to?: string;
    }[];
    selectedValue: any;
    onChange: (newValue: any) => void;
}

const ButtonContainer: React.FC<ButtonContainerProps> = ({ options, selectedValue, onChange }) => {
    return (
        <div className="button-container">
            {options.map((option) => (
                option.isLink ? (
                    <Link
                        key={option.value}
                        to={option.to || "#"}
                        className={selectedValue === option.value ? "selected" : ""}
                    >
                        {option.label}
                    </Link>
                ) : (
                    <ToggleButton
                        key={option.value}
                        label={option.label}
                        isSelected={selectedValue === option.value}
                        onClick={() => onChange(option.value)}
                    />
                )
            ))}
        </div>
    );
};

export default ButtonContainer;
