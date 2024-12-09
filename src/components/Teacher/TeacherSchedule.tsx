// components/TeacherSchedule.tsx
import { useEffect, useState } from "react";
import { getTeacherLessons } from "../../api/schedule/teacher.ts";
import { TeacherWithLessons } from "../../models/teacher/TeacherWithLessons.ts";
import TeacherScheduleMatrix from "./TeacherScheduleMatrix.tsx";  // Import the matrix component

interface TeacherScheduleProps {
    teacherUuid: string;
}

const TeacherSchedule = ({ teacherUuid }: TeacherScheduleProps) => {
    const [teacherData, setTeacherData] = useState<TeacherWithLessons | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        if (teacherUuid) {
            setIsLoading(true);
            getTeacherLessons(teacherUuid)
                .then((response) => {
                    setTeacherData(response.data);
                    setIsLoading(false);
                })
                .catch((error) => {
                    console.error("Error fetching teacher's lessons:", error);
                    setIsLoading(false);
                });
        }
    }, [teacherUuid]);

    if (isLoading) {
        return <p>Loading teacher's schedule...</p>;
    }

    if (!teacherData || !teacherData.lessons || teacherData.lessons.length === 0) {
        return <p>No lessons available for this teacher.</p>;
    }

    return (
        <div>
            <h2>
                {teacherData.teacher.first_name} {teacherData.teacher.last_name}'s Schedule
            </h2>
            <TeacherScheduleMatrix lessons={teacherData.lessons} /> {/* Use TeacherScheduleMatrix */}
        </div>
    );
};

export default TeacherSchedule;
