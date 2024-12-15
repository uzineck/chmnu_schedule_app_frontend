import React, {useCallback} from "react";
import {getCurrentTime} from "../../../../api/time/time.ts";
import {useFetchData} from "../../../../api/hooks/useFetchData.tsx";
import {TimeContext} from "../TimeContext.tsx";

export const TimeProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const fetchCurrentTime = useCallback(() => getCurrentTime(), []);
    const {data, isLoading, error} = useFetchData(fetchCurrentTime);

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