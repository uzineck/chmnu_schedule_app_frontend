import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import TeacherSearch from "./TeacherSearchAsync.tsx";
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

    // Effective uuid drives data fetch. On mount we seed it from URL or
    // localStorage so the schedule loads immediately — no full-list preload.
    const initialUuid =
        teacherUuid ?? (typeof window !== "undefined" ? localStorage.getItem("lastTeacherUuid") : null);
    const [activeUuid, setActiveUuid] = useState<string | null>(initialUuid);
    // Full Teacher object — sourced from the dropdown OR bubbled up from
    // TeacherSchedule's fetch (which returns `{teacher, lessons}`).
    const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

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
        if (!selectedTeacher) return;
        localStorage.setItem("lastTeacherUuid", selectedTeacher.uuid);
        updateURL(selectedTeacher, weekType);
    }, [selectedTeacher, weekType, updateURL]);

    const handleTeacherSelect = (teacher: Teacher | null) => {
        setSelectedTeacher(teacher);
        setActiveUuid(teacher?.uuid ?? null);
    };

    // TeacherSchedule fetches `/teacher/{uuid}/lessons` which returns the full
    // Teacher inline — adopt it as our selected entity so the dropdown label
    // is correct even on a cold load via URL.
    const handleTeacherBubbled = (teacher: Teacher | null) => {
        if (!teacher) return;
        if (!selectedTeacher || selectedTeacher.uuid !== teacher.uuid) {
            setSelectedTeacher(teacher);
        }
    };

    return (
        <ScheduleScreen>
            <ScheduleControlPanel
                topSlot={<ScheduleNavSwitcher />}
                searchSlot={
                    <TeacherSearch
                        onTeacherSelect={handleTeacherSelect}
                        selectedTeacher={selectedTeacher}
                    />
                }
                showFilters={!!selectedTeacher}
                hasSubgroups={false}
                weekType={weekType}
                currentWeekType={currentTime?.is_even}
                onWeekTypeChange={handleWeekTypeChange}
            />
            {activeUuid && (
                <TeacherSchedule
                    key={`${activeUuid}-${weekType}`}
                    teacherUuid={activeUuid}
                    is_even={weekType}
                    onTeacherChange={handleTeacherBubbled}
                />
            )}
        </ScheduleScreen>
    );
};

export default TeacherScreen;
