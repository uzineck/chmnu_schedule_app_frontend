import {Group} from "./Group.ts";
import {Lesson} from "../lesson/Lesson.ts";

export interface GroupWithLessons{
    group: Group;
    lessons: Lesson[] | null;
}