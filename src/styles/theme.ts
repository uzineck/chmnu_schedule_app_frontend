export const theme = {
    colors: {
        primary: "mediumpurple",
        primaryHover: "darkviolet",
        primaryDisabled: "#b19cd9",
        primaryFocusRing: "#7f00ff",
        primaryFocusShadow: "rgba(127, 0, 255, 0.3)",

        accentDeepPurple: "#800080",
        accentDarkestPurple: "#470840",
        accentIndigo: "#4B0082",
        accentMagenta: "#FF00FF",
        accentPlum: "#DDA0DD",
        accentLavender: "#E6E6FA",
        accentBlueViolet: "#5c6bc0",

        error: "#ff4d4d",
        success: "#2e7d32",
        info: "#1565c0",
        infoBackground: "#e3f2fd",

        textPrimary: "#333",
        textSecondary: "#555",
        textTertiary: "#444",
        textSubtle: "#666",
        textMuted: "#999",
        textDim: "#888",
        textInverse: "#fff",
        textBlack: "black",

        surface: "#fff",
        surfaceAlt: "#f9f9f9",
        surfaceSubtle: "#f0f4f8",
        surfaceMuted: "#f5f5f5",
        surfaceMutedHover: "#e0e0e0",

        border: "#ddd",
        borderInput: "#ccc",

        shadow: "rgba(0, 0, 0, 0.1)",
        shadowStrong: "rgba(0, 0, 0, 0.15)",
        shadowAccent: "rgba(250, 50, 200, 0.3)",
    },
    breakpoints: {
        phoneSmall: 360,
        phone: 390,
        tablet: 768,
        desktop: 1024,
    },
} as const;

export type Theme = typeof theme;
