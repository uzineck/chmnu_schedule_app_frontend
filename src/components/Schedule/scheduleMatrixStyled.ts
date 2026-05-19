import styled from "styled-components";

// Wrapper for the schedule matrix (with horizontal scrolling on smaller screens)
export const ScheduleMatrixWrapper = styled.div`
    margin: 10px auto;
    width: 95%;
    max-width: 100%;
    overflow-x: auto;  /* Enable horizontal scrolling */
    border-radius: 10px;
    box-shadow: 0 4px 8px ${({theme}) => theme.colors.shadow};
    background-color: ${({theme}) => theme.colors.surfaceAlt};
    font-family: "Arial", sans-serif;

    /* Make sure the wrapper does not overflow */
    @media (max-width: 768px) {
        width: 100%;   /* Allow it to take the full width of smaller screens */
    }
`;

export const MatrixTable = styled.table`
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;

    @media (max-width: 768px) {
        table-layout: auto;  /* Allow the table to be flexible on smaller screens */
    }
`;

export const DayCell = styled.th<{ isCurrentDay?: boolean }>`
    background-color: ${({ isCurrentDay, theme }) => (isCurrentDay ? theme.colors.infoBackground : theme.colors.surfaceSubtle)};
    color: ${({ isCurrentDay, theme }) => (isCurrentDay ? theme.colors.info : theme.colors.textPrimary)};
    padding: 10px;
    text-align: center;
    font-size: 16px;
    font-weight: bold;
    text-transform: uppercase;
    position: sticky;
    top: 0;
    z-index: 1;

    @media (max-width: 768px) {
        font-size: 14px;  /* Smaller font size on mobile */
        padding: 8px;     /* Adjust padding for better readability */
    }
`;

export const TimeCell = styled.th`
    background-color: ${({theme}) => theme.colors.surfaceSubtle};
    color: ${({theme}) => theme.colors.textPrimary};
    text-align: center;
    font-size: 14px;
    font-weight: bold;

    @media (max-width: 768px) {
        font-size: 12px;  /* Reduce font size on mobile */
        padding: 6px;     /* Adjust padding for smaller screens */
    }
`;

export const BodyCell = styled.td<{ hasLesson: boolean; isCurrentLesson?: boolean }>`
    height: 120px;
    text-align: center;
    vertical-align: top;
    padding: 10px;
    border: 1px solid ${({theme}) => theme.colors.border};
    transition: background-color 0.3s ease;
    font-size: 14px;
    background-color: ${({ hasLesson, theme }) => (hasLesson ? theme.colors.surface : theme.colors.surfaceAlt)};
    color: ${({ hasLesson, theme }) => (hasLesson ? theme.colors.textPrimary : theme.colors.textMuted)};
    position: relative;

    ${({ isCurrentLesson, theme }) =>
            isCurrentLesson &&
            `
        background-color: ${theme.colors.surface};
        color: ${theme.colors.success};
    `};

    @media (max-width: 768px) {
    font-size: 12px;  /* Smaller font size for mobile */
    padding: 8px;     /* Reduced padding */
}
`;

export const CurrentLessonIndicator = styled.div`
    position: absolute;
    top: 2px;
    right: 2px;
    width: 10px;
    height: 10px;
    background-color: ${({theme}) => theme.colors.success};
    border-radius: 50%;
    pointer-events: none;
`;

export const AddLessonIcon = styled.div`
    font-size: 1.1rem;
    margin-right: 0;
    vertical-align: middle;
    color: ${({theme}) => theme.colors.textDim};
    cursor: pointer;

    &:hover {
        color: ${({theme}) => theme.colors.primaryFocusRing};
    }

    @media (max-width: 768px) {
        font-size: 1rem;  /* Slightly smaller icon size on mobile */
    }
`;
