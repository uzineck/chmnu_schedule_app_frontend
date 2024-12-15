import React, {ReactNode, useState} from "react";
import {Subgroup} from "../../../../models/enums/Subgroup.ts";
import {Day} from "../../../../models/enums/Day.ts";
import {OrdinaryNumber} from "../../../../models/enums/OrdinaryNumber.ts";
import {Lesson} from "../../../../models/lesson/Lesson.ts";
import {LessonForTeacher} from "../../../../models/lesson/LessonForTeacher.ts";
import {ScheduleContext} from "../ScheduleContext.tsx";

export const ScheduleProvider: React.FC<{ children: ReactNode }> = ({children}) => {
    const [subgroup, setSubgroup] = useState<Subgroup | null>(null);
    const [isEvenWeek, setIsEvenWeek] = useState<boolean>(true);
    const [groupUuid, setGroupUuid] = useState<string>('');
    const [lessonUuid, setLessonUuid] = useState<string>('');
    const [day, setDay] = useState<Day>(Day.MONDAY);
    const [ordinaryNumber, setOrdinaryNumber] = useState<OrdinaryNumber>(OrdinaryNumber.FIRST);
    const [lesson, setLesson] = useState<Lesson | LessonForTeacher | null>(null);


    return (
        <ScheduleContext.Provider value={{
            groupUuid,
            lessonUuid,
            subgroup,
            isEvenWeek,
            day,
            ordinaryNumber,
            lesson,
            setGroupUuid,
            setLessonUuid,
            setSubgroup,
            setIsEvenWeek,
            setDay,
            setOrdinaryNumber,
            setLesson,
        }}>
            {children}
        </ScheduleContext.Provider>
    );
};