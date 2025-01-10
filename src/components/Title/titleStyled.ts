import styled from "styled-components";

export const TitleStyled = styled.h1`
    font-size: 2rem; /* Size of the title */
    font-weight: bold;
    color: #800080;  /* Purple color */
    text-align: center;
    text-transform: uppercase;  /* Makes the title uppercase */
    letter-spacing: 2px;  /* Spacing between letters */
    margin: 20px 0;  /* Adds space around the title */
    padding: 10px;
    border-radius: 10px;  /* Rounded corners */
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);  /* Subtle shadow for depth */

    /* Adaptive styles for mobile devices */
    @media (max-width: 768px) {
        font-size: 1.5rem; /* Slightly smaller title font on tablets */
        margin: 15px 0; /* Reduce space around the title */
        padding: 8px; /* Adjust padding for smaller screens */
    }

    @media (max-width: 480px) {
        font-size: 1.2rem; /* Further reduce font size on mobile */
        margin: 10px 0; /* Further reduce margin on smaller screens */
        padding: 6px; /* Smaller padding for very small screens */
    }
`;
