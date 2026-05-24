import React from "react";
import styled from "styled-components";

interface CheckboxOption<T extends string = string> {
    value: T;
    label: string;
}

interface FormCheckboxGroupProps<T extends string = string> {
    name: string;
    value: T[];
    options: CheckboxOption<T>[];
    onChange: (next: T[]) => void;
    onBlur?: () => void;
    $hasError?: boolean;
    disabled?: boolean;
}

const Group = styled.div<{ $hasError?: boolean }>`
    display: flex;
    flex-direction: column;
    border: 1px solid ${({ $hasError, theme }) => ($hasError ? theme.colors.error : theme.colors.border)};
    border-radius: 8px;
    overflow: hidden;
    background-color: ${({ theme }) => theme.colors.surface};
`;

const Row = styled.label<{ $checked?: boolean }>`
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    cursor: pointer;
    font-size: 0.92rem;
    color: ${({ theme }) => theme.colors.textPrimary};
    background-color: ${({ $checked, theme }) => ($checked ? theme.colors.surfaceMuted : 'transparent')};
    transition: background-color 0.12s ease;
    user-select: none;
    min-height: 42px;

    & + & {
        border-top: 1px solid ${({ theme }) => theme.colors.border};
    }

    &:hover { background-color: ${({ theme }) => theme.colors.surfaceMutedHover}; }

    &:focus-within {
        outline: 2px solid ${({ theme }) => theme.colors.primary};
        outline-offset: -2px;
    }

    input[type='checkbox'] {
        width: 18px;
        height: 18px;
        cursor: pointer;
        accent-color: ${({ theme }) => theme.colors.primary};
        flex-shrink: 0;
    }
`;

function FormCheckboxGroup<T extends string = string>({
    name,
    value,
    options,
    onChange,
    onBlur,
    $hasError,
    disabled,
}: FormCheckboxGroupProps<T>) {
    const valueSet = React.useMemo(() => new Set(value), [value]);

    const toggle = (option: T) => {
        if (disabled) return;
        const next = valueSet.has(option)
            ? value.filter((v) => v !== option)
            : [...value, option];
        onChange(next);
    };

    return (
        <Group $hasError={$hasError} role="group" onBlur={onBlur}>
            {options.map(({ value: optionValue, label }) => {
                const checked = valueSet.has(optionValue);
                return (
                    <Row key={optionValue} $checked={checked}>
                        <input
                            type="checkbox"
                            name={name}
                            value={optionValue}
                            checked={checked}
                            onChange={() => toggle(optionValue)}
                            disabled={disabled}
                        />
                        {label}
                    </Row>
                );
            })}
        </Group>
    );
}

export default FormCheckboxGroup;
