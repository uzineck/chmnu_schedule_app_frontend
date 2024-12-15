import React, {createContext} from "react";
import {Subgroup} from "../../../models/enums/Subgroup.ts";
import {Day} from "../../../models/enums/Day.ts";
import {OrdinaryNumber} from "../../../models/enums/OrdinaryNumber.ts";
import {Lesson} from "../../../models/lesson/Lesson.ts";
import {LessonForTeacher} from "../../../models/lesson/LessonForTeacher.ts";

interface ScheduleContextProps {
    groupUuid: string;
    lessonUuid: string;
    lesson: Lesson | LessonForTeacher | null;
    subgroup: Subgroup | null;
    isEvenWeek: boolean;
    day: Day;
    ordinaryNumber: OrdinaryNumber;
    setSubgroup: React.Dispatch<React.SetStateAction<Subgroup | null>>;
    setIsEvenWeek: React.Dispatch<React.SetStateAction<boolean>>;
    setGroupUuid: React.Dispatch<React.SetStateAction<string>>;
    setLessonUuid: React.Dispatch<React.SetStateAction<string>>;
    setOrdinaryNumber: React.Dispatch<React.SetStateAction<OrdinaryNumber>>;
    setDay: React.Dispatch<React.SetStateAction<Day>>;
    setLesson: React.Dispatch<React.SetStateAction<Lesson | LessonForTeacher | null>>

}

export const ScheduleContext = createContext<ScheduleContextProps | undefined>(undefined);

