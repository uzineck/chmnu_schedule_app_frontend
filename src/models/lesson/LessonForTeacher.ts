import {Lesson} from "./Lesson.ts";
import {GroupForTeacher} from "../group/GroupForTeacher.ts";

export interface LessonForTeacher extends Omit<Lesson, 'teacher'> {
    groups: GroupForTeacher[];
}