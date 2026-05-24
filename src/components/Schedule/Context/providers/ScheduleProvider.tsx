import React, {ReactNode, useCallback, useState} from "react";
import {Subgroup} from "../../../../models/enums/Subgroup.ts";
import {Day} from "../../../../models/enums/Day.ts";
import {OrdinaryNumber} from "../../../../models/enums/OrdinaryNumber.ts";
import {Lesson} from "../../../../models/lesson/Lesson.ts";
import {LessonForTeacher} from "../../../../models/lesson/LessonForTeacher.ts";
import {ScheduleContext, ScheduleEditMode} from "../ScheduleContext.tsx";
import {Group} from "../../../../models/group/Group.ts";

export const ScheduleProvider: React.FC<{ children: ReactNode }> = ({children}) => {
    const [subgroup, setSubgroup] = useState<Subgroup | null>(null);
    const [isEvenWeek, setIsEvenWeek] = useState<boolean>(true);
    const [groupUuid, setGroupUuid] = useState<string>('');
    const [lessonUuid, setLessonUuid] = useState<string>('');
    const [day, setDay] = useState<Day | null>(null);
    const [ordinaryNumber, setOrdinaryNumber] = useState<OrdinaryNumber | null>(null);
    const [lesson, setLesson] = useState<Lesson | LessonForTeacher | null>(null);
    const [group, setGroup] = useState<Group | null>(null);
    const [scheduleEditMode, setScheduleEditMode] = useState<ScheduleEditMode | null>(null);
    const [scheduleRefreshKey, setScheduleRefreshKey] = useState<number>(0);
    const bumpScheduleRefresh = useCallback(() => {
        setScheduleRefreshKey((k) => k + 1);
    }, []);


    return (
        <ScheduleContext.Provider value={{
            groupUuid,
            lessonUuid,
            subgroup,
            isEvenWeek,
            day,
            ordinaryNumber,
            lesson,
            group,
            scheduleEditMode,
            scheduleRefreshKey,
            setGroupUuid,
            setLessonUuid,
            setSubgroup,
            setIsEvenWeek,
            setDay,
            setOrdinaryNumber,
            setLesson,
            setGroup,
            setScheduleEditMode,
            bumpScheduleRefresh,
        }}>
            {children}
        </ScheduleContext.Provider>
    );
};