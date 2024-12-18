import {Lesson} from "../../models/lesson/Lesson";
import {Day} from "../../models/enums/Day";
import {OrdinaryNumber} from "../../models/enums/OrdinaryNumber";
import {getLessonTime} from "../../models/enums/LessonTime";
import LessonDetails from "./Lesson/LessonDetail";
import {LessonForTeacher} from "../../models/lesson/LessonForTeacher";
import {useNavigate} from "react-router-dom";
import {AiOutlinePlus} from "react-icons/ai";
import {useSchedule} from "./Context/hooks/useSchedule.ts";
import {useTime} from "./Context/hooks/useTime.ts";
import {
    AddLessonIcon,
    BodyCell,
    CurrentLessonIndicator,
    DayCell,
    ScheduleMatrixWrapper,
    MatrixTable,
    TimeCell
} from "./scheduleMatrixStyled.ts";

interface BaseScheduleMatrixProps {
    lessons: Lesson[] | LessonForTeacher[] | null;
    isEditable?: boolean;
}

const BaseScheduleMatrix = ({ lessons, isEditable = false}: BaseScheduleMatrixProps) => {
    const { currentTime } = useTime();
    const { isEvenWeek, setOrdinaryNumber, setDay } = useSchedule();
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
        navigate(`/lesson/create`);
    };

    return (
        <ScheduleMatrixWrapper>
            <MatrixTable>
                <thead>
                <tr>
                    <TimeCell>Time</TimeCell>
                    {dayNames.map((dayName, index) => (
                        <DayCell
                            key={index}
                            isCurrentDay={currentTime?.day === index + 1}
                        >
                            {dayName}
                        </DayCell>
                    ))}
                </tr>
                </thead>
                <tbody>
                {matrix.map((row, rowIndex) => {
                    const ordinaryNumber = rowIndex + 1 as OrdinaryNumber;
                    const lessonTime = getLessonTime(ordinaryNumber);

                    return (
                        <tr key={rowIndex}>
                            <TimeCell>
                                {lessonTime.startTime} - {lessonTime.endTime}
                            </TimeCell>
                            {row.map((lessonCell, colIndex) => (
                                <BodyCell
                                    key={colIndex}
                                    hasLesson={!!lessonCell}
                                    isCurrentLesson={
                                        lessonCell &&
                                        currentTime?.day === colIndex + 1 &&
                                        currentTime?.lesson === rowIndex + 1 &&
                                        currentTime?.is_even === isEvenWeek
                                    }
                                >
                                    {lessonCell && (
                                        <div>
                                            {lessonCell.map((lesson, idx) => (
                                                <LessonDetails
                                                    key={idx}
                                                    lesson={lesson}
                                                    isEditable={isEditable}
                                                />
                                            ))}
                                        </div>
                                    )}
                                    {isEditable && (
                                        <AddLessonIcon onClick={() => handleAddLesson(colIndex, rowIndex)}>
                                            <AiOutlinePlus size={24} />
                                        </AddLessonIcon>
                                    )}
                                    {lessonCell &&
                                        currentTime?.day === colIndex + 1 &&
                                        currentTime?.lesson === rowIndex + 1 && (
                                            <CurrentLessonIndicator />
                                        )}
                                </BodyCell>
                            ))}
                        </tr>
                    );
                })}
                </tbody>
            </MatrixTable>
        </ScheduleMatrixWrapper>
    );
};

export default BaseScheduleMatrix;
