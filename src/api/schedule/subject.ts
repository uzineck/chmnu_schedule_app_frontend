import qs from "qs";
import Http from "../index.ts";
import {ApiResponse} from "../../models/ApiResponse.ts";
import {Subject} from "../../models/subject/Subject.ts";
import {SubjectSchema} from "../../models/subject/request/SubjectSchema.ts";
import {StatusResponse} from "../../models/StatusResponse.ts";
import {ListPaginatedResponse, PaginationIn} from "../../models/ListPaginatedResponse.ts";
import {SearchFilter} from "../../models/filters/SearchFilter.ts";

const BASE_URL = '/schedule/subject';

export const getAllSubjects = (): Promise<ApiResponse<Subject[]>> => {
    return Http.get(`${BASE_URL}/all`);
}

export const getListOfSubjects = (
    filter: SearchFilter,
    pagination: PaginationIn,
): Promise<ApiResponse<ListPaginatedResponse<Subject>>> => {
    const queryParams = qs.stringify(
        { ...filter, ...pagination },
        { skipNulls: true },
    );
    return Http.get(`${BASE_URL}/?${queryParams}`);
}


export const createSubject = (body: SubjectSchema): Promise<ApiResponse<Subject>> => {
    return Http.post<SubjectSchema>(`${BASE_URL}/`, body);
}

export const updateSubject = (subjectUuid: string, body: SubjectSchema): Promise<ApiResponse<Subject>> => {
    return Http.patch<SubjectSchema>(`${BASE_URL}/${subjectUuid}/update`, body);
}

export const deleteSubject = (subjectUuid: string): Promise<ApiResponse<StatusResponse>> => {
    return Http.delete(`${BASE_URL}/${subjectUuid}`, {});
}