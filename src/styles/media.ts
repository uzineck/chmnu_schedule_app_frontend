import { theme } from "./theme";

type Breakpoint = keyof typeof theme.breakpoints;

export const media = {
    up: (bp: Breakpoint) => `@media (min-width: ${theme.breakpoints[bp]}px)`,
    down: (bp: Breakpoint) => `@media (max-width: ${theme.breakpoints[bp] - 1}px)`,
    between: (min: Breakpoint, max: Breakpoint) =>
        `@media (min-width: ${theme.breakpoints[min]}px) and (max-width: ${theme.breakpoints[max] - 1}px)`,
};
