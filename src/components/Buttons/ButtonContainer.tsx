import React from "react";
import ToggleButton from "./ToggleButton.tsx";
import "./module.css";
import ButtonLink from "./ButtonLink.tsx";

interface ButtonContainerProps {
    options: {
        label: string;
        value: undefined;
        isLink?: boolean;
        to?: string;
    }[];
    selectedValue: undefined;
    onChange: (newValue: undefined) => void;
}

const ButtonContainer: React.FC<ButtonContainerProps> = ({ options, selectedValue, onChange }) => {
    const handleLinkClick = (value: undefined) => {
        onChange(value);
    };

    return (
        <div className="button-container">
            {options.map((option) => (
                option.isLink ? (
                    <ButtonLink
                        key={option.value}
                        label={option.label}
                        value={option.value}
                        selectedValue={selectedValue}
                        to={option.to}
                        onClick={handleLinkClick}  // Pass the handleLinkClick to ButtonLink
                    />
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
