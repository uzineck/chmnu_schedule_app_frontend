import { Lesson } from "../../../models/lesson/Lesson.ts";

import BaseScheduleMatrix from "../BaseScheduleMatrix.tsx";

interface GroupScheduleMatrixProps {
    lessons: Lesson[] | null;
}

const GroupScheduleMatrix = ({ lessons }: GroupScheduleMatrixProps) => {
    return (
            <BaseScheduleMatrix lessons={lessons} />
    );
};

export default GroupScheduleMatrix;
