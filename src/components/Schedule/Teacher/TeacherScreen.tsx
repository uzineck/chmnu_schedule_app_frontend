import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import TeacherSearch from "./TeacherSearch.tsx";
import { Teacher } from "../../../models/teacher/Teacher.ts";
import TeacherSchedule from "./TeacherSchedule.tsx";
import './TeacherScreen.css';
import ButtonContainer from "../../Buttons/ButtonContainer.tsx";

const TeacherScreen = () => {
    const { teacherUuid } = useParams<{ teacherUuid: string }>();
    const [searchParams] = useSearchParams();
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
        }

        const isEven = searchParams.get("is_even");
        setIsEvenWeek(isEven ? isEven === "true"  : true);

    }, [teacherUuid, searchParams, teacherList]);

    const handleTeacherSelect = (teacher: Teacher | null) => {
        setSelectedTeacher(teacher);
        updateURL(teacher, isEvenWeek);
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
