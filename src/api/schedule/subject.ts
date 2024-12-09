import Http from "../index.ts";
import {ApiResponse} from "../../models/ApiResponse.ts";
import {Subject} from "../../models/subject/Subject.ts";
import {SubjectSchema} from "../../models/subject/request/SubjectSchema.ts";

const BASE_URL = '/schedule/subject';

export const getAllSubjects = (): Promise<ApiResponse<Subject[]>> => {
    return Http.get(`${BASE_URL}/all`);
}


export const createSubject = (body: SubjectSchema): Promise<ApiResponse<Subject>> => {
    return Http.post<SubjectSchema>(`${BASE_URL}/`, body);
}

export const updateSubject = (subjectUuid: string, body: SubjectSchema): Promise<ApiResponse<Subject>> => {
    return Http.patch<SubjectSchema>(`${BASE_URL}/${subjectUuid}/update`, body);
}