import styled from 'styled-components';

export const ScheduleScreen = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center; /* Center the entire content horizontally */
    gap: 24px; /* Space between rows */
    padding: 16px;

    @media (max-width: 768px) {
        gap: 16px; /* Reduce space between rows for smaller screens */
        padding: 12px; /* Adjust padding for smaller screens */
    }

    @media (max-width: 480px) {
        gap: 12px; /* Even less gap on very small screens */
        padding: 8px; /* Compact padding for phones */
    }
`;

export const ScheduleScreenControls = styled.div`
    display: flex;
    align-items: center; /* Align items to the start of the container */
    justify-content: center; /* Distribute space between children */
    width: 40%; /* Default width */

    > * {
        flex-shrink: 0; /* Prevent items from shrinking */
    }

    @media (max-width: 768px) {
        width: 60%; /* Expand width for smaller screens */
        justify-content: space-around; /* Adjust spacing for controls */
    }

    @media (max-width: 480px) {
        width: 100%; /* Full width for phones */
        flex-wrap: wrap; /* Wrap controls for better stacking */
        gap: 8px; /* Add spacing between items */
    }
`;

export const ScheduleScreenSearchContainer = styled.div`
    flex-basis: 40%; /* Default width */
    max-width: 45%; /* Prevent it from growing too large */
    flex-shrink: 0; /* Prevent it from shrinking */

    @media (max-width: 768px) {
        flex-basis: 60%; /* Adjust width for tablets */
        max-width: 100%; /* Allow it to grow full width */
    }

    @media (max-width: 480px) {
        flex-basis: 100%; /* Full width on phones */
        max-width: 100%; /* Ensure it spans the full container */
    }
`;

export const ScheduleButtonContainer = styled.div`
    flex-basis: 33%; /* Default width */
    max-width: 100%; /* Allow it to grow as needed */
    flex-grow: 1; /* Let it grow to fill available space */
    display: flex;
    flex-direction: column; /* Stack buttons vertically */
    gap: 8px; /* Space between buttons */

    @media (max-width: 768px) {
        flex-basis: 100%; /* Full width on smaller screens */
        flex-direction: column; /* Stack buttons horizontally */
        flex-wrap: wrap; /* Allow wrapping for better fit */
        gap: 12px; /* Increase gap between buttons */
    }

    @media (max-width: 480px) {
        flex-direction: column; /* Back to vertical stacking on phones */
        gap: 8px; /* Compact spacing */
    }
`;
