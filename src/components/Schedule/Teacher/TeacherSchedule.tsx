import { useCallback } from "react";
import { getTeacherLessons } from "../../../api/schedule/teacher.ts";
import TeacherScheduleMatrix from "./TeacherScheduleMatrix.tsx";
import {useFetchData} from "../../../api/hooks/useFetchData.tsx";
import Title from "../../Title/Title.tsx";

interface TeacherScheduleProps {
    teacherUuid: string;
    is_even: boolean;
}

const TeacherSchedule = ({ teacherUuid, is_even }: TeacherScheduleProps) => {
    const fetchLessons = useCallback(
        () => getTeacherLessons(teacherUuid, is_even),
        [teacherUuid, is_even]
    );

    const { data, error, isLoading } = useFetchData(fetchLessons);

    if (isLoading) {
        return <p>Loading teacher schedule...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <>
            <Title text={`${data?.teacher.last_name} ${data?.teacher.first_name.charAt(0)}. ${data?.teacher.middle_name.charAt(0)}.`} />
            <TeacherScheduleMatrix lessons={data ? data.lessons : null} />
        </>
    );
};

export default TeacherSchedule;
