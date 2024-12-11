import { Lesson } from "../../../models/lesson/Lesson.ts";
import { LessonForTeacher } from "../../../models/lesson/LessonForTeacher.ts";

// Type guard to check if the lesson is of type `LessonForTeacher`
function isLessonForTeacher(lesson: Lesson | LessonForTeacher): lesson is LessonForTeacher {
    return (lesson as LessonForTeacher).groups !== undefined;
}

interface LessonDetailsProps {
    lesson: Lesson | LessonForTeacher;
}

const LessonDetails = ({ lesson }: LessonDetailsProps) => {
    return (
        <>
            <strong>{lesson.subject.title}</strong>
            <p>{lesson.type}</p>
            <p>Room: {lesson.room.number}</p>

            {!isLessonForTeacher(lesson) ? (
                <>
                    <p>{lesson.teacher.last_name} {lesson.teacher.first_name.charAt(0)}. {lesson.teacher.middle_name.charAt(0)}.</p>

                </>
            ) : (
                <></>
            )}


            {isLessonForTeacher(lesson) ? (
                <>
                    <p>Groups: {lesson.groups.map(group => `${group.number} (${group.subgroups.join(",")})`).join(", ")}</p>
                </>
            ) : (
                <></>
            )}
        </>
    );
};

export default LessonDetails;
