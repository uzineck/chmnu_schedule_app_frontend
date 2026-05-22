import {
    FilterTabButton,
    FilterTabCurrentMarker,
    FilterTabGroup,
    FilterTabLabel,
    FilterTabRowWrapper,
} from "./scheduleScreenStyled.ts";

interface FilterTabRowProps<T> {
    label: string;
    options: { label: string; value: T }[];
    selectedValue: T | null;
    currentValue?: T | null;
    onChange: (value: T) => void;
}

function FilterTabRow<T>({label, options, selectedValue, currentValue, onChange}: FilterTabRowProps<T>) {
    return (
        <FilterTabRowWrapper>
            <FilterTabLabel>{label}:</FilterTabLabel>
            <FilterTabGroup role="tablist">
                {options.map((opt) => {
                    const isCurrent =
                        currentValue !== undefined && currentValue !== null && currentValue === opt.value;
                    return (
                        <FilterTabButton
                            key={String(opt.value)}
                            type="button"
                            role="tab"
                            aria-selected={selectedValue === opt.value}
                            $active={selectedValue === opt.value}
                            onClick={() => onChange(opt.value)}
                        >
                            {isCurrent && (
                                <FilterTabCurrentMarker aria-label="поточний">
                                    •
                                </FilterTabCurrentMarker>
                            )}
                            {opt.label}
                        </FilterTabButton>
                    );
                })}
            </FilterTabGroup>
        </FilterTabRowWrapper>
    );
}

export default FilterTabRow;
