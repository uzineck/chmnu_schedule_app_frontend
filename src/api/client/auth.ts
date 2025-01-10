import Http from "../index.ts";
import {ApiResponse} from "../../models/ApiResponse.ts";
import {LoginSchema} from "../../models/client/request/LoginSchema.ts";
import {Token} from "../../models/client/Token.ts";
import {StatusResponse} from "../../models/StatusResponse.ts";

const BASE_URL = '/clients/client';

export const login = (body: LoginSchema): Promise<ApiResponse<Token>> => {
    return Http.post<LoginSchema>(`${BASE_URL}/log-in`, body);
};

export const updateAccessToken = (): Promise<ApiResponse<Token>> => {
    return Http.post(`${BASE_URL}/update_access_token`, {});
};

export const logout = (): Promise<ApiResponse<StatusResponse>> => {
    return Http.post(`${BASE_URL}/log-out`, {})
}
