import qs from 'qs';
import Http from "../index.ts";
import {ApiResponse} from "../../models/ApiResponse.ts";
import {Teacher} from "../../models/teacher/Teacher.ts";
import {TeacherFilter} from "../../models/filters/TeacherFilter.ts";
import {ListPaginatedResponse, PaginationIn} from "../../models/ListPaginatedResponse.ts";
import {TeacherWithLessons} from "../../models/teacher/TeacherWithLessons.ts";
import {CreateTeacherSchema} from "../../models/teacher/request/CreateTeacherSchema.ts";
import {TeacherNameSchema} from "../../models/teacher/request/TeacherNameSchema.ts";
import {TeacherRankSchema} from "../../models/teacher/request/TeacherRankSchema.ts";

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


export const getTeacherLessons = (teacherUuid: string, is_even: boolean): Promise<ApiResponse<TeacherWithLessons>> => {
    const queryParams = qs.stringify(
        {
            is_even,
        },
        { skipNulls: true }
    );
    return Http.get(`${BASE_URL}/${teacherUuid}/lessons?${queryParams}`);
}

export const createTeacher = (body: CreateTeacherSchema): Promise<ApiResponse<Teacher>> => {
    return Http.post<CreateTeacherSchema>(`${BASE_URL}/`, body);
};

export const updateTeacherName = (teacherUuid: string, body: TeacherNameSchema): Promise<ApiResponse<Teacher>> => {
    return Http.patch<TeacherNameSchema>(`${BASE_URL}/${teacherUuid}/update_name`, body);
};

export const updateTeacherRank = (teacherUuid: string, body: TeacherRankSchema): Promise<ApiResponse<Teacher>> => {
    return Http.patch<TeacherRankSchema>(`${BASE_URL}/${teacherUuid}/update_rank`, body);
};
