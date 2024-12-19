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
    align-items: center; /* Vertically center Group/Teacher Search and buttons container */
    gap: 16px; /* Space between Group/Teacher Search and the button containers */
    justify-content: center; /* Center all items horizontally */

    > *{
        flex-shrink: 0;
        max-width: 66%;
    }
`;

export const ScheduleButtonContainer = styled.div`
    display: flex;
    flex-direction: column; /* Stack the buttons vertically */
    gap: 8px; /* Space between the two ButtonContainer components */
`;