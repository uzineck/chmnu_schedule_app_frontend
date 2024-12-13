import "./module.css";
import { Lesson } from "../../models/lesson/Lesson";
import { Day } from "../../models/enums/Day";
import { OrdinaryNumber } from "../../models/enums/OrdinaryNumber";
import { getLessonTime } from "../../models/enums/LessonTime";
import LessonDetails from "./Lesson/LessonDetail";
import { LessonForTeacher } from "../../models/lesson/LessonForTeacher";
import { useTime } from "./Time/Context/TimeContext.tsx";
import { useNavigate } from "react-router-dom";
import {useScheduleContext} from "./Context/ScheduleContext.tsx";
import {AiOutlinePlus} from "react-icons/ai"; // Plus icon for adding lessons

interface BaseScheduleMatrixProps {
    lessons: Lesson[] | LessonForTeacher[] | null;
    isEditable?: boolean;
}

const BaseScheduleMatrix = ({ lessons, isEditable = false}: BaseScheduleMatrixProps) => {
    const { currentTime } = useTime();
    const { setOrdinaryNumber, setDay } = useScheduleContext();
    const navigate = useNavigate();

    const matrix: (Lesson | LessonForTeacher)[][][] = Array.from({ length: 6 }, () => Array(5).fill(null));

    lessons?.forEach((lesson) => {
        const dayIndex = Object.values(Day).indexOf(lesson.timeslot.day);
        const ordNumberIndex = lesson.timeslot.ord_number - 1;

        if (!matrix[ordNumberIndex][dayIndex]) {
            matrix[ordNumberIndex][dayIndex] = [lesson];
        } else {
            matrix[ordNumberIndex][dayIndex].push(lesson);
        }
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

    const dayIndexMap = ((dayIndex: number) => {
        switch (dayIndex) {
            case 1:
                return Day.MONDAY;
            case 2:
                return Day.TUESDAY;
            case 3:
                return Day.WEDNESDAY;
            case 4:
                return Day.THURSDAY;
            case 5:
                return Day.FRIDAY;
            default:
                return Day.MONDAY;
        }
    });

    const handleAddLesson = (dayIndex: number, ordNumberIndex: number) => {
        setDay(dayIndexMap(dayIndex+1));
        setOrdinaryNumber(ordNumberIndex+1);
        navigate(`/group/manage/lesson/create`);
    };

    return (
        <div className="schedule-matrix">
            <table>
                <thead>
                <tr>
                    <th>Time</th>
                    {dayNames.map((dayName, index) => (
                        <th
                            key={index}
                            className={currentTime?.day === index + 1 ? "current-day-column" : ""}
                        >
                            {dayName}
                        </th>
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
                            {row.map((lessonCell, colIndex) => (
                                <td
                                    key={colIndex}
                                    className={`lesson-cell ${
                                        lessonCell && currentTime?.day === colIndex + 1 && currentTime?.lesson === rowIndex + 1
                                            ? "current-lesson"
                                            : lessonCell
                                                ? "has-lesson"
                                                : "no-lesson"
                                    }`}
                                >
                                    {lessonCell && (
                                        <div className="lessons">
                                            {lessonCell.map((lesson, idx) => (
                                                <LessonDetails key={idx} lesson={lesson} isEditable={isEditable} />
                                            ))}
                                        </div>
                                    )}
                                    {isEditable && (
                                        <div
                                            className="add-lesson-icon"
                                            onClick={() => handleAddLesson(colIndex, rowIndex)}
                                        >
                                            <AiOutlinePlus size={24} />
                                        </div>
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
