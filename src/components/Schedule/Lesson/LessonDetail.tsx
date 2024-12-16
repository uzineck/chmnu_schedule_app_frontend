import React from "react";
import "./module.css";
import { Lesson } from "../../../models/lesson/Lesson";
import { LessonForTeacher } from "../../../models/lesson/LessonForTeacher";
import { LessonType } from "../../../models/enums/LessonType.ts";
import { LuDoorClosed } from "react-icons/lu";
import { LiaChalkboardTeacherSolid } from "react-icons/lia";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import {Link, useNavigate} from "react-router-dom";
import {useSchedule} from "../Context/hooks/useSchedule.ts";
import {HiUserGroup} from "react-icons/hi";

function isLessonForTeacher(lesson: Lesson | LessonForTeacher): lesson is LessonForTeacher {
    return (lesson as LessonForTeacher).groups !== undefined;
}

interface LessonDetailsProps {
    lesson: Lesson | LessonForTeacher;
    isEditable?: boolean; // Add isEditable prop
}

const getLessonTypeStyle = (type: LessonType): string => {
    switch (type) {
        case LessonType.LECTURE:
            return "type-lecture";
        case LessonType.PRACTICE:
            return "type-practice";
    }
};

const LessonDetails: React.FC<LessonDetailsProps> = ({ lesson, isEditable = false }) => {
    const { subgroup, setLessonUuid, setLesson } = useSchedule();
    const lessonTypeClass = getLessonTypeStyle(lesson.type);
    const navigate = useNavigate();

    const handleEditLesson = () => {
        setLessonUuid(lesson.uuid);
        setLesson(lesson);
        navigate(`/lesson/${lesson.uuid}/edit?subgroup=${subgroup}`);
    };

    const handleDeleteLesson = () => {
        setLessonUuid(lesson.uuid);
        navigate(`/lesson/${lesson.uuid}/delete?subgroup=${subgroup}`);
    };

    return (
        <div className="lesson-details">
            <div className={`lesson-type ${lessonTypeClass}`}>{lesson.type}</div>
            <div className="lesson-title">{lesson.subject.title}</div>
            <div className="lesson-room"><LuDoorClosed /> {lesson.room.number}</div>
            {isLessonForTeacher(lesson) ? (
                <div className="lesson-groups">
                    <HiUserGroup/>{" "}
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
                </div>
            ) : (
                <div className="lesson-teacher">
                    <LiaChalkboardTeacherSolid/>
                    <Link to={`/teacher/${lesson.teacher.uuid}/lessons`}>
                        {lesson.teacher.last_name} {lesson.teacher.first_name.charAt(0)}. {lesson.teacher.middle_name.charAt(0)}.
                    </Link>
                </div>
            )}

            {isEditable && (
                <div className="lesson-actions">
                    <div className="lesson-action"><FaEdit onClick={handleEditLesson}/></div>
                    <div className="lesson-action"><FaTrashAlt onClick={handleDeleteLesson}/></div>
                </div>
            )}
        </div>
    );
};

export default LessonDetails;
