import React from "react";
import "./module.css";
import { Lesson } from "../../../models/lesson/Lesson";
import { LessonForTeacher } from "../../../models/lesson/LessonForTeacher";
import { LessonType } from "../../../models/enums/LessonType.ts";
import { LuDoorClosed } from "react-icons/lu";
import { LiaChalkboardTeacherSolid } from "react-icons/lia";
import { FaEdit, FaTrashAlt } from "react-icons/fa"; // Edit and delete icons
import {useNavigate} from "react-router-dom";
import {useScheduleContext} from "../Context/ScheduleContext.tsx";

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
    const { subgroup, setLessonUuid, setLesson } = useScheduleContext();
    const lessonTypeClass = getLessonTypeStyle(lesson.type);
    const navigate = useNavigate();

    const handleEditLesson = () => {
        setLessonUuid(lesson.uuid);
        setLesson(lesson);
        navigate(`/group/manage/lesson/${lesson.uuid}/edit?subgroup=${subgroup}`);
    };

    const handleDeleteLesson = () => {
        setLessonUuid(lesson.uuid);
        navigate(`/group/manage/lesson/${lesson.uuid}/delete?subgroup=${subgroup}`);
    };

    return (
        <div className="lesson-details">
            <div className={`lesson-type ${lessonTypeClass}`}>{lesson.type}</div>
            <div className="lesson-title">{lesson.subject.title}</div>
            <div className="lesson-room"><LuDoorClosed /> {lesson.room.number}</div>
            {isLessonForTeacher(lesson) ? (
                <div className="lesson-groups">
                    Groups:{" "}
                    {lesson.groups
                        .map(group => `${group.number} (${group.subgroups.join(", ")})`)
                        .join(", ")}
                </div>
            ) : (
                <div className="lesson-teacher">
                    <LiaChalkboardTeacherSolid /> {lesson.teacher.last_name} {lesson.teacher.first_name.charAt(0)}. {lesson.teacher.middle_name.charAt(0)}.
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
