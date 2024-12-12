import React from "react";
import "./module.css";
import {Lesson} from "../../../models/lesson/Lesson";
import {LessonForTeacher} from "../../../models/lesson/LessonForTeacher";
import {LessonType} from "../../../models/enums/LessonType.ts";
import { LuDoorClosed } from "react-icons/lu";
import { LiaChalkboardTeacherSolid } from "react-icons/lia";

function isLessonForTeacher(lesson: Lesson | LessonForTeacher): lesson is LessonForTeacher {
    return (lesson as LessonForTeacher).groups !== undefined;
}

interface LessonDetailsProps {
    lesson: Lesson | LessonForTeacher;
}

const getLessonTypeStyle = (type: LessonType): string => {
    switch (type) {
        case LessonType.LECTURE:
            return "type-lecture";
        case LessonType.PRACTICE:
            return "type-practice";
    }
};

const LessonDetails: React.FC<LessonDetailsProps> = ({ lesson }) => {
    const lessonTypeClass = getLessonTypeStyle(lesson.type);

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
        </div>
    );
};

export default LessonDetails;
