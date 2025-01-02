import styled from 'styled-components';

export const ScheduleScreen = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center; /* Center the entire content horizontally */
    gap: 24px; /* Space between rows */
    padding: 16px;
`;

export const ScheduleScreenControls = styled.div`
    display: flex;
    align-items: center; /* Align items to the start of the container */
    justify-content: center; /* Distribute space between children */
    width: 40%; /* Ensure it spans the full width */

    > * {
        flex-shrink: 0; /* Prevent items from shrinking */
    }
`;

export const ScheduleScreenSearchContainer = styled.div`
    flex-basis: 40%; /* Take up 33% of the width */
    max-width: 45%; /* Prevent it from growing larger than 33% */
    flex-shrink: 0; /* Prevent it from shrinking */
`;

export const ScheduleButtonContainer = styled.div`
    flex-basis: 33%; /* Take up the remaining 66% */
    max-width: 100%; /* Allow it to grow as needed */
    flex-grow: 1; /* Let it grow to fill available space */
    display: flex;
    flex-direction: column; /* Stack buttons vertically */
    gap: 8px; /* Space between buttons */
`;
