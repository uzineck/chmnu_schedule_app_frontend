import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
    *, *::before, *::after {
        box-sizing: border-box;
    }

    html, body {
        overflow-x: hidden;
    }

    #root {
        max-width: 100vw;
    }
`;
