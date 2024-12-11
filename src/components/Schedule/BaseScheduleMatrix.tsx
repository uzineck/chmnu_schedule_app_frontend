import { Lesson } from "../../models/lesson/Lesson.ts";
import { Day } from "../../models/enums/Day.ts";
import { OrdinaryNumber } from "../../models/enums/OrdinaryNumber.ts";
import { getLessonTime } from "../../models/enums/LessonTime.ts";
import LessonDetails from "./Lesson/LessonDetail.tsx";
import {LessonForTeacher} from "../../models/lesson/LessonForTeacher.ts"; // Import LessonDetails
import "./module.css"

interface BaseScheduleMatrixProps {
    lessons: Lesson[] | LessonForTeacher[] | null;
}

const BaseScheduleMatrix = ({ lessons }: BaseScheduleMatrixProps) => {
    const matrix: (Lesson | LessonForTeacher)[][] = Array.from({ length: 6 }, () => Array(5).fill(null));

    // Map lessons to their appropriate cell in the matrix
    lessons?.forEach((lesson) => {
        const dayIndex = Object.values(Day).indexOf(lesson.timeslot.day); // Get index for the day (Mon-Fri)
        const ordNumberIndex = lesson.timeslot.ord_number - 1; // Get index for ordinary number (1-6)

        matrix[ordNumberIndex][dayIndex] = lesson; // Place the lesson in the correct position
    });

    // Full names of the days derived from the Day enum
    const dayNames = Object.values(Day).map((day) => {
        switch (day) {
            case Day.MONDAY: return "Monday";
            case Day.TUESDAY: return "Tuesday";
            case Day.WEDNESDAY: return "Wednesday";
            case Day.THURSDAY: return "Thursday";
            case Day.FRIDAY: return "Friday";
            default: return "";
        }
    });

    return (
        <div className="schedule-matrix">
            <table>
                <thead>
                <tr>
                    <th>Lesson Time</th>
                    {dayNames.map((dayName, index) => (
                        <th key={index}>{dayName}</th> // Map over day names to display them
                    ))}
                </tr>
                </thead>
                <tbody>
                {matrix.map((row, rowIndex) => {
                    const ordinaryNumber = rowIndex + 1 as OrdinaryNumber; // Get the corresponding OrdinaryNumber (1-6)
                    const lessonTime = getLessonTime(ordinaryNumber); // Get the start and end time for the lesson period

                    return (
                        <tr key={rowIndex}>
                            <th>{lessonTime.startTime} - {lessonTime.endTime}</th>
                            {/* Display the time for the lesson period */}
                            {row.map((lesson, colIndex) => (
                                <td key={colIndex} className={lesson ? "has-lesson" : "no-lesson"}>
                                    {lesson ? (
                                        <LessonDetails lesson={lesson}/>
                                    ) : (
                                        <></>
                                    )}
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
