import styled from 'styled-components';
import {LessonType} from "../../../models/enums/LessonType.ts";

// Main lesson container
export const LessonDetailsContainer = styled.div`
    background-color: ${({theme}) => theme.colors.surfaceAlt};
    border: 1px solid ${({theme}) => theme.colors.border};
    border-radius: 8px;
    padding: 10px;
    margin-bottom: 5px;
    box-shadow: 0 4px 8px ${({theme}) => theme.colors.shadow};
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    display: flex;
    flex-direction: column;
    gap: 8px;

    &:hover {
        transform: translateY(-1px);
        box-shadow: 0 6px 12px ${({theme}) => theme.colors.shadowStrong};
    }

    @media (max-width: 768px) {
        padding: 8px;
        gap: 6px;
    }

    @media (max-width: 480px) {
        padding: 6px;
        gap: 4px;
    }
`;

// Lesson type container (Lecture, Practice)
export const LessonTypeContainer = styled.div<{ type: string }>`
    font-size: 0.75rem;
    padding: 4px 8px;
    color: ${({theme}) => theme.colors.textInverse};
    border-radius: 12px;
    text-transform: uppercase;
    font-weight: bold;
    text-align: center;
    background-color: ${({type, theme}) => {
        if (type === LessonType.LECTURE) return theme.colors.accentBlueViolet;
        if (type === LessonType.PRACTICE) return theme.colors.accentDeepPurple;
        return theme.colors.borderInput;
    }};

    @media (max-width: 768px) {
        font-size: 0.7rem;
        padding: 4px 6px;
    }

    @media (max-width: 480px) {
        font-size: 0.65rem;
        padding: 3px 5px;
    }
`;

// Lesson title
export const LessonTitle = styled.div`
    font-size: 0.91rem;
    font-weight: bold;
    color: ${({theme}) => theme.colors.textPrimary};
    text-align: center;

    @media (max-width: 768px) {
        font-size: 0.85rem;
    }

    @media (max-width: 480px) {
        font-size: 0.8rem;
    }
`;

// Room information
export const LessonRoom = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    font-size: 0.95rem;
    color: ${({theme}) => theme.colors.textTertiary};

    @media (max-width: 768px) {
        font-size: 0.9rem;
        gap: 5px;
    }

    @media (max-width: 480px) {
        font-size: 0.85rem;
        gap: 4px;
    }
`;

// Teacher information
export const LessonTeacher = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    font-size: 0.95rem;
    color: ${({theme}) => theme.colors.textTertiary};

    a {
        color: inherit;
        text-decoration: none;
    }

    a:hover {
        color: ${({theme}) => theme.colors.primaryFocusRing};
        text-decoration: none;
    }

    @media (max-width: 768px) {
        font-size: 0.9rem;
        gap: 5px;
    }

    @media (max-width: 480px) {
        font-size: 0.85rem;
        gap: 4px;
    }
`;

// Groups information
export const LessonGroups = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: 6px;
    font-size: 0.95rem;
    color: ${({theme}) => theme.colors.textSubtle};

    a {
        color: inherit;
        text-decoration: none;
    }

    a:hover {
        color: ${({theme}) => theme.colors.primaryFocusRing};
        text-decoration: none;
    }

    @media (max-width: 768px) {
        font-size: 0.9rem;
        gap: 5px;
    }

    @media (max-width: 480px) {
        font-size: 0.85rem;
        gap: 4px;
    }
`;

// Actions (Edit/Delete buttons)
export const LessonActions = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 10px;

    @media (max-width: 768px) {
        gap: 8px;
    }

    @media (max-width: 480px) {
        gap: 6px;
    }
`;

export const Icon = styled.svg<{ size?: string, color?: string }>`
    cursor: pointer;
    font-size: ${(props) => props.size || '1.1rem'};
    margin-right: 0;
    vertical-align: center;
    color: ${({color, theme}) => color || theme.colors.textDim};
    flex-shrink: 0;

    &:hover {
        color: ${({theme}) => theme.colors.primaryFocusRing};
    }

    @media (max-width: 768px) {
        font-size: ${(props) => props.size || '1rem'};
    }

    @media (max-width: 480px) {
        font-size: ${(props) => props.size || '0.9rem'};
    }
`;
