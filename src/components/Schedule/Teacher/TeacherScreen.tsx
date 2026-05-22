import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import TeacherSearch from "./TeacherSearch.tsx";
import { Teacher } from "../../../models/teacher/Teacher.ts";
import TeacherSchedule from "./TeacherSchedule.tsx";
import { useScheduleSelection } from "../hooks/useScheduleSelection.ts";
import { useTime } from "../Context/hooks/useTime.ts";
import { ScheduleScreen } from "../scheduleScreenStyled.ts";
import ScheduleControlPanel from "../ScheduleControlPanel.tsx";
import ScheduleNavSwitcher from "../ScheduleNavSwitcher.tsx";

const TeacherScreen = () => {
    const { teacherUuid } = useParams<{ teacherUuid: string }>();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { currentTime } = useTime();

    const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
    const [teacherList, setTeacherList] = useState<Teacher[]>([]);

    const updateURL = useCallback((teacher: Teacher | null, weekType: boolean) => {
        if (teacher) {
            navigate(`/teacher/${teacher.uuid}/lessons?weekType=${weekType}`, { replace: true });
        }
    }, [navigate]);

    const { weekType, handleWeekTypeChange } = useScheduleSelection({
        hasSubgroups: false,
        searchParams,
    });

    useEffect(() => {
        if (teacherList.length === 0) return;

        let initialTeacher: Teacher | null = null;

        if (teacherUuid) {
            initialTeacher = teacherList.find((t) => t.uuid === teacherUuid) ?? null;
        } else {
            const storedTeacher = localStorage.getItem("lastTeacherUuid");
            if (storedTeacher) {
                initialTeacher = teacherList.find((t) => t.uuid === storedTeacher) ?? null;
            }
        }

        setSelectedTeacher(initialTeacher);
    }, [teacherUuid, teacherList]);

    useEffect(() => {
        if (!selectedTeacher) return;
        localStorage.setItem("lastTeacherUuid", selectedTeacher.uuid);
        updateURL(selectedTeacher, weekType);
    }, [selectedTeacher, weekType, updateURL]);

    const handleTeacherSelect = (teacher: Teacher | null) => {
        setSelectedTeacher(teacher);
    };

    const handleTeacherListFetched = (teachers: Teacher[]) => {
        setTeacherList(teachers);
    };

    return (
        <ScheduleScreen>
            <ScheduleControlPanel
                topSlot={<ScheduleNavSwitcher />}
                searchSlot={
                    <TeacherSearch
                        onTeacherSelect={handleTeacherSelect}
                        onTeacherListFetched={handleTeacherListFetched}
                        selectedTeacher={selectedTeacher}
                    />
                }
                showFilters={!!selectedTeacher}
                hasSubgroups={false}
                weekType={weekType}
                currentWeekType={currentTime?.is_even}
                onWeekTypeChange={handleWeekTypeChange}
            />
            {selectedTeacher && (
                <TeacherSchedule
                    key={`${selectedTeacher.uuid}-${weekType}`}
                    teacherUuid={selectedTeacher.uuid}
                    is_even={weekType}
                />
            )}
        </ScheduleScreen>
    );
};

export default TeacherScreen;
