import { Lesson } from "../../models/lesson/Lesson.ts";

import "./GroupScheduleMatrix.css";
import BaseScheduleMatrix from "../Schedule/BaseScheduleMatrix.tsx";

interface GroupScheduleMatrixProps {
    lessons: Lesson[];
}

const GroupScheduleMatrix = ({ lessons }: GroupScheduleMatrixProps) => {
    return (
        <div className="schedule-matrix">
            <BaseScheduleMatrix lessons={lessons} />
        </div>
    );
};

export default GroupScheduleMatrix;
