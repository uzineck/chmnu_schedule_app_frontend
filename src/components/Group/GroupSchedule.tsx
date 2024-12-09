// Schedule.tsx (Group Schedule)
import {useEffect, useState} from "react";
import {getGroupLessons} from "../../api/schedule/group.ts";
import {Lesson} from "../../models/lesson/Lesson.ts";
import {Subgroup} from "../../models/enums/Subgroup.ts";

interface GroupScheduleProps {
    groupUuid: string;
    subgroup: Subgroup;
    is_even: boolean
}

const GroupSchedule = ({ groupUuid, subgroup, is_even }: GroupScheduleProps) => {
    const [lessons, setLessons] = useState<Lesson[] | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        if (groupUuid) {
            setIsLoading(true);
            getGroupLessons(groupUuid, subgroup, is_even)
                .then((response) => {
                    setLessons(response.data.lessons);
                    setIsLoading(false);
                })
                .catch((error) => {
                    console.error("Error fetching lessons:", error);
                    setIsLoading(false);
                });
        }
    }, [groupUuid]);

    if (isLoading) {
        return <p>Loading group schedule...</p>;
    }

    if (!lessons) {
        return <p>No lessons available for this group.</p>;
    }

    return (
        <div>
            <h2>Group Schedule</h2>
            <table>
                <thead>
                <tr>
                    <th>Subject</th>
                    <th>Teacher</th>
                    <th>Room</th>
                    <th>Timeslot</th>
                </tr>
                </thead>
                <tbody>
                {lessons.map((lesson) => (
                    <tr key={lesson.uuid}>
                        <td>{lesson.subject.title}</td>
                        <td>{lesson.teacher.first_name} {lesson.teacher.last_name}</td>
                        <td>{lesson.room.number}</td>
                        <td>{lesson.timeslot.day} : {lesson.timeslot.ord_number}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default GroupSchedule;
