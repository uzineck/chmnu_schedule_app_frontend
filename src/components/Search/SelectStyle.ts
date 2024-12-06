import {StylesConfig} from "react-select";
import {OptionType} from "./BaseDropDownSearch.tsx";

export const customStyles: StylesConfig<OptionType, false> = {
    control: (provided, state) => ({
        ...provided,
        borderColor: state.isFocused ? '#470840' : '#DDA0DD', // Border color of the selector
        boxShadow: state.isFocused ? '0 0 0 1px #DDA0DD' : 'none',
        borderRadius: '8px',
        padding: '5px',
        fontSize: '16px',
        transition: 'border-color 0.3s ease',
        '&:hover': {
            borderColor: '#FF00FF', // Hover effect of the selector
        },
        '&:focus': {
            borderColor: '#470840', // Focused state for the input field
        },
    }),
    menu: (provided) => ({
        ...provided,
        overflowY: 'auto',
        scrollbarWidth: 'thin',
        scrollbarColor: '#DDA0DD transparent',
        '&::-webkit-scrollbar': {
            width: '8px',
        },
        '&::-webkit-scrollbar-track': {
            background: 'transparent',
        },
        '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#DDA0DD',
            borderRadius: '4px',
        },
    }),

    // @ts-expect-error  stop
    option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isSelected ? '#4B0082' : null,
        color: state.isSelected ? 'white' : 'black', // Text color when option is selected
        cursor: 'pointer',
        padding: '10px',
        fontSize: state.isSelected ? '14px' : '16px', // Smaller text when selected
        fontWeight: state.isSelected ? 'bold' : 'normal', // Bold text when selected
        '&:hover': { // Hover effect for options
            backgroundColor: '#E6E6FA', // Background color
            color: 'black', // Text color
        },
    }),
    loadingMessage: (provided) => ({
        ...provided,
        color: '#800080',
        fontSize: '14px',
        fontStyle: 'italic',
    }),
    noOptionsMessage: (provided) => ({
        ...provided,
        color: '#999',
        fontSize: '14px',
        fontStyle: 'italic',
    }),

    indicatorSeparator: () => ({
        display: 'none', // Optional: Hide the indicator separator line
    }),
};