import Http from "../index.ts";
import {ApiResponse} from "../../models/ApiResponse.ts";
import {ClientWithToken} from "../../models/client/ClientWithToken.ts";
import {LoginSchema} from "../../models/client/request/LoginSchema.ts";
import {Token} from "../../models/client/Token.ts";
import {TokenSchema} from "../../models/client/request/TokenSchema.ts";
import {StatusResponse} from "../../models/StatusResponse.ts";
import {SignUpSchema} from "../../models/client/request/SignUpSchema.ts";

const BASE_URL = '/clients/client';

export const login = (body: LoginSchema): Promise<ApiResponse<ClientWithToken>> => {
    return Http.post<LoginSchema>(`${BASE_URL}/log-in`, body);
};

export const updateAccessToken = (body: TokenSchema): Promise<ApiResponse<Token>> => {
    return Http.post<TokenSchema>(`${BASE_URL}/update_access_token`, body);
};

export const logout = (): Promise<ApiResponse<StatusResponse>> => {
    return Http.post(`${BASE_URL}/log-out`, {})
}


export const signUp = (body: SignUpSchema) : Promise<ApiResponse<StatusResponse>> => {
    return Http.post<SignUpSchema>(`${BASE_URL}/sign-up`, body)
}
