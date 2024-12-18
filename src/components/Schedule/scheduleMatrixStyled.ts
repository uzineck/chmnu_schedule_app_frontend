import styled from "styled-components";

export const ScheduleMatrixWrapper = styled.div`
    margin: 10px auto;
    width: 95%;
    max-width: 100%;
    overflow-x: auto;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    background-color: #f9f9f9;
    font-family: "Arial", sans-serif;
`;

export const MatrixTable = styled.table`
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;
`;

export const DayCell = styled.th<{ isCurrentDay?: boolean }>`
    background-color: ${({ isCurrentDay }) => (isCurrentDay ? "#e3f2fd" : "#f0f4f8")};
    color: ${({ isCurrentDay }) => (isCurrentDay ? "#1565c0" : "#333")};
    padding: 10px;
    text-align: center;
    font-size: 16px;
    font-weight: bold;
    text-transform: uppercase;
    position: sticky;
    top: 0;
    z-index: 1;
`;

export const TimeCell = styled.th`
    background-color: #f0f4f8;
    color: #333;
    text-align: center;
    font-size: 14px;
    font-weight: bold;
`;

export const BodyCell = styled.td<{ hasLesson: boolean; isCurrentLesson?: boolean }>`
    height: 120px;
    text-align: center;
    vertical-align: top;
    padding: 10px;
    border: 1px solid #ddd;
    transition: background-color 0.3s ease;
    font-size: 14px;
    background-color: ${({ hasLesson }) => (hasLesson ? "#fff" : "#f9f9f9")};
    color: ${({ hasLesson }) => (hasLesson ? "#333" : "#999")};
    position: relative;

    ${({ isCurrentLesson }) =>
    isCurrentLesson &&
    `
        background-color: #fff;
        color: #2e7d32;
    `}
`;

export const CurrentLessonIndicator = styled.div`
    position: absolute;
    top: 5px;
    right: 5px;
    width: 10px;
    height: 10px;
    background-color: #2e7d32;
    border-radius: 50%;
    pointer-events: none;
`;

export const AddLessonIcon = styled.div`
    font-size: 1.1rem;
    margin-right: 0;
    vertical-align: middle;
    color: #888;
    cursor: pointer;

    &:hover {
        color: #7f00ff;
    }
`;

export const MobileResponsiveStyles = styled.div`
    @media (max-width: 768px) {
        font-size: 12px;

        ${TimeCell} {
            padding: 8px;
        }

        ${BodyCell} {
            height: 100px;
        }
    }

    @media (max-width: 1024px) {
        font-size: 14px;
    }
`;