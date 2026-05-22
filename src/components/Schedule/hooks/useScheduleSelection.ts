import { useCallback, useEffect, useRef, useState } from "react";
import { Subgroup } from "../../../models/enums/Subgroup.ts";
import { useSchedule } from "../Context/hooks/useSchedule.ts";
import { useTime } from "../Context/hooks/useTime.ts";
import { readExpiringEntry, writeExpiringEntry } from "../../../utils/expiringStorage.ts";

interface SelectionState {
    subgroup: Subgroup | null;
    weekType: boolean;
}

interface UseScheduleSelectionOptions {
    hasSubgroups: boolean;
    searchParams: URLSearchParams;
    onChange?: (state: SelectionState) => void;
}

interface UseScheduleSelectionResult {
    subgroup: Subgroup | null;
    weekType: boolean;
    handleSubgroupChange: (next: Subgroup) => void;
    handleWeekTypeChange: (next: boolean) => void;
}

const SUBGROUP_KEY = "lastSubgroup";
const WEEK_TYPE_KEY = "weekTypeMemo";

const resolveSubgroup = (
    hasSubgroups: boolean,
    urlSubgroup: string | null,
): Subgroup | null => {
    if (!hasSubgroups) return null;
    const candidate = urlSubgroup ?? localStorage.getItem(SUBGROUP_KEY);
    return candidate === Subgroup.B ? Subgroup.B : Subgroup.A;
};

export const useScheduleSelection = ({
    hasSubgroups,
    searchParams,
    onChange,
}: UseScheduleSelectionOptions): UseScheduleSelectionResult => {
    const { currentTime } = useTime();
    const { setSubgroup: bridgeSubgroup, setIsEvenWeek: bridgeWeekType } = useSchedule();

    const [subgroup, setLocalSubgroup] = useState<Subgroup | null>(null);
    const [weekType, setLocalWeekType] = useState<boolean>(true);

    const initialized = useRef(false);
    const onChangeRef = useRef(onChange);
    useEffect(() => {
        onChangeRef.current = onChange;
    });

    useEffect(() => {
        if (initialized.current) return;

        const urlWeek = searchParams.get("weekType");
        if (urlWeek === null && !currentTime) return;

        const resolvedSubgroup = resolveSubgroup(hasSubgroups, searchParams.get("subgroup"));
        setLocalSubgroup(resolvedSubgroup);
        bridgeSubgroup(resolvedSubgroup);

        let resolvedWeek: boolean;
        if (urlWeek !== null) {
            resolvedWeek = urlWeek === "true";
        } else {
            const currentEpoch = String(currentTime!.is_even);
            const storedWeek = readExpiringEntry(WEEK_TYPE_KEY, currentEpoch);
            resolvedWeek = storedWeek !== null ? storedWeek === "true" : currentTime!.is_even;
        }
        setLocalWeekType(resolvedWeek);
        bridgeWeekType(resolvedWeek);

        initialized.current = true;
    }, [hasSubgroups, searchParams, currentTime, bridgeSubgroup, bridgeWeekType]);

    useEffect(() => {
        if (!initialized.current) return;
        if (!hasSubgroups && subgroup !== null) {
            setLocalSubgroup(null);
            bridgeSubgroup(null);
        } else if (hasSubgroups && subgroup === null) {
            const resolved = resolveSubgroup(true, null);
            setLocalSubgroup(resolved);
            bridgeSubgroup(resolved);
        }
    }, [hasSubgroups, subgroup, bridgeSubgroup]);

    const handleSubgroupChange = useCallback(
        (next: Subgroup) => {
            setLocalSubgroup(next);
            bridgeSubgroup(next);
            localStorage.setItem(SUBGROUP_KEY, next);
            onChangeRef.current?.({ subgroup: next, weekType });
        },
        [bridgeSubgroup, weekType],
    );

    const handleWeekTypeChange = useCallback(
        (next: boolean) => {
            setLocalWeekType(next);
            bridgeWeekType(next);
            if (currentTime) {
                writeExpiringEntry(WEEK_TYPE_KEY, next.toString(), String(currentTime.is_even));
            }
            onChangeRef.current?.({ subgroup, weekType: next });
        },
        [bridgeWeekType, subgroup, currentTime],
    );

    return { subgroup, weekType, handleSubgroupChange, handleWeekTypeChange };
};
