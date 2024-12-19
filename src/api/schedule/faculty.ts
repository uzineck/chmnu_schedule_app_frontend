import Http from "../index.ts";
import {ApiResponse} from "../../models/ApiResponse.ts";
import {Faculty} from "../../models/faculty/Faculty.ts";
import {FacultySchema} from "../../models/faculty/request/FacultySchema.ts";
import {FacultyNameSchema} from "../../models/faculty/request/FacultyNameSchema.ts";
import {FacultyCodeNameSchema} from "../../models/faculty/request/FacultyCodeNameSchema.ts";
import {StatusResponse} from "../../models/StatusResponse.ts";


const BASE_URL = '/schedule/faculty';

export const getAllFaculties = (): Promise<ApiResponse<Faculty[]>> => {
    return Http.get(`${BASE_URL}/all`);
}

export const createFaculty = (body: FacultySchema): Promise<ApiResponse<Faculty>> => {
    return Http.post<FacultySchema>(`${BASE_URL}/`, body);
}

export const updateFacultyName = (facultyUuid: string, body: FacultyNameSchema): Promise<ApiResponse<Faculty>> => {
    return Http.patch<FacultyNameSchema>(`${BASE_URL}/${facultyUuid}/update_name`, body);
}

export const updateFacultyCodeName = (facultyUuid: string, body: FacultyCodeNameSchema): Promise<ApiResponse<Faculty>> => {
    return Http.patch<FacultyCodeNameSchema >(`${BASE_URL}/${facultyUuid}/update_code_name`, body);
}

export const deleteFaculty = (facultyUuid: string): Promise<ApiResponse<StatusResponse>> => {
    return Http.delete(`${BASE_URL}/${facultyUuid}`, {});
}