import qs from 'qs';
import Http from "../index.ts";
import {ApiResponse} from "../../models/ApiResponse.ts";
import {Teacher} from "../../models/teacher/Teacher.ts";
import {TeacherFilter} from "../../models/filters/TeacherFilter.ts";
import {ListPaginatedResponse, PaginationIn} from "../../models/ListPaginatedResponse.ts";
import {TeacherWithLessons} from "../../models/teacher/TeacherWithLessons.ts";

const BASE_URL = '/schedule/teacher';

export const getAllTeachers = (): Promise<ApiResponse<Teacher[]>> => {
    return Http.get(`${BASE_URL}/all`);
};


export const getListOfTeachers = (filter: TeacherFilter, pagination: PaginationIn): Promise<ApiResponse<ListPaginatedResponse<Teacher[]>>> => {
    const queryParams = qs.stringify(
        {
            ...filter,
            ...pagination,
        },
        { skipNulls: true }
    );
    return Http.get(`${BASE_URL}?${queryParams}`);
};


export const getTeacherLessons = (teacherUuid: string): Promise<ApiResponse<TeacherWithLessons>> => {
    return Http.get(`${BASE_URL}/${teacherUuid}/lessons`);
}