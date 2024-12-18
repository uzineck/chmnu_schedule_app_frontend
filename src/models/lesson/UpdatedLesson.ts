import {Lesson} from "./Lesson.ts";

export interface UpdatedLesson {
    updated_lesson: Lesson;
    old_lesson: Lesson;
}