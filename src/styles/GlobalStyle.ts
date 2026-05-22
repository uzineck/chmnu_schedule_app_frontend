import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
    *, *::before, *::after {
        box-sizing: border-box;
    }

    html, body {
        overflow-x: hidden;
    }

    body {
        min-width: 360px;
    }

    #root {
        max-width: 100vw;
    }
`;
