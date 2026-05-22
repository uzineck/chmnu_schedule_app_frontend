import styled from "styled-components";
import {media} from "../../styles/media.ts";

export const ScheduleMatrixWrapper = styled.div`
    margin: 10px auto;
    width: 100%;
    max-width: 100%;
    background-color: transparent;
    font-family: "Arial", sans-serif;

    ${media.up('tablet')} {
        width: 100%;
    }
`;

export const MatrixTable = styled.table`
    width: 100%;
    border-collapse: separate;
    border-spacing: 6px 4px;
    table-layout: fixed;

    ${media.up('tablet')} {
        border-spacing: 8px 6px;
    }
`;

export const DayCell = styled.th<{ isCurrentDay?: boolean }>`
    background-color: ${({ isCurrentDay, theme }) => (isCurrentDay ? theme.colors.infoBackground : theme.colors.surfaceSubtle)};
    color: ${({ isCurrentDay, theme }) => (isCurrentDay ? theme.colors.info : theme.colors.textPrimary)};
    padding: 10px 6px;
    text-align: center;
    font-size: 14px;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 0.3px;
    border-radius: 10px;
    position: sticky;
    top: 0;
    z-index: 2;

    ${media.up('tablet')} {
        padding: 12px 10px;
        font-size: 16px;
    }
`;

export const TimeCell = styled.th`
    background-color: ${({theme}) => theme.colors.surfaceSubtle};
    color: ${({theme}) => theme.colors.textPrimary};
    text-align: center;
    vertical-align: middle;
    font-weight: bold;
    padding: 8px 4px;
    width: 72px;
    min-width: 60px;
    border-radius: 10px;

    thead & {
        position: sticky;
        top: 0;
        z-index: 2;
    }

    ${media.up('tablet')} {
        padding: 10px 6px;
        width: 84px;
    }

    ${media.up('desktop')} {
        width: 96px;
    }
`;

export const OrdNumber = styled.div`
    font-size: 1.4rem;
    font-weight: 700;
    line-height: 1;
    color: ${({theme}) => theme.colors.primary};

    ${media.up('tablet')} {
        font-size: 1.6rem;
    }
`;

export const TimeRange = styled.div`
    margin-top: 4px;
    font-size: 0.7rem;
    font-weight: normal;
    color: ${({theme}) => theme.colors.textMuted};
    line-height: 1.2;
    display: flex;
    flex-direction: column;
    align-items: center;

    ${media.up('tablet')} {
        font-size: 0.75rem;
    }
`;

export const BodyCell = styled.td<{ hasLesson: boolean; isCurrentLesson?: boolean; isCurrentDay?: boolean }>`
    height: 120px;
    text-align: center;
    vertical-align: top;
    padding: 8px;
    border: 1px solid transparent;
    border-radius: 10px;
    transition: background-color 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
    font-size: 12px;
    background-color: ${({ hasLesson, isCurrentDay, theme }) =>
        hasLesson
            ? theme.colors.surface
            : isCurrentDay
                ? theme.colors.infoBackground
                : theme.colors.surfaceMuted};
    color: ${({ hasLesson, theme }) => (hasLesson ? theme.colors.textPrimary : theme.colors.textMuted)};
    box-shadow: ${({ hasLesson, theme }) => (hasLesson ? `0 1px 3px ${theme.colors.shadow}` : 'none')};
    position: relative;

    ${({ isCurrentDay, hasLesson, theme }) =>
        isCurrentDay && hasLesson &&
        `
        background-color: ${theme.colors.infoBackground};
    `};

    ${({ isCurrentLesson, theme }) =>
        isCurrentLesson &&
        `
        background-color: ${theme.colors.surface};
        color: ${theme.colors.success};
        border-color: ${theme.colors.success};
        box-shadow: 0 0 0 2px ${theme.colors.success}33, 0 2px 6px ${theme.colors.shadow};
    `};

    ${media.up('tablet')} {
        padding: 10px;
        font-size: 14px;
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

export const AddLessonIcon = styled.button`
    position: absolute;
    inset: 0;
    margin: auto;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    border: 1px dashed ${({theme}) => theme.colors.borderInput};
    background: transparent;
    color: ${({theme}) => theme.colors.textDim};
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.15s ease, border-color 0.15s ease, background-color 0.15s ease;

    &:hover, &:focus-visible {
        color: ${({theme}) => theme.colors.primary};
        border-color: ${({theme}) => theme.colors.primary};
        background-color: ${({theme}) => theme.colors.surface};
        outline: none;
    }
`;

export const AddMoreLessonIcon = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 6px auto 0;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    border: 1px dashed ${({theme}) => theme.colors.borderInput};
    background-color: transparent;
    color: ${({theme}) => theme.colors.textDim};
    cursor: pointer;
    opacity: 0.7;
    transition: opacity 0.15s ease, color 0.15s ease, border-color 0.15s ease, background-color 0.15s ease;

    &:hover, &:focus-visible {
        opacity: 1;
        color: ${({theme}) => theme.colors.primary};
        border-color: ${({theme}) => theme.colors.primary};
        background-color: ${({theme}) => theme.colors.surface};
        outline: none;
    }
`;

export const AddMoreLessonButton = styled.button`
    width: 100%;
    padding: 8px 12px;
    border-radius: 8px;
    border: 1px dashed ${({theme}) => theme.colors.borderInput};
    background-color: transparent;
    color: ${({theme}) => theme.colors.textDim};
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    font-size: 0.9rem;
    font-weight: 500;
    transition: color 0.15s ease, border-color 0.15s ease, background-color 0.15s ease;

    &:hover, &:focus-visible {
        color: ${({theme}) => theme.colors.primary};
        border-color: ${({theme}) => theme.colors.primary};
        background-color: ${({theme}) => theme.colors.surface};
        outline: none;
    }
`;

export const PagerTabsRow = styled.div`
    display: flex;
    gap: 8px;
    width: 100%;
    max-width: 600px;
    margin: 0 auto 4px;
`;

export const PagerTab = styled.button<{ active: boolean }>`
    flex: 1 1 0;
    min-height: 40px;
    padding: 8px 12px;
    border: 1px solid ${({theme, active}) => active ? theme.colors.primary : theme.colors.border};
    background-color: ${({active, theme}) => active ? theme.colors.primary : theme.colors.surface};
    color: ${({active, theme}) => active ? theme.colors.textInverse : theme.colors.textPrimary};
    border-radius: 8px;
    font-size: 0.95rem;
    font-weight: ${({active}) => active ? 'bold' : 'normal'};
    cursor: pointer;
    transition: background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease;

    &:focus-visible {
        outline: 2px solid ${({theme}) => theme.colors.primaryFocusRing};
        outline-offset: 2px;
    }
`;

export const PhoneScheduleContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin: 10px auto;
`;

export const DayTabsRow = styled.div`
    display: flex;
    gap: 6px;
    width: 100%;
`;

export const DayTab = styled.button<{ active: boolean; isToday: boolean }>`
    flex: 1 1 0;
    min-width: 0;
    min-height: 44px;
    padding: 8px 4px;
    border: 1px solid ${({theme, active}) => active ? theme.colors.primary : theme.colors.border};
    background-color: ${({active, theme}) => active ? theme.colors.primary : theme.colors.surface};
    color: ${({active, theme}) => active ? theme.colors.textInverse : theme.colors.textPrimary};
    border-radius: 8px;
    font-size: 0.95rem;
    font-weight: ${({active}) => active ? 'bold' : 'normal'};
    cursor: pointer;
    position: relative;
    transition: background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease;

    &::after {
        content: '';
        position: absolute;
        bottom: 4px;
        left: 50%;
        transform: translateX(-50%);
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background-color: ${({isToday, theme, active}) =>
            isToday ? (active ? theme.colors.textInverse : theme.colors.primary) : 'transparent'};
    }

    &:focus-visible {
        outline: 2px solid ${({theme}) => theme.colors.primaryFocusRing};
        outline-offset: 2px;
    }
`;

export const TimeslotList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
`;

export const TimeslotCard = styled.div<{ isCurrentLesson?: boolean }>`
    background-color: ${({theme}) => theme.colors.surface};
    border: 1px solid ${({theme, isCurrentLesson}) =>
        isCurrentLesson ? theme.colors.success : theme.colors.border};
    border-radius: 10px;
    padding: 10px;
    box-shadow: 0 2px 4px ${({theme}) => theme.colors.shadow};
    display: flex;
    flex-direction: column;
    gap: 8px;
    position: relative;
`;

export const TimeslotTimeRow = styled.div`
    display: flex;
    align-items: baseline;
    gap: 10px;
    padding-bottom: 6px;
    border-bottom: 1px solid ${({theme}) => theme.colors.border};
`;

export const TimeslotOrd = styled.span`
    font-size: 1.4rem;
    font-weight: 700;
    color: ${({theme}) => theme.colors.primary};
    line-height: 1;

    ${media.up('phone')} {
        font-size: 1.5rem;
    }
`;

export const TimeslotTimeText = styled.span`
    font-size: 0.95rem;
    color: ${({theme}) => theme.colors.textSubtle};
    font-weight: 500;

    ${media.up('phone')} {
        font-size: 1rem;
    }
`;

export const EmptySlotText = styled.div`
    color: ${({theme}) => theme.colors.textMuted};
    font-size: 0.95rem;
    font-style: italic;
    text-align: center;
    padding: 10px 0;

    ${media.up('phone')} {
        font-size: 1rem;
    }
`;

export const AddLessonButton = styled.button`
    background: none;
    border: 1px dashed ${({theme}) => theme.colors.borderInput};
    border-radius: 6px;
    color: ${({theme}) => theme.colors.textDim};
    padding: 10px;
    min-height: 44px;
    width: 100%;
    cursor: pointer;
    font-size: 0.9rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    transition: color 0.15s ease, border-color 0.15s ease;

    &:hover, &:focus-visible {
        color: ${({theme}) => theme.colors.primary};
        border-color: ${({theme}) => theme.colors.primary};
        outline: none;
    }
`;
