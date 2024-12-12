import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import TeacherSearch from "./TeacherSearch.tsx";
import { Teacher } from "../../../models/teacher/Teacher.ts";
import TeacherSchedule from "./TeacherSchedule.tsx";
import './TeacherScreen.css';
import ButtonContainer from "../../Buttons/ButtonContainer.tsx";
import {useTime} from "../Time/Context/TimeContext.tsx";

const TeacherScreen = () => {
    const { teacherUuid } = useParams<{ teacherUuid: string }>();
    const [searchParams] = useSearchParams();
    const { currentTime } = useTime();
    const navigate = useNavigate();

    const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
    const [teacherList, setTeacherList] = useState<Teacher[]>([]);
    const [isEvenWeek, setIsEvenWeek] = useState<boolean>(true);

    useEffect(() => {
        if (teacherUuid && teacherList.length > 0) {
            const teacher = teacherList.find(t => t.uuid === teacherUuid);
            if (teacher) {
                setSelectedTeacher(teacher);
            }
        } else {
            const storedTeacher = localStorage.getItem("lastTeacherUuid");
            if (storedTeacher && teacherList.length > 0) {
                const group = teacherList.find(g => g.uuid === storedTeacher);
                if (group) {
                    setSelectedTeacher(group);
                }
            }
        }

        const isEvenFromSearchParams = searchParams.get("is_even");
        if (isEvenFromSearchParams !== null) {
            setIsEvenWeek(isEvenFromSearchParams === "true");
        } else if (currentTime) {
            const isEven = currentTime.is_even;
            setIsEvenWeek(isEven);
        }

    }, [teacherUuid, searchParams, teacherList]);

    useEffect(() => {
        if (selectedTeacher) {
            updateURL(selectedTeacher, isEvenWeek);
        }
    }, [selectedTeacher, isEvenWeek]);

    const handleTeacherSelect = (teacher: Teacher | null) => {
        setSelectedTeacher(teacher);
        updateURL(teacher, isEvenWeek);

        if (teacher) {
            localStorage.setItem("lastTeacherUuid", teacher.uuid);
        }
    };

    const handleWeekTypeChange = (isEvenWeek: boolean) => {
        setIsEvenWeek(isEvenWeek);
        updateURL(selectedTeacher, isEvenWeek);
    };

    const updateURL = (teacher: Teacher | null, isEvenWeek: boolean) => {
        if (teacher) {
            navigate(`/teacher/${teacher.uuid}?is_even=${isEvenWeek}`, { replace: true });
        }
    };

    const handleTeacherListFetched = (teachers: Teacher[]) => {
        setTeacherList(teachers);
    };

    const selectedTeacherOption = selectedTeacher ? selectedTeacher : null;

    return (
        <div className="teacher-screen">
            <div className="teacher-screen-controls">
                <TeacherSearch
                    onTeacherSelect={handleTeacherSelect}
                    onTeacherListFetched={handleTeacherListFetched}
                    selectedTeacher={selectedTeacherOption}
                />
                <div className="button-container-column">
                    <ButtonContainer
                        options={[
                            {label: 'Even', value: true},
                            {label: 'Odd', value: false}
                        ]}
                        selectedValue={isEvenWeek}
                        onChange={handleWeekTypeChange}
                    />
                </div>
            </div>
            {selectedTeacher && (
                <TeacherSchedule
                    key={`${selectedTeacher.uuid}-${isEvenWeek}`}
                    teacherUuid={selectedTeacher.uuid}
                    is_even={isEvenWeek}
                />
            )}
        </div>
    );
};

            export default TeacherScreen;
