import {Lesson} from "../lesson/Lesson.ts";
import {GroupWithSubgroup} from "./GroupWithSubgroup.ts";

export interface GroupWithLessons{
    group: GroupWithSubgroup;
    lessons: Lesson[] | null;
}