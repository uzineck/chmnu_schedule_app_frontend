import React, {createContext} from "react";
import {Subgroup} from "../../../models/enums/Subgroup.ts";
import {Day} from "../../../models/enums/Day.ts";
import {OrdinaryNumber} from "../../../models/enums/OrdinaryNumber.ts";
import {Lesson} from "../../../models/lesson/Lesson.ts";
import {LessonForTeacher} from "../../../models/lesson/LessonForTeacher.ts";
import {Group} from "../../../models/group/Group.ts";

interface ScheduleContextProps {
    groupUuid: string;
    setGroupUuid: React.Dispatch<React.SetStateAction<string>>;
    lessonUuid: string;
    setLessonUuid: React.Dispatch<React.SetStateAction<string>>;
    group: Group | null;
    setGroup: React.Dispatch<React.SetStateAction<Group | null>>;
    lesson: Lesson | LessonForTeacher | null;
    setLesson: React.Dispatch<React.SetStateAction<Lesson | LessonForTeacher | null>>
    subgroup: Subgroup | null;
    setSubgroup: React.Dispatch<React.SetStateAction<Subgroup | null>>;
    setIsEvenWeek: React.Dispatch<React.SetStateAction<boolean>>;
    isEvenWeek: boolean;
    day: Day | null;
    setDay: React.Dispatch<React.SetStateAction<Day | null>>;
    ordinaryNumber: OrdinaryNumber | null;
    setOrdinaryNumber: React.Dispatch<React.SetStateAction<OrdinaryNumber | null>>;

}

export const ScheduleContext = createContext<ScheduleContextProps | undefined>(undefined);

