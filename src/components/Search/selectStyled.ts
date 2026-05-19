import styled from "styled-components";
import {StylesConfig} from "react-select";
import {OptionType} from "./BaseDropDownSearch.tsx";
import {theme} from "../../styles/theme.ts";

export const BaseDropdown = styled.div`
    width: 100%;
    max-width: 100%;
    margin: 0 auto;
    padding: 10px;
    flex-shrink: 1;
`;


export const customStyles: StylesConfig<OptionType, false> = {
    control: (provided, state) => ({
        ...provided,
        borderColor: state.isFocused ? theme.colors.accentDarkestPurple : theme.colors.accentPlum,
        boxShadow: state.isFocused ? `0 0 0 1px ${theme.colors.accentPlum}` : 'none',
        borderRadius: '8px',
        padding: '5px',
        fontSize: '16px',
        transition: 'border-color 0.3s ease',
        '&:hover': {
            borderColor: theme.colors.accentMagenta,
        },
        '&:focus': {
            borderColor: theme.colors.accentDarkestPurple,
        },
    }),
    menu: (provided) => ({
        ...provided,
        overflowY: 'auto',
        scrollbarWidth: 'thin',
        scrollbarColor: `${theme.colors.accentPlum} transparent`,
        '&::-webkit-scrollbar': {
            width: '8px',
        },
        '&::-webkit-scrollbar-track': {
            background: 'transparent',
        },
        '&::-webkit-scrollbar-thumb': {
            backgroundColor: theme.colors.accentPlum,
            borderRadius: '4px',
        },
    }),

    // @ts-expect-error  stop
    option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isFocused ? theme.colors.accentLavender : state.isSelected ? theme.colors.accentIndigo : null,
        color: state.isFocused ? theme.colors.textBlack : state.isSelected ? theme.colors.textInverse : theme.colors.textBlack,
        cursor: 'pointer',
        padding: '10px',
        fontSize: state.isSelected ? '14px' : '16px',
        fontWeight: state.isSelected ? 'bold' : 'normal',
        '&:hover': {
            backgroundColor: theme.colors.accentLavender,
            color: theme.colors.textBlack,
        },
    }),
    loadingMessage: (provided) => ({
        ...provided,
        color: theme.colors.accentDeepPurple,
        fontSize: '14px',
        fontStyle: 'italic',
    }),
    noOptionsMessage: (provided) => ({
        ...provided,
        color: theme.colors.textMuted,
        fontSize: '14px',
        fontStyle: 'italic',
    }),

    indicatorSeparator: () => ({
        display: 'none',
    }),
};
