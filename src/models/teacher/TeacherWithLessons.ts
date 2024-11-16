import {Teacher} from "./Teacher.ts";
import {LessonForTeacher} from "../lesson/LessonForTeacher.ts";

export interface TeacherWithLessons {
  teacher: Teacher;
  lessons: LessonForTeacher[] | null;
}