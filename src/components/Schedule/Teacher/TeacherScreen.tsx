import {useCallback, useEffect, useState} from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import TeacherSearch from "./TeacherSearch.tsx";
import { Teacher } from "../../../models/teacher/Teacher.ts";
import TeacherSchedule from "./TeacherSchedule.tsx";
import './module.css';
import ButtonContainer from "../../Buttons/ButtonContainer.tsx";

import {useTime} from "../Context/hooks/useTime.ts";
import {useSchedule} from "../Context/hooks/useSchedule.ts";

const TeacherScreen = () => {
    const { teacherUuid } = useParams<{ teacherUuid: string }>();
    const [searchParams] = useSearchParams();
    const { currentTime } = useTime();
    const { setIsEvenWeek } = useSchedule();
    const navigate = useNavigate();

    const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
    const [teacherList, setTeacherList] = useState<Teacher[]>([]);
    const [selectedWeekType, setSelectedWeekType] = useState<boolean>(true);

    const updateURL = useCallback((teacher: Teacher | null, weekType: boolean) => {
        if (teacher) {
            navigate(`/teacher/${teacher.uuid}/lessons?weekType=${weekType}`, { replace: true });
        }
    }, [navigate]);
    
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

        const weekTypeFromSearchParams = searchParams.get("weekType");
        if (weekTypeFromSearchParams !== null) {
            const weekType =  weekTypeFromSearchParams === "true";
            setSelectedWeekType(weekType);
            setIsEvenWeek(weekType);
        } else if (currentTime) {
            const weekType =  currentTime.is_even;
            setSelectedWeekType(weekType);
            setIsEvenWeek(weekType);
        }

    }, [setIsEvenWeek, currentTime, teacherUuid, searchParams, teacherList]);

    useEffect(() => {
        if (selectedTeacher) {
            updateURL(selectedTeacher, selectedWeekType);
            localStorage.setItem("lastTeacherUuid", selectedTeacher.uuid);
        }
    }, [updateURL, selectedTeacher, selectedWeekType]);

    const handleTeacherSelect = (teacher: Teacher | null) => {
        setSelectedTeacher(teacher);
        updateURL(teacher, selectedWeekType);

        if (teacher) {
            localStorage.setItem("lastTeacherUuid", teacher.uuid);
        }
    };

    const handleWeekTypeChange = (weekType: boolean) => {
        setSelectedWeekType(weekType);
        setIsEvenWeek(weekType);
        updateURL(selectedTeacher, weekType);
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
                            {label: 'Тиждень над', value: true},
                            {label: 'Тиждень під', value: false}
                        ]}
                        selectedValue={selectedWeekType}
                        onChange={handleWeekTypeChange}
                    />
                </div>
            </div>
            {selectedTeacher && (
                <TeacherSchedule
                    key={`${selectedTeacher.uuid}-${selectedWeekType}`}
                    teacherUuid={selectedTeacher.uuid}
                    is_even={selectedWeekType}
                />
            )}
        </div>
    );
};

            export default TeacherScreen;
