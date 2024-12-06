import React from 'react';
import Select, {SingleValue} from 'react-select';
import './style.css'
import {customStyles} from "./SelectStyle.ts";

export interface OptionType {
    value: string;
    label: string;
}

interface BaseDropDownSearchProps {
    options: OptionType[];
    onChange: (selectedOption: SingleValue<OptionType>) => void;
    placeholder?: string;
    value?: OptionType;
    isLoading?: boolean;
    noOptionsMessage?: string;
}

const BaseDropDownSearch: React.FC<BaseDropDownSearchProps> =
    ({
         options,
         onChange,
         placeholder = 'Select...',
         value,
         isLoading=false,
         noOptionsMessage='No options'
    }) => {

        return (
            <div className="base-dropdown">
            <Select
                options={options}
                onChange={onChange}
                isSearchable
                placeholder={placeholder}
                value={value}
                isLoading={isLoading}
                noOptionsMessage={() => isLoading ? "Loading..." : noOptionsMessage}
                styles={customStyles}
            />
        </div>
    );
};

export default BaseDropDownSearch;
