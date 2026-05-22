import styled from 'styled-components';
import {LessonType} from "../../../models/enums/LessonType.ts";
import {media} from "../../../styles/media.ts";

export const LessonDetailsContainer = styled.div`
    background-color: ${({theme}) => theme.colors.surfaceAlt};
    border: 1px solid ${({theme}) => theme.colors.border};
    border-radius: 8px;
    padding: 6px;
    margin-bottom: 5px;
    box-shadow: 0 4px 8px ${({theme}) => theme.colors.shadow};
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    display: flex;
    flex-direction: column;
    gap: 4px;

    &:hover {
        transform: translateY(-1px);
        box-shadow: 0 6px 12px ${({theme}) => theme.colors.shadowStrong};
    }

    ${media.up('phone')} {
        padding: 8px;
        gap: 6px;
    }

    ${media.up('tablet')} {
        padding: 10px;
        gap: 8px;
    }
`;

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

    ${media.up('phone')} {
        font-size: 0.8rem;
        padding: 4px 10px;
    }

    ${media.up('tablet')} {
        font-size: 0.7rem;
        padding: 4px 8px;
    }

    ${media.up('desktop')} {
        font-size: 0.75rem;
    }
`;

export const LessonTitle = styled.div`
    font-size: 0.95rem;
    font-weight: bold;
    color: ${({theme}) => theme.colors.textPrimary};
    text-align: center;
    line-height: 1.25;

    ${media.up('phone')} {
        font-size: 1.05rem;
    }

    ${media.up('tablet')} {
        font-size: 0.88rem;
    }

    ${media.up('desktop')} {
        font-size: 0.95rem;
    }
`;

export const LessonRoom = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    font-size: 0.9rem;
    color: ${({theme}) => theme.colors.textTertiary};

    ${media.up('phone')} {
        gap: 6px;
        font-size: 0.95rem;
    }

    ${media.up('tablet')} {
        gap: 5px;
        font-size: 0.82rem;
    }

    ${media.up('desktop')} {
        gap: 6px;
        font-size: 0.9rem;
    }
`;

export const LessonTeacher = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    font-size: 0.9rem;
    color: ${({theme}) => theme.colors.textTertiary};

    a {
        color: inherit;
        text-decoration: none;
    }

    a:hover {
        color: ${({theme}) => theme.colors.primaryFocusRing};
        text-decoration: none;
    }

    ${media.up('phone')} {
        gap: 6px;
        font-size: 0.95rem;
    }

    ${media.up('tablet')} {
        gap: 5px;
        font-size: 0.82rem;
    }

    ${media.up('desktop')} {
        gap: 6px;
        font-size: 0.9rem;
    }
`;

export const LessonGroups = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: 6px;
    font-size: 0.9rem;
    color: ${({theme}) => theme.colors.textSubtle};

    a {
        color: inherit;
        text-decoration: none;
    }

    a:hover {
        color: ${({theme}) => theme.colors.primaryFocusRing};
        text-decoration: none;
    }

    ${media.up('phone')} {
        gap: 6px;
        font-size: 0.95rem;
    }

    ${media.up('tablet')} {
        gap: 5px;
        font-size: 0.82rem;
    }

    ${media.up('desktop')} {
        gap: 6px;
        font-size: 0.9rem;
    }
`;

export const LessonActions = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 6px;

    ${media.up('phone')} {
        gap: 8px;
    }

    ${media.up('tablet')} {
        gap: 10px;
    }
`;

export const Icon = styled.svg<{ size?: string, color?: string }>`
    font-size: ${(props) => props.size || '0.9rem'};
    margin-right: 0;
    vertical-align: center;
    color: ${({color, theme}) => color || theme.colors.textDim};
    flex-shrink: 0;

    ${media.up('phone')} {
        font-size: ${(props) => props.size || '1rem'};
    }

    ${media.up('tablet')} {
        font-size: ${(props) => props.size || '1.1rem'};
    }
`;

export const IconActionButton = styled.button`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 44px;
    min-height: 44px;
    padding: 0;
    background: transparent;
    border: none;
    border-radius: 8px;
    color: ${({theme}) => theme.colors.textDim};
    cursor: pointer;
    transition: background-color 0.15s ease, color 0.15s ease;
    flex-shrink: 0;

    & > svg {
        width: 1.1rem;
        height: 1.1rem;
    }

    &:hover, &:focus-visible {
        color: ${({theme}) => theme.colors.primary};
        background-color: ${({theme}) => theme.colors.surfaceMutedHover};
        outline: none;
    }

    ${media.up('tablet')} {
        min-width: 32px;
        min-height: 32px;

        & > svg {
            width: 1.15rem;
            height: 1.15rem;
        }
    }
`;
