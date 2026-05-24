import {useCallback, useEffect, useRef, useState} from "react";
import { useFetchData } from "../../../api/hooks/useFetchData.tsx";
import { getGroupLessons } from "../../../api/schedule/group.ts";
import { Subgroup } from "../../../models/enums/Subgroup.ts";
import {message} from "antd";
import BaseScheduleMatrix from "../BaseScheduleMatrix.tsx";
import ScheduleEmptyState from "../ScheduleEmptyState.tsx";
import { GroupWithSubgroup } from "../../../models/group/GroupWithSubgroup.ts";

interface GroupScheduleProps {
    groupUuid: string;
    subgroup: Subgroup | null;
    is_even: boolean;
    isEditable?: boolean;
    /** Bubbles the schedule's `schedule_updated_at` up to the parent so a
     *  single indicator can live in the ControlPanel area. Fires `null`
     *  before data arrives. */
    onScheduleUpdatedChange?: (iso: string | null) => void;
    /** Bubbles the freshly-fetched Group up so the parent screen can render
     *  the dropdown label even when it didn't preload the full list. */
    onGroupChange?: (group: GroupWithSubgroup | null) => void;
}

const GroupSchedule = ({ groupUuid, subgroup, is_even, isEditable, onScheduleUpdatedChange, onGroupChange }: GroupScheduleProps) => {
    const [messageApi, contextHolder] = message.useMessage();
    const [otherWeekEmpty, setOtherWeekEmpty] = useState<boolean | null>(null);

    // Per-(group, subgroup) cache of which is_even values are known empty.
    // Keyed by stringified is_even ("true" / "false"). Reset when the
    // (group, subgroup) key changes — different group, fresh cache.
    const emptyByWeekRef = useRef<Record<string, boolean>>({});

    useEffect(() => {
        emptyByWeekRef.current = {};
        setOtherWeekEmpty(null);
    }, [groupUuid, subgroup]);

    const fetchLessons = useCallback(
        () => getGroupLessons(groupUuid, subgroup, is_even),
        [groupUuid, subgroup, is_even]
    );

    const { data, error, isLoading } = useFetchData(fetchLessons);

    useEffect(() => {
        if (isLoading) {
            messageApi.loading({ key: 'loading', content: 'Завантаження...' });
        }
        else {
            messageApi.destroy('loading')
        }
    }, [isLoading, messageApi]);

    useEffect(() => {
        if (error) {
            messageApi.error({ content: error, duration: 3 });
        }
    }, [error, messageApi]);

    const isEmpty = !!data && !data.lessons?.length;

    // Seed the cache with what the main fetch just told us. Means subsequent
    // toggles to this same week won't need a probe — the cache already knows.
    useEffect(() => {
        if (!data) return;
        emptyByWeekRef.current[String(is_even)] = !data.lessons?.length;
    }, [data, is_even]);

    // When the current week comes back empty, find out the OTHER week's state
    // so we can distinguish "this week happens to be empty" from "no schedule
    // exists at all". Check the cache first to avoid duplicate fetches on
    // week-tab toggles.
    useEffect(() => {
        if (!isEmpty) {
            setOtherWeekEmpty(null);
            return;
        }
        const otherKey = String(!is_even);
        if (otherKey in emptyByWeekRef.current) {
            setOtherWeekEmpty(emptyByWeekRef.current[otherKey]);
            return;
        }
        let cancelled = false;
        getGroupLessons(groupUuid, subgroup, !is_even)
            .then((response) => {
                if (cancelled) return;
                const empty = !response.data?.lessons?.length;
                emptyByWeekRef.current[otherKey] = empty;
                setOtherWeekEmpty(empty);
            })
            .catch(() => {
                if (cancelled) return;
                setOtherWeekEmpty(null);
            });
        return () => {
            cancelled = true;
        };
    }, [isEmpty, groupUuid, subgroup, is_even]);

    const bothWeeksEmpty = isEmpty && otherWeekEmpty === true;

    const emptyMessage = bothWeeksEmpty
        ? (subgroup
            ? `У підгрупи ${subgroup} ще немає розкладу`
            : "У цієї групи ще немає розкладу")
        : (subgroup
            ? `У підгрупи ${subgroup} немає пар на цьому тижні`
            : "У цієї групи немає пар на цьому тижні");

    const emptyHint = isEditable
        ? "Натисніть + у вільному слоті, щоб додати першу пару."
        : bothWeeksEmpty
            ? "Зверніться до старости групи, щоб створити розклад."
            : "Спробуйте змінити тиждень — Над або Під.";

    useEffect(() => {
        onScheduleUpdatedChange?.(data?.group?.schedule_updated_at ?? null);
    }, [data, onScheduleUpdatedChange]);

    useEffect(() => {
        onGroupChange?.(data?.group ?? null);
    }, [data, onGroupChange]);

    return (
        <>
            {contextHolder}
            {isEmpty && !isEditable ? (
                <ScheduleEmptyState message={emptyMessage} hint={emptyHint} />
            ) : (
                <BaseScheduleMatrix
                    lessons={data ? data.lessons : null}
                    isEditable={isEditable}
                    emptyDayMessage={subgroup ? `У підгрупи ${subgroup} немає пар у цей день` : "У цієї групи немає пар у цей день"}
                />
            )}
        </>
    );
};

export default GroupSchedule;
