import Http from "../index.ts";
import {ApiResponse} from "../../models/ApiResponse.ts";
import {Lesson} from "../../models/lesson/Lesson.ts";
import {LessonSchema} from "../../models/lesson/request/LessonSchema.ts";
import {UpdatedLesson} from "../../models/lesson/UpdatedLesson.ts";

const BASE_URL = '/schedule/lesson';

export const createLesson = (body: LessonSchema): Promise<ApiResponse<Lesson>> => {
    return Http.post<LessonSchema>(`${BASE_URL}/`, body);
};

export const updateLesson = (lessonUuid: string, body: LessonSchema): Promise<ApiResponse<UpdatedLesson>> => {
    return Http.patch<LessonSchema>(`${BASE_URL}/${lessonUuid}/update`, body)
}