import React from "react";
import {StyledToggleButton} from "./buttonStyled.ts";

interface ToggleButtonProps {
    label: string;
    isSelected: boolean;
    onClick: () => void;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({ label, isSelected, onClick }) => {
    return (
        <StyledToggleButton
            className={isSelected ? "selected" : ""}
            onClick={onClick}
        >
            {label}
        </StyledToggleButton>
    );
};

export default ToggleButton;
