import React from 'react';
import Select, {SingleValue} from 'react-select';
import {BaseDropdown, customStyles} from "./selectStyled.ts";

export interface OptionType {
    value: string;
    label: string;
}

interface BaseDropDownSearchProps {
    options: OptionType[];
    onChange: (selectedOption: SingleValue<OptionType>) => void;
    placeholder?: string;
    value?: OptionType | null;
    isLoading?: boolean;
    noOptionsMessage?: string;
}

const BaseDropDownSearch: React.FC<BaseDropDownSearchProps> =
    ({
         options,
         onChange,
         placeholder = 'Виберіть...',
         value,
         isLoading=false,
         noOptionsMessage='Немає даних'
    }) => {
        return (
        <BaseDropdown>
            <Select
                options={options}
                onChange={onChange}
                isSearchable
                placeholder={placeholder}
                value={value}
                isLoading={isLoading}
                noOptionsMessage={() => isLoading ? "Завантаження..." : noOptionsMessage}
                menuPortalTarget={document.body}
                styles={{
                    ...customStyles,
                    menuPortal: base => ({ ...base, zIndex: 9999 })
                }}
            />
        </BaseDropdown>
    );
};

export default BaseDropDownSearch;
