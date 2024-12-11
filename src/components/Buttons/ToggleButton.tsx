import React from "react";

interface ToggleButtonProps {
    label: string;
    isSelected: boolean;
    onClick: () => void;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({ label, isSelected, onClick }) => {
    return (
        <button
            className={isSelected ? "selected" : ""}
            onClick={onClick}
        >
            {label}
        </button>
    );
};

export default ToggleButton;
