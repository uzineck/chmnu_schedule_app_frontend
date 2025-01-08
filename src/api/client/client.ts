import Http from "../index.ts";
import {ApiResponse} from "../../models/ApiResponse.ts";
import {UpdatePasswordSchema} from "../../models/client/request/UpdatePasswordSchema.ts";
import {UpdateCredentialsSchema} from "../../models/client/request/UpdateCredentialsSchema.ts";
import {UpdateEmailSchema} from "../../models/client/request/UpdateEmailSchema.ts";
import {StatusResponse} from "../../models/StatusResponse.ts";
import {ClientPrivate} from "../../models/client/ClientPrivate.ts";
import {UpdateClientRoleSchema} from "../../models/client/request/UpdateClientRoleSchema.ts";
import {ClientWithToken} from "../../models/client/ClientWithToken.ts";

const BASE_URL = '/clients/client';

export const getClientInfo = (): Promise<ApiResponse<ClientPrivate>> => {
    return Http.get(`${BASE_URL}/info`);
};

export const getClientInfoAdmin = (clientEmail: string): Promise<ApiResponse<ClientPrivate>> => {
    return Http.get(`${BASE_URL}/${clientEmail}/info`);
};


export const updatePassword = (body: UpdatePasswordSchema): Promise<ApiResponse<StatusResponse>> => {
    return Http.patch<UpdatePasswordSchema>(`${BASE_URL}/update_password`, body);
};

export const updateEmail = (body: UpdateEmailSchema): Promise<ApiResponse<ClientWithToken>> => {
    return Http.patch<UpdateEmailSchema>(`${BASE_URL}/update_email`, body);
};

export const updateCredentials = (body: UpdateCredentialsSchema): Promise<ApiResponse<ClientPrivate>> => {
    return Http.patch<UpdateCredentialsSchema>(`${BASE_URL}/update_credentials`, body);
};

export const updateClietRole = (clientEmail: string, body: UpdateClientRoleSchema): Promise<ApiResponse<ClientPrivate>> => {
    return Http.patch<UpdateClientRoleSchema>(`${BASE_URL}/${clientEmail}/update_role`, body);
}