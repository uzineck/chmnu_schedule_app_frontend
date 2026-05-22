import styled from 'styled-components';
import {Link} from "react-router-dom";
import {media} from "../../styles/media.ts";

export const ScheduleScreen = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    padding: 8px;

    ${media.up('phone')} {
        gap: 16px;
        padding: 12px;
    }

    ${media.up('tablet')} {
        gap: 24px;
        padding: 16px;
    }
`;

export const ScheduleScreenControls = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    flex-wrap: wrap;
    gap: 12px;

    > * {
        flex-shrink: 0;
    }

    ${media.up('desktop')} {
        flex-wrap: nowrap;
        gap: 2rem;
        justify-content: center;
    }
`;

export const ControlPanel = styled.div`
    width: 100%;
    max-width: 600px;
    background-color: ${({theme}) => theme.colors.surface};
    border: 1px solid ${({theme}) => theme.colors.border};
    border-radius: 12px;
    box-shadow: 0 2px 8px ${({theme}) => theme.colors.shadow};
    overflow: hidden;
    display: flex;
    flex-direction: column;

    ${media.up('desktop')} {
        width: clamp(700px, 50vw, 900px);
        max-width: 900px;
    }
`;

export const ControlPanelBody = styled.div`
    padding: 12px;

    ${media.up('tablet')} {
        padding: 16px;
    }

    ${media.up('desktop')} {
        padding: 20px 24px;
    }
`;

export const ControlPanelTabs = styled.div`
    display: flex;
    border-bottom: 1px solid ${({theme}) => theme.colors.border};
    background-color: ${({theme}) => theme.colors.surfaceAlt};
`;

export const ControlPanelTab = styled(Link)<{ $active?: boolean }>`
    flex: 1 1 0;
    text-align: center;
    padding: 14px 8px;
    font-size: 0.95rem;
    font-weight: ${({$active}) => $active ? 600 : 500};
    color: ${({$active, theme}) => $active ? theme.colors.primary : theme.colors.textSecondary};
    text-decoration: none;
    background-color: ${({$active, theme}) => $active ? theme.colors.surface : 'transparent'};
    border-bottom: 3px solid ${({$active, theme}) => $active ? theme.colors.primary : 'transparent'};
    margin-bottom: -1px;
    transition: color 0.15s ease, border-color 0.15s ease, background-color 0.15s ease;

    &:hover, &:focus-visible {
        color: ${({theme}) => theme.colors.primary};
        text-decoration: none;
        background-color: ${({$active, theme}) => $active ? theme.colors.surface : theme.colors.surfaceMutedHover};
        outline: none;
    }
`;

export const ViewPublicLinkButton = styled(Link)`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 12px 16px;
    font-size: 0.95rem;
    font-weight: 500;
    color: ${({theme}) => theme.colors.textSecondary};
    background-color: ${({theme}) => theme.colors.surfaceAlt};
    border-bottom: 1px solid ${({theme}) => theme.colors.border};
    text-decoration: none;
    transition: color 0.15s ease, background-color 0.15s ease;

    &:hover, &:focus-visible {
        color: ${({theme}) => theme.colors.primary};
        background-color: ${({theme}) => theme.colors.surfaceMutedHover};
        text-decoration: none;
        outline: none;
    }
`;

export const FilterTabRowWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    flex-wrap: wrap;
`;

export const FilterTabLabel = styled.span`
    font-size: 0.9rem;
    font-weight: 500;
    color: ${({theme}) => theme.colors.textSecondary};
    flex-shrink: 0;
`;

export const FilterTabGroup = styled.div`
    display: inline-flex;
    border-bottom: 1px solid ${({theme}) => theme.colors.border};
`;

export const FilterTabButton = styled.button<{ $active?: boolean }>`
    padding: 8px 16px;
    min-height: 40px;
    border: none;
    background-color: transparent;
    color: ${({$active, theme}) => $active ? theme.colors.primary : theme.colors.textSecondary};
    font-size: 0.9rem;
    font-weight: ${({$active}) => $active ? 600 : 500};
    cursor: pointer;
    border-bottom: 3px solid ${({$active, theme}) => $active ? theme.colors.primary : 'transparent'};
    margin-bottom: -1px;
    transition: color 0.15s ease, border-color 0.15s ease, background-color 0.15s ease;

    &:hover, &:focus-visible {
        color: ${({theme}) => theme.colors.primary};
        background-color: ${({theme}) => theme.colors.surfaceMutedHover};
        outline: none;
    }
`;

export const FilterTabCurrentMarker = styled.span`
    display: inline-block;
    margin-right: 6px;
    color: ${({theme}) => theme.colors.primary};
    font-size: 0.85em;
    line-height: 1;
`;

export const ScheduleScreenSearchContainer = styled.div`
    flex-basis: 100%;
    max-width: 280px;
    flex-shrink: 0;

    ${media.up('desktop')} {
        flex: 1 1 0;
        max-width: 280px;
    }
`;

export const ScheduleButtonContainer = styled.div`
    flex-basis: 100%;
    max-width: 100%;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    gap: 8px;

    ${media.up('phone')} {
        gap: 12px;
    }

    ${media.up('desktop')} {
        flex: 0 0 auto;
        gap: 8px;
    }
`;

