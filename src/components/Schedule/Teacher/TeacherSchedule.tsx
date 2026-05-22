import {useCallback, useEffect} from "react";
import { getTeacherLessons } from "../../../api/schedule/teacher.ts";
import {useFetchData} from "../../../api/hooks/useFetchData.tsx";
import {message} from "antd";
import BaseScheduleMatrix from "../BaseScheduleMatrix.tsx";
import ScheduleEmptyState from "../ScheduleEmptyState.tsx";

interface TeacherScheduleProps {
    teacherUuid: string;
    is_even: boolean;
}

const TeacherSchedule = ({ teacherUuid, is_even }: TeacherScheduleProps) => {
    const [messageApi, contextHolder] = message.useMessage();

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

    const isEmpty = !!data && !data.lessons?.length;

    return (
        <>
            {contextHolder}
            {isEmpty ? (
                <ScheduleEmptyState
                    message="У цього викладача немає пар на цьому тижні"
                    hint="Спробуйте змінити тиждень — Над або Під."
                />
            ) : (
                <BaseScheduleMatrix lessons={data ? data.lessons : null} />
            )}
        </>
    );
};

export default TeacherSchedule;
