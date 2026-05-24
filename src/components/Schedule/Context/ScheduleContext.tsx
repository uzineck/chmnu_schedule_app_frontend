import React, {createContext} from "react";
import {Subgroup} from "../../../models/enums/Subgroup.ts";
import {Day} from "../../../models/enums/Day.ts";
import {OrdinaryNumber} from "../../../models/enums/OrdinaryNumber.ts";
import {Lesson} from "../../../models/lesson/Lesson.ts";
import {LessonForTeacher} from "../../../models/lesson/LessonForTeacher.ts";
import {Group} from "../../../models/group/Group.ts";

export type ScheduleEditMode = 'admin' | 'headman';

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
    /**
     * Which schedule editor is the user currently acting in. Set by
     * AdminGroupScreen / HeadmanGroupScreen on mount. Lesson actions
     * branch on this instead of role (a user can hold both ADMIN/
     * SCHEDULE_MANAGER and HEADMAN roles; role inference would
     * misroute their writes — see project memory).
     */
    scheduleEditMode: ScheduleEditMode | null;
    setScheduleEditMode: React.Dispatch<React.SetStateAction<ScheduleEditMode | null>>;
    /**
     * Monotonic counter bumped by lesson modals / inline delete after a
     * successful write. Editable schedule screens include it in the key
     * passed to <GroupSchedule>, forcing a refetch without unmounting the
     * surrounding screen.
     */
    scheduleRefreshKey: number;
    bumpScheduleRefresh: () => void;
}

export const ScheduleContext = createContext<ScheduleContextProps | undefined>(undefined);

