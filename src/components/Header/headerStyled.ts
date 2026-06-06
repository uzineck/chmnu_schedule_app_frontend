import styled, {keyframes} from "styled-components";
import {Link} from "react-router-dom";
import {media} from "../../styles/media.ts";

export const HeaderContainer = styled.header`
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    background-color: transparent;
    color: ${({theme}) => theme.colors.textPrimary};
    padding-top: calc(8px + env(safe-area-inset-top));
    padding-right: calc(12px + env(safe-area-inset-right));
    padding-bottom: 4px;
    padding-left: calc(12px + env(safe-area-inset-left));
    column-gap: 12px;

    & > *:nth-child(1) {
        justify-self: start;
    }
    & > *:nth-child(2) {
        justify-self: end;
    }

    ${media.up('desktop')} {
        column-gap: clamp(1rem, 3vw, 2.5rem);
        padding-top: calc(clamp(8px, 2vw, 12px) + env(safe-area-inset-top));
        padding-right: calc(clamp(10px, 4vw, 20px) + env(safe-area-inset-right));
        padding-bottom: clamp(4px, 1vw, 6px);
        padding-left: calc(clamp(10px, 4vw, 20px) + env(safe-area-inset-left));
    }
`;

export const HeaderButtons = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 8px;
    width: 100%;

    button {
        padding: 8px;
        font-size: 14px;
        text-align: center;
    }

    ${media.up('phone')} {
        flex-direction: row;
        flex-wrap: wrap;
        width: auto;
        gap: 10px;
    }

    ${media.up('desktop')} {
        flex-wrap: nowrap;
        gap: clamp(8px, 2vw, 20px);
    }
`;

export const HeaderTitleWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    min-width: 0;
`;

export const HeaderTitleLink = styled(Link)`
    color: inherit;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    max-width: 100%;
    border-radius: 6px;
    padding: 2px 6px;
    transition: background-color 0.15s ease;

    &:hover, &:focus-visible {
        background-color: ${({theme}) => theme.colors.surfaceMutedHover};
        outline: none;
        color: inherit;
        text-decoration: none;
    }

    ${media.up('tablet')} {
        gap: 12px;
    }
`;

export const HeaderLogo = styled.div`
    width: 56px;
    height: 56px;
    flex-shrink: 0;
    background-color: ${({theme}) => theme.colors.primary};
    -webkit-mask-image: url('/chmnu_logo.png');
    mask-image: url('/chmnu_logo.png');
    -webkit-mask-size: contain;
    mask-size: contain;
    -webkit-mask-repeat: no-repeat;
    mask-repeat: no-repeat;
    -webkit-mask-position: center;
    mask-position: center;
    transition: background-color 0.15s ease;

    ${media.up('tablet')} {
        width: 72px;
        height: 72px;
    }

    ${media.up('desktop')} {
        width: 80px;
        height: 80px;
    }
`;

export const HeaderTitle = styled.h1`
    font-family: 'Manrope', system-ui, sans-serif;
    font-size: 1.5rem;
    color: ${({theme}) => theme.colors.textPrimary};
    margin: 0;
    padding: 0.5rem 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-weight: 500;
    letter-spacing: 0.02em;
    line-height: 1.1;
    display: inline-flex;
    align-items: baseline;
    gap: 0.35em;

    ${media.up('phone')} {
        font-size: 1.65rem;
    }

    ${media.up('tablet')} {
        font-size: 1.85rem;
    }

    ${media.up('desktop')} {
        font-size: clamp(1.8rem, 4vw, 2.4rem);
    }
`;

export const HeaderTitleAccent = styled.span`
    font-weight: 800;
    letter-spacing: 0.08em;
    background: linear-gradient(
        90deg,
        ${({theme}) => theme.colors.primary} 0%,
        ${({theme}) => theme.colors.accentBlueViolet} 100%
    );
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
`;

export const HamburgerButton = styled.button`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 44px;
    min-height: 44px;
    padding: 0;
    background: transparent;
    border: none;
    border-radius: 8px;
    color: ${({theme}) => theme.colors.textPrimary};
    cursor: pointer;
    transition: background-color 0.15s ease, color 0.15s ease;

    &:hover, &:focus-visible {
        background-color: ${({theme}) => theme.colors.surfaceMutedHover};
        color: ${({theme}) => theme.colors.primary};
        outline: none;
    }

    ${media.up('desktop')} {
        display: none;
    }
`;

export const HeaderRightSlot = styled.div`
    min-width: 44px;
    display: flex;
    justify-content: flex-end;
`;

const fadeIn = keyframes`
    from { opacity: 0; }
    to { opacity: 1; }
`;

const slideInRight = keyframes`
    from { transform: translateX(100%); }
    to { transform: translateX(0); }
`;

export const DrawerOverlay = styled.div`
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.4);
    z-index: 1000;
    animation: ${fadeIn} 0.2s ease;
    display: flex;
    justify-content: flex-end;
`;

export const DrawerPanel = styled.aside`
    width: min(85vw, 360px);
    height: 100%;
    background-color: ${({theme}) => theme.colors.surface};
    color: ${({theme}) => theme.colors.textPrimary};
    box-shadow: -4px 0 16px rgba(0, 0, 0, 0.2);
    padding: calc(16px + env(safe-area-inset-top)) 16px calc(16px + env(safe-area-inset-bottom));
    padding-right: calc(16px + env(safe-area-inset-right));
    display: flex;
    flex-direction: column;
    gap: 16px;
    animation: ${slideInRight} 0.25s ease;
    overflow-y: auto;
`;

export const DrawerTopRow = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
`;

export const DrawerUserPill = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    background-color: ${({theme}) => theme.colors.surfaceSubtle};
    color: ${({theme}) => theme.colors.textPrimary};
    border-radius: 999px;
    font-size: 0.95rem;
    font-weight: 600;
    flex: 1;
    min-width: 0;

    & > span {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
`;

export const DrawerCloseButton = styled.button`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 44px;
    min-height: 44px;
    padding: 0;
    background: transparent;
    border: none;
    border-radius: 8px;
    color: ${({theme}) => theme.colors.textSecondary};
    cursor: pointer;
    transition: background-color 0.15s ease, color 0.15s ease;
    flex-shrink: 0;

    &:hover, &:focus-visible {
        color: ${({theme}) => theme.colors.primary};
        background-color: ${({theme}) => theme.colors.surfaceMutedHover};
        outline: none;
    }
`;

export const DrawerSection = styled.section`
    display: flex;
    flex-direction: column;
    gap: 4px;
`;

export const DrawerSectionTitle = styled.h2`
    font-size: 0.75rem;
    font-weight: 700;
    color: ${({theme}) => theme.colors.textMuted};
    text-transform: uppercase;
    letter-spacing: 0.6px;
    margin: 4px 0 4px 8px;
`;

export const DrawerNavItem = styled.button<{ $active?: boolean }>`
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;
    min-height: 48px;
    padding: 10px 12px;
    background-color: ${({$active, theme}) => $active ? theme.colors.surfaceSubtle : 'transparent'};
    color: ${({$active, theme}) => $active ? theme.colors.primary : theme.colors.textPrimary};
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: ${({$active}) => $active ? 600 : 400};
    text-align: left;
    cursor: pointer;
    transition: background-color 0.15s ease, color 0.15s ease;

    &:hover, &:focus-visible {
        background-color: ${({theme}) => theme.colors.surfaceMutedHover};
        outline: none;
    }

    & > svg {
        width: 1.1rem;
        height: 1.1rem;
        flex-shrink: 0;
    }
`;

export const DrawerDivider = styled.hr`
    border: none;
    border-top: 1px solid ${({theme}) => theme.colors.border};
    margin: 4px 0;
`;
