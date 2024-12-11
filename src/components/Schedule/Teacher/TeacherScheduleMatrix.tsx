import { LessonForTeacher } from "../../../models/lesson/LessonForTeacher.ts";

import BaseScheduleMatrix from "../BaseScheduleMatrix.tsx";

interface TeacherScheduleMatrixProps {
    lessons: LessonForTeacher[] | null;
}

const TeacherScheduleMatrix = ({ lessons }: TeacherScheduleMatrixProps) => {
    return (
            <BaseScheduleMatrix lessons={lessons} />
    );
};

export default TeacherScheduleMatrix;
