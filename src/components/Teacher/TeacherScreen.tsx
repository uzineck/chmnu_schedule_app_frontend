import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import TeacherSearch from "../Teacher/TeacherSearch.tsx";
import { Teacher } from "../../models/teacher/Teacher.ts";
import TeacherSchedule from "./TeacherSchedule.tsx";
import './TeacherScreen.css';

const TeacherScreen = () => {
    const { teacherUuid } = useParams<{ teacherUuid: string }>(); // Get teacherUuid from URL path
    const [searchParams] = useSearchParams(); // For query parameters
    const navigate = useNavigate();

    const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
    const [teacherList, setTeacherList] = useState<Teacher[]>([]);  // List of all teachers
    const [isEvenWeek, setIsEvenWeek] = useState<boolean>(true);

    // Update selectedTeacher based on teacherUuid from URL
    useEffect(() => {
        const isEven = searchParams.get("is_even") === "true";
        setIsEvenWeek(isEven);

        // Find the teacher in the teacherList that matches the teacherUuid
        if (teacherUuid && teacherList.length > 0) {
            const teacher = teacherList.find(t => t.uuid === teacherUuid);
            if (teacher) {
                setSelectedTeacher(teacher);  // Set the selected teacher if found
            }
        }
    }, [teacherUuid, searchParams, teacherList]);  // Ensure useEffect runs when teacherList is updated

    const handleWeekTypeChange = (weekType: boolean) => {
        setIsEvenWeek(weekType);
        updateURL(selectedTeacher, weekType);
    };

    const handleTeacherSelect = (teacher: Teacher | null) => {
        setSelectedTeacher(teacher);
        updateURL(teacher, isEvenWeek);
    };

    const updateURL = (teacher: Teacher | null, weekType: boolean) => {
        if (teacher) {
            navigate(`/teacher/${teacher.uuid}?is_even=${weekType}`, { replace: true });
        }
    };

    const handleTeacherListFetched = (teachers: Teacher[]) => {
        setTeacherList(teachers);  // Set the fetched teacher list
    };

    // Convert selectedTeacher to OptionType to be used in the dropdown
    const selectedTeacherOption = selectedTeacher ? selectedTeacher : null;

    return (
        <div className="teacher-screen">
            <h1>Teacher Schedule</h1>

            <div className="teacher-search-container">
                <TeacherSearch
                    onTeacherSelect={handleTeacherSelect}
                    onTeacherListFetched={handleTeacherListFetched}  // Pass the callback to TeacherSearch
                    selectedTeacher={selectedTeacherOption}  // Pass selectedTeacher as a prop to TeacherSearch
                />
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

            <div className="teacher-schedule-section">
                {selectedTeacher && (
                    <TeacherSchedule
                        key={`${selectedTeacher.uuid}-${isEvenWeek}`}
                        teacherUuid={selectedTeacher.uuid}
                        is_even={isEvenWeek}
                    />
                )}
            </div>
        </div>
    );
};

export default TeacherScreen;
