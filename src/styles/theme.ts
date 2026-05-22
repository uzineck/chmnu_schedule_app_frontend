export const theme = {
    colors: {
        // User palette: #0E4C92 #6290c5 #c0b9c0 #fffaff #ffffff
        primary: "#0E4C92",
        primaryHover: "#093571",
        primaryDisabled: "#9bb5d4",
        primaryFocusRing: "#0E4C92",
        primaryFocusShadow: "rgba(14, 76, 146, 0.3)",

        // Accents derived from the palette + colour-theory complements.
        // Token names kept from the previous purple theme for callsite stability;
        // values are now blue/mauve-aligned. See [[reference-previous-purple-theme]].
        accentDeepPurple: "#0E4C92",        // deep brand blue (was #800080)
        accentDarkestPurple: "#062048",     // deeper navy (was #470840)
        accentIndigo: "#1d3a6e",            // muted indigo-blue (was #4B0082)
        accentMagenta: "#6290c5",           // medium blue (was #FF00FF)
        accentPlum: "#c0b9c0",              // mauve (was #DDA0DD)
        accentLavender: "#e3ecf6",          // pale blue-tinted lavender (was #E6E6FA)
        accentBlueViolet: "#6290c5",        // alias for medium blue (was #5c6bc0)

        error: "#c53d3d",
        success: "#2d7d4d",
        info: "#0E4C92",
        infoBackground: "#c8d8ed",

        textPrimary: "#1a2238",
        textSecondary: "#3a4258",
        textTertiary: "#2a3248",
        textSubtle: "#5a6278",
        textMuted: "#9098a8",
        textDim: "#8088a0",
        textInverse: "#ffffff",
        textBlack: "#000000",

        surface: "#ffffff",
        surfaceAlt: "#fffaff",
        surfaceSubtle: "#f4f7fb",
        surfaceMuted: "#eef1f6",
        surfaceMutedHover: "#dde3ec",

        border: "#d4d8e0",
        borderInput: "#bfc4cc",

        shadow: "rgba(14, 76, 146, 0.10)",
        shadowStrong: "rgba(14, 76, 146, 0.18)",
        shadowAccent: "rgba(98, 144, 197, 0.30)",
    },
    breakpoints: {
        phoneSmall: 360,
        phone: 390,
        tablet: 768,
        desktop: 1200,
    },
} as const;

export type Theme = typeof theme;
