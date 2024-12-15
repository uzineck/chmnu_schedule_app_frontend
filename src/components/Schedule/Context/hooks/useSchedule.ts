import {useContext} from "react";
import {ScheduleContext} from "../ScheduleContext.tsx";

export const useSchedule = () => {
    const context = useContext(ScheduleContext);
    if (!context) {
        throw new Error("useScheduleContext must be used within a ScheduleProvider");
    }
    return context;
};