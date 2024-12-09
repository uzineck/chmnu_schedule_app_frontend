import BaseScheduleMatrix from "../Schedule/BaseScheduleMatrix.tsx";
import {LessonForTeacher} from "../../models/lesson/LessonForTeacher.ts";

interface TeacherScheduleMatrixProps {
    lessons: LessonForTeacher[];
}

const TeacherScheduleMatrix = ({ lessons }: TeacherScheduleMatrixProps) => {
    return (
        <div className="schedule-matrix">
            <BaseScheduleMatrix lessons={lessons} />
        </div>
    );
};

export default TeacherScheduleMatrix;
