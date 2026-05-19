import React, {useCallback, useEffect, useMemo, useState} from "react";
import {useLocation} from "react-router-dom";
import {getCurrentTime} from "../../../../api/time/time.ts";
import {TimeContext} from "../TimeContext.tsx";
import {TimeInfo} from "../../../../models/time/TimeInfo.ts";

const POLL_INTERVAL_MS = 60_000;

const SCHEDULE_PATH_PREFIXES = ["/group", "/teacher", "/admin/manage/schedule"];

export const TimeProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const location = useLocation();
    const [currentTime, setCurrentTime] = useState<TimeInfo | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const onScheduleScreen = useMemo(
        () => SCHEDULE_PATH_PREFIXES.some((prefix) => location.pathname.startsWith(prefix)),
        [location.pathname]
    );

    const fetchTime = useCallback(async () => {
        try {
            const response = await getCurrentTime();
            setCurrentTime(response.data);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unknown error while fetching time");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!onScheduleScreen) return;
        fetchTime();
        const id = window.setInterval(fetchTime, POLL_INTERVAL_MS);
        return () => window.clearInterval(id);
    }, [fetchTime, onScheduleScreen]);

    return (
        <TimeContext.Provider value={{currentTime, isLoading, error}}>
            {children}
        </TimeContext.Provider>
    );
};
