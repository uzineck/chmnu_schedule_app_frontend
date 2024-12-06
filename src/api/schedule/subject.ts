import Http from "../index.ts";
import {ApiResponse} from "../../models/ApiResponse.ts";
import {Subject} from "../../models/subject/Subject.ts";

const BASE_URL = '/schedule/subject';

export const getAllSubjects = (): Promise<ApiResponse<Subject[]>> => {
    return Http.get(`${BASE_URL}/all`);
};