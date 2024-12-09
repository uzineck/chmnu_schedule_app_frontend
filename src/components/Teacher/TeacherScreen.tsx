import { useState } from "react";
import TeacherSearch from "../Teacher/TeacherSearch.tsx"; // Import TeacherSearch to allow teacher selection
import './TeacherScreen.css';
import {Teacher} from "../../models/teacher/Teacher.ts";
import TeacherSchedule from "./TeacherSchedule.tsx";  // Import the TeacherScreen CSS

const TeacherScreen = () => {
    const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
    const [isEvenWeek, setIsEvenWeek] = useState<boolean>(true); // Default to Even Week


    const handleWeekTypeChange = (weekType: boolean) => {
        setIsEvenWeek(weekType); // Update week type (Even or Odd)
    };

    const handleTeacherSelect = (teacher: Teacher | null) => {
        setSelectedTeacher(teacher);
    };

    return (
        <div className="teacher-screen">
            <h1>Teacher Schedule</h1>

            {/* Teacher Search */}
            <div className="teacher-search-container">
                <TeacherSearch onTeacherSelect={handleTeacherSelect}/>
            </div>

            <div className="button-container">
                <button
                    className={isEvenWeek ? "selected" : ""}
                    onClick={() => handleWeekTypeChange(true)}
                >
                    Even Week
                </button>
                <button
                    className={!isEvenWeek ? "selected" : ""}
                    onClick={() => handleWeekTypeChange(false)}
                >
                    Odd Week
                </button>
            </div>

            {/* Teacher Schedule */}
            <div className="teacher-schedule-section">
                {selectedTeacher && (
                    <TeacherSchedule teacherUuid={selectedTeacher.uuid}/>
                )}
            </div>
        </div>
    );
};

export default TeacherScreen;
