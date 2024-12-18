import React from "react";
import { LessonDetailsContainer, LessonTypeContainer, LessonTitle, LessonRoom, LessonTeacher, LessonGroups, LessonActions } from "./lessonDetailStyled.ts";
import { Lesson } from "../../../models/lesson/Lesson";
import { LessonForTeacher } from "../../../models/lesson/LessonForTeacher";
import { Link, useNavigate } from "react-router-dom";
import { useSchedule } from "../Context/hooks/useSchedule.ts";
import {DoorIcon, EditIcon, GroupIcon, TeacherIcon, TrashIcon} from "./lessonIcons.tsx";

function isLessonForTeacher(lesson: Lesson | LessonForTeacher): lesson is LessonForTeacher {
    return (lesson as LessonForTeacher).groups !== undefined;
}

interface LessonDetailsProps {
    lesson: Lesson | LessonForTeacher;
    isEditable?: boolean;
}


const LessonDetails: React.FC<LessonDetailsProps> = ({ lesson, isEditable = false }) => {
    const { setLessonUuid, setLesson, setDay, setOrdinaryNumber } = useSchedule();
    const navigate = useNavigate();

    const handleEditLesson = () => {
        setLessonUuid(lesson.uuid);
        setLesson(lesson);
        setDay(lesson.timeslot.day)
        setOrdinaryNumber(lesson.timeslot.ord_number)
        navigate(`/lesson/${lesson.uuid}/edit`);
    };

    const handleDeleteLesson = () => {
        setLessonUuid(lesson.uuid);
        navigate(`/lesson/${lesson.uuid}/delete`);
    };

    return (
        <LessonDetailsContainer>
            <LessonTypeContainer type={lesson.type}>{lesson.type}</LessonTypeContainer>
            <LessonTitle>{lesson.subject.title}</LessonTitle>
            <LessonRoom><DoorIcon /> {lesson.room.number}</LessonRoom>
            {isLessonForTeacher(lesson) ? (
                <LessonGroups>
                    <GroupIcon/>{" "}
                    {lesson.groups.map((group, index) => (
                        <span key={group.uuid}>
                            <Link
                                to={
                                    group.subgroups && group.subgroups.length === 1
                                        ? `/group/${group.uuid}/lessons?subgroup=${group.subgroups[0]}`
                                        : `/group/${group.uuid}/lessons`
                                }
                            >
                                {group.number}{group.subgroups && group.subgroups.length === 1 ? `(${group.subgroups.join(", ")})` : ""}
                            </Link>
                            {index < lesson.groups.length - 1 && ","}
                        </span>
                    ))}
                </LessonGroups>
            ) : (
                <LessonTeacher>
                    <TeacherIcon/>
                    <Link to={`/teacher/${lesson.teacher.uuid}/lessons`}>
                        {lesson.teacher.last_name} {lesson.teacher.first_name.charAt(0)}. {lesson.teacher.middle_name.charAt(0)}.
                    </Link>
                </LessonTeacher>
            )}

            {isEditable && (
                <LessonActions>
                    <EditIcon onClick={handleEditLesson} />
                    <TrashIcon onClick={handleDeleteLesson} />
                </LessonActions>
            )}
        </LessonDetailsContainer>
    );
};

export default LessonDetails;
