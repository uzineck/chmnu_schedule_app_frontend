import styled from 'styled-components';
import { LessonType } from "../../../models/enums/LessonType.ts";
import { media } from "../../../styles/media.ts";

const typeColor = (type: string, theme: { colors: Record<string, string> }) => {
    if (type === LessonType.LECTURE) return theme.colors.accentBlueViolet;
    if (type === LessonType.PRACTICE) return theme.colors.accentDeepPurple;
    return theme.colors.borderInput;
};

export const MultiLessonContainer = styled.div`
    background-color: ${({theme}) => theme.colors.surfaceAlt};
    border: 1px solid ${({theme}) => theme.colors.border};
    border-radius: 8px;
    padding: 8px;
    box-shadow: 0 1px 3px ${({theme}) => theme.colors.shadow};
    display: flex;
    flex-direction: column;
    gap: 6px;
    text-align: left;
`;

export const MultiLessonHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 6px;
    font-size: 0.75rem;
    font-weight: 600;
    color: ${({theme}) => theme.colors.textSubtle};
    text-transform: uppercase;
    letter-spacing: 0.04em;
`;

export const MultiLessonCount = styled.span`
    color: ${({theme}) => theme.colors.primary};
`;

export const MultiLessonList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
`;

export const MultiLessonRow = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.85rem;
    color: ${({theme}) => theme.colors.textPrimary};
    line-height: 1.3;
    min-width: 0;

    ${media.up('phone')} {
        font-size: 0.95rem;
    }

    ${media.up('tablet')} {
        font-size: 0.82rem;
    }

    ${media.up('desktop')} {
        font-size: 0.88rem;
    }
`;

export const MultiLessonTypeBadge = styled.span<{ type: string }>`
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 18px;
    height: 18px;
    border-radius: 4px;
    background-color: ${({type, theme}) => typeColor(type, theme)};
    color: ${({theme}) => theme.colors.textInverse};
    font-size: 0.7rem;
    font-weight: 700;
    line-height: 1;
    text-transform: uppercase;

    ${media.up('phone')} {
        width: 20px;
        height: 20px;
        font-size: 0.75rem;
    }
`;

export const MultiLessonSubject = styled.span`
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-weight: 600;
`;

export const MultiLessonDetailsButton = styled.button`
    align-self: stretch;
    background-color: transparent;
    border: 1px solid ${({theme}) => theme.colors.border};
    border-radius: 6px;
    padding: 6px 10px;
    font-size: 0.82rem;
    font-weight: 600;
    color: ${({theme}) => theme.colors.primary};
    cursor: pointer;
    transition: background-color 0.15s ease, border-color 0.15s ease;

    &:hover, &:focus-visible {
        background-color: ${({theme}) => theme.colors.surfaceMutedHover};
        border-color: ${({theme}) => theme.colors.primary};
        outline: none;
    }

    ${media.up('phone')} {
        font-size: 0.9rem;
    }
`;

export const MultiLessonModalBody = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding-top: 8px;
    /* Stop scroll-chaining: when the modal content is long enough to scroll
     * internally, reaching the top/bottom must NOT pass scroll up to the
     * (already-locked) page beneath. */
    overscroll-behavior: contain;
`;
