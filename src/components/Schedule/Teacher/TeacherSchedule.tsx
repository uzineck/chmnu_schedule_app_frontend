import {useCallback, useEffect} from "react";
import { getTeacherLessons } from "../../../api/schedule/teacher.ts";
import TeacherScheduleMatrix from "./TeacherScheduleMatrix.tsx";
import {useFetchData} from "../../../api/hooks/useFetchData.tsx";
import {message} from "antd";

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
            messageApi.loading({ key: 'updatable', content: 'Loading...' });
        }
        else {
            messageApi.destroy()
        }
    }, [isLoading, messageApi]);

    useEffect(() => {
        if (error) {
            messageApi.error({ key: 'updatable', content: error, duration: 2 });
        }
    }, [error, messageApi]);

    return (
        <>
            {contextHolder}
            <TeacherScheduleMatrix lessons={data ? data.lessons : null} />
        </>
    );
};

export default TeacherSchedule;
