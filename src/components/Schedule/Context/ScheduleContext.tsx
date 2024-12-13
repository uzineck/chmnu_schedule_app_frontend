import React, { createContext, useContext, useState, ReactNode } from "react";
import {Subgroup} from "../../../models/enums/Subgroup.ts";
import {Day} from "../../../models/enums/Day.ts";
import {OrdinaryNumber} from "../../../models/enums/OrdinaryNumber.ts";
import {Lesson} from "../../../models/lesson/Lesson.ts";
import {LessonForTeacher} from "../../../models/lesson/LessonForTeacher.ts";

interface ScheduleContextType {
    groupUuid: string;
    lessonUuid: string;
    lesson: Lesson | LessonForTeacher | null;
    subgroup: Subgroup;
    isEvenWeek: boolean;
    day: Day;
    ordinaryNumber: OrdinaryNumber;
    setSubgroup: React.Dispatch<React.SetStateAction<Subgroup>>;
    setIsEvenWeek: React.Dispatch<React.SetStateAction<boolean>>;
    setGroupUuid: React.Dispatch<React.SetStateAction<string>>;
    setLessonUuid: React.Dispatch<React.SetStateAction<string>>;
    setOrdinaryNumber: React.Dispatch<React.SetStateAction<OrdinaryNumber>>;
    setDay: React.Dispatch<React.SetStateAction<Day>>;
    setLesson: React.Dispatch<React.SetStateAction<Lesson | LessonForTeacher | null>>

}

const ScheduleContext = createContext<ScheduleContextType | undefined>(undefined);

export const ScheduleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [subgroup, setSubgroup] = useState<Subgroup>(Subgroup.A);
    const [isEvenWeek, setIsEvenWeek] = useState<boolean>(true);
    const [groupUuid, setGroupUuid] = useState<string>('');
    const [lessonUuid, setLessonUuid] = useState<string>('');
    const [day, setDay] = useState<Day>(Day.MONDAY);
    const [ordinaryNumber, setOrdinaryNumber] = useState<OrdinaryNumber>(OrdinaryNumber.FIRST);
    const [lesson, setLesson] = useState<Lesson | LessonForTeacher| null>(null);



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

export const useScheduleContext = (): ScheduleContextType => {
    const context = useContext(ScheduleContext);
    if (!context) {
        throw new Error("useScheduleContext must be used within a ScheduleProvider");
    }
    return context;
};
