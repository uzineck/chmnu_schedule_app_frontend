import { Lesson } from "../../models/lesson/Lesson";
import { Day } from "../../models/enums/Day";
import { OrdinaryNumber } from "../../models/enums/OrdinaryNumber";
import { getLessonTime } from "../../models/enums/LessonTime";
import LessonDetails from "./Lesson/LessonDetail";
import { LessonForTeacher } from "../../models/lesson/LessonForTeacher";
import "./module.css";

interface BaseScheduleMatrixProps {
    lessons: Lesson[] | LessonForTeacher[] | null;
}

const BaseScheduleMatrix = ({ lessons }: BaseScheduleMatrixProps) => {
    const matrix: (Lesson | LessonForTeacher)[][] = Array.from({ length: 6 }, () => Array(5).fill(null));

    lessons?.forEach((lesson) => {
        const dayIndex = Object.values(Day).indexOf(lesson.timeslot.day);
        const ordNumberIndex = lesson.timeslot.ord_number - 1;

        matrix[ordNumberIndex][dayIndex] = lesson;
    });

    const dayNames = Object.values(Day).map((day) => {
        switch (day) {
            case Day.MONDAY:
                return "Monday";
            case Day.TUESDAY:
                return "Tuesday";
            case Day.WEDNESDAY:
                return "Wednesday";
            case Day.THURSDAY:
                return "Thursday";
            case Day.FRIDAY:
                return "Friday";
            default:
                return "";
        }
    });

    return (
        <div className="schedule-matrix">
            <table>
                <thead>
                <tr>
                    <th>Time</th>
                    {dayNames.map((dayName, index) => (
                        <th key={index}>{dayName}</th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {matrix.map((row, rowIndex) => {
                    const ordinaryNumber = rowIndex + 1 as OrdinaryNumber;
                    const lessonTime = getLessonTime(ordinaryNumber);

                    return (
                        <tr key={rowIndex}>
                            <th className="time-cell">
                                {lessonTime.startTime} - {lessonTime.endTime}
                            </th>
                            {row.map((lesson, colIndex) => (
                                <td
                                    key={colIndex}
                                    className={lesson ? "lesson-cell has-lesson" : "lesson-cell no-lesson"}
                                >
                                    {lesson ? <LessonDetails lesson={lesson} /> : <></>}
                                </td>
                            ))}
                        </tr>
                    );
                })}
                </tbody>
            </table>
        </div>
    );
};

export default BaseScheduleMatrix;
