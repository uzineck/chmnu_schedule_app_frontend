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

    /* Prevent scroll from chaining out of an open antd modal into the page
       beneath (iOS Safari especially — body overflow:hidden alone doesn't
       stop touch scroll propagation). */
    .ant-modal-wrap {
        overscroll-behavior: contain;
    }
`;
