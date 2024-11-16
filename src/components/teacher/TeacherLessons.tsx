import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { TeacherWithLessons } from "../../models/teacher/TeacherWithLessons";
import { ApiResponse } from "../../models/ApiResponse";
import { getTeacherLessons } from "../../api/schedule/teacher";

export const TeacherLessons: React.FC = () => {
    const { uuid } = useParams<{ uuid: string }>(); // Get teacher's UUID from URL params
    const [teacherLessons, setTeacherLessons] = useState<TeacherWithLessons | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchLessons = async () => {
            try {
                if (uuid) {
                    const response: ApiResponse<TeacherWithLessons> = await getTeacherLessons(uuid);
                    setTeacherLessons(response.data);
                }
            } catch (err) {
                setError("Failed to load teacher lessons");
            }
        };
        fetchLessons();
    }, [uuid]);

    if (error) {
        return <p style={{ color: "red" }}>{error}</p>;
    }

    if (!teacherLessons) {
        return <p>Loading...</p>;
    }

    const { teacher, lessons } = teacherLessons;
    return (
        <div>
            <h1>Lessons for {teacher.last_name} {teacher.first_name} {teacher.middle_name}</h1>
            {lessons && lessons.length > 0 ? (
                <ul>
                    {lessons.map((lesson) => (
                        <li key={lesson.uuid}>
                            <p>Subject: {lesson.subject.title}</p>
                            <p>Room: {lesson.room.number}</p>
                            <p>Timeslot: {lesson.timeslot.day} - {lesson.timeslot.ord_number}</p>
                            <p>Groups: {lesson.groups.map(group => (
                                <p key={group.uuid}>{group.number}[{group.subgroups.join(", ")}]</p>
                            ))}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No lessons available</p>
            )}
        </div>
    );
};
