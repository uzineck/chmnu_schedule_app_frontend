import { Lesson } from "../../models/lesson/Lesson.ts";
import { LessonForTeacher } from "../../models/lesson/LessonForTeacher.ts";

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

            {/* For regular Lesson, display teacher information */}
            {!isLessonForTeacher(lesson) ? (
                <>
                    <p>{lesson.teacher.first_name} {lesson.teacher.last_name}</p>
                </>
            ) : (
                // For LessonForTeacher, we don't have the teacher, so display group-related details instead
                <></>
            )}

            <p>{lesson.room.number}</p>

            {/* Conditional rendering based on the type of lesson */}
            {isLessonForTeacher(lesson) ? (
                // If it's a LessonForTeacher, display group-related details
                <>
                    <p>Groups: {lesson.groups.map(group => `${group.number} [${group.subgroups.join(", ")}]`).join(", ")}</p>
                </>
            ) : (
                // If it's a regular Lesson, you can display additional lesson-specific content
                <p>No additional group details available for this lesson.</p>
            )}
        </>
    );
};

export default LessonDetails;
