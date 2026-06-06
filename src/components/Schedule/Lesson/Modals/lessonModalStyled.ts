import styled from "styled-components";

export const TimeslotSection = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 12px;
    border-radius: 8px;
    background-color: ${({theme}) => theme.colors.surfaceSubtle};
    border: 1px solid ${({theme}) => theme.colors.border};
`;

export const TimeslotSectionTitle = styled.div`
    font-size: 0.75rem;
    font-weight: 600;
    color: ${({theme}) => theme.colors.textSubtle};
    text-transform: uppercase;
    letter-spacing: 0.05em;
`;

export const TimeslotRow = styled.div`
    display: flex;
    align-items: center;
    gap: 6px;
    flex-wrap: wrap;
`;

export const TimeslotRowLabel = styled.span`
    font-size: 0.8rem;
    color: ${({theme}) => theme.colors.textMuted};
    min-width: 72px;
    flex-shrink: 0;
`;

export const TimeslotChip = styled.button<{ $active: boolean; $current: boolean }>`
    padding: 3px 10px;
    border-radius: 6px;
    font-size: 0.8rem;
    font-weight: 500;
    line-height: 1.5;
    cursor: ${({$current}) => $current ? 'default' : 'pointer'};
    border: 1px solid ${({$active, theme}) =>
        $active ? theme.colors.primary : theme.colors.border};
    background-color: ${({$active, $current, theme}) =>
        $active && $current
            ? theme.colors.primary
            : $active
            ? theme.colors.accentLavender
            : 'transparent'};
    color: ${({$active, $current, theme}) =>
        $active && $current
            ? theme.colors.textInverse
            : $active
            ? theme.colors.primary
            : theme.colors.textMuted};
    transition: background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease;
`;
