import {useCallback, useEffect, useRef, useState} from "react";
import { getTeacherLessons } from "../../../api/schedule/teacher.ts";
import {useFetchData} from "../../../api/hooks/useFetchData.tsx";
import {message} from "antd";
import BaseScheduleMatrix from "../BaseScheduleMatrix.tsx";
import ScheduleEmptyState from "../ScheduleEmptyState.tsx";
import { Teacher } from "../../../models/teacher/Teacher.ts";

interface TeacherScheduleProps {
    teacherUuid: string;
    is_even: boolean;
    /** Bubbles the freshly-fetched Teacher up so the parent screen can render
     *  the dropdown label even when it didn't preload the full list. */
    onTeacherChange?: (teacher: Teacher | null) => void;
}

const TeacherSchedule = ({ teacherUuid, is_even, onTeacherChange }: TeacherScheduleProps) => {
    const [messageApi, contextHolder] = message.useMessage();
    const [otherWeekEmpty, setOtherWeekEmpty] = useState<boolean | null>(null);

    // Per-teacher cache of which is_even values are known empty. Reset when
    // the teacher changes — different teacher, fresh cache.
    const emptyByWeekRef = useRef<Record<string, boolean>>({});

    useEffect(() => {
        emptyByWeekRef.current = {};
        setOtherWeekEmpty(null);
    }, [teacherUuid]);

    const fetchLessons = useCallback(
        () => getTeacherLessons(teacherUuid, is_even),
        [teacherUuid, is_even]
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

    useEffect(() => {
        onTeacherChange?.(data?.teacher ?? null);
    }, [data, onTeacherChange]);

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
        getTeacherLessons(teacherUuid, !is_even)
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
    }, [isEmpty, teacherUuid, is_even]);

    const bothWeeksEmpty = isEmpty && otherWeekEmpty === true;

    const emptyMessage = bothWeeksEmpty
        ? "Розклад ще не був створений для цього викладача"
        : "У цього викладача немає пар на цьому тижні";

    const emptyHint = bothWeeksEmpty
        ? undefined
        : "Спробуйте змінити тиждень — Над або Під.";

    return (
        <>
            {contextHolder}
            {isEmpty ? (
                <ScheduleEmptyState message={emptyMessage} hint={emptyHint} />
            ) : (
                <BaseScheduleMatrix
                    lessons={data ? data.lessons : null}
                    emptyDayMessage="У цього викладача немає пар у цей день"
                />
            )}
        </>
    );
};

export default TeacherSchedule;
