import { useEffect, useState } from "react";
import { getTeacherLessons } from "../../api/schedule/teacher";
import { TeacherWithLessons } from "../../models/teacher/TeacherWithLessons";

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
            <table>
                <thead>
                <tr>
                    <th>Subject</th>
                    <th>Groups</th>
                    <th>Room</th>
                    <th>Timeslot</th>
                </tr>
                </thead>
                <tbody>
                {teacherData.lessons.map((lesson) => (
                    <tr key={lesson.uuid}>
                        <td>{lesson.subject.title}</td>
                        <td>
                            {lesson.groups.map((group) =>
                                `${group.number} [${group.subgroups.join(", ")}]`
                            ).join(", ")}
                        </td>
                        <td>{lesson.room.number}</td>
                        <td>
                            {lesson.timeslot.day} : {lesson.timeslot.ord_number}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default TeacherSchedule;
