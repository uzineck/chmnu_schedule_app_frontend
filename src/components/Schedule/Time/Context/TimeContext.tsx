import React, { createContext, useContext, useCallback } from "react";
import {useFetchData} from "../../../../api/hooks/useFetchData.tsx";
import {getCurrentTime} from "../../../../api/time/time.ts";
import {TimeInfo} from "../../../../models/time/TimeInfo.ts";

interface TimeContextValue {
    currentTime: TimeInfo | null;
    isLoading: boolean;
    error: string | null;
}

const TimeContext = createContext<TimeContextValue | undefined>(undefined);

export const TimeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const fetchCurrentTime = useCallback(() => getCurrentTime(), []);
    const { data, isLoading, error } = useFetchData(fetchCurrentTime);

    return (
        <TimeContext.Provider
            value={{
                currentTime: data || null,
                isLoading,
                error,
            }}
        >
            {children}
        </TimeContext.Provider>
    );
};

export const useTime = (): TimeContextValue => {
    const context = useContext(TimeContext);
    if (!context) {
        throw new Error("useTime must be used within a TimeProvider");
    }
    return context;
};
