import {createContext} from "react";
import {TimeInfo} from "../../../models/time/TimeInfo.ts";

interface TimeContextProps {
    currentTime: TimeInfo | null;
    isLoading: boolean;
    error: string | null;
}

export const TimeContext = createContext<TimeContextProps | undefined>(undefined);

