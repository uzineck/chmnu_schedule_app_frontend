import React from "react";
import ToggleButton from "./ToggleButton.tsx";
import ButtonLink from "./ButtonLink.tsx";
import {ButtonContainerWrapper} from "./buttonStyled.ts";

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
    const handleLinkClick = (value: any) => {
        onChange(value);
    };

    return (
        <ButtonContainerWrapper>
            {options.map((option) => (
                option.isLink ? (
                    <ButtonLink
                        key={option.value}
                        label={option.label}
                        value={option.value}
                        selectedValue={selectedValue}
                        to={option.to}
                        onClick={handleLinkClick}
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
        </ButtonContainerWrapper>
    );
};

export default ButtonContainer;
