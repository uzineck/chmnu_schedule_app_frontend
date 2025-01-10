import Http from "../index.ts";
import {ApiResponse} from "../../models/ApiResponse.ts";
import {ClientPrivate} from "../../models/client/ClientPrivate.ts";
import {UpdateClientRoleSchema} from "../../models/client/request/UpdateClientRoleSchema.ts";
import {SignUpSchema} from "../../models/client/request/SignUpSchema.ts";
import {StatusResponse} from "../../models/StatusResponse.ts";
import {UpdatePasswordSchemaAdmin} from "../../models/client/request/UpdatePasswordAdminSchema.ts";


const BASE_URL = '/clients/admin';

export const signUp = (body: SignUpSchema): Promise<ApiResponse<ClientPrivate>> => {
    return Http.post<SignUpSchema>(`${BASE_URL}/sign-up`, body)
}

export const getClientInfoAdmin = (clientEmail: string): Promise<ApiResponse<ClientPrivate>> => {
    return Http.get(`${BASE_URL}/${clientEmail}/info`);
};

export const updatePasswordAdmin = (clientEmail: string, body: UpdatePasswordSchemaAdmin): Promise<ApiResponse<StatusResponse>> => {
    return Http.patch<UpdatePasswordSchemaAdmin>(`${BASE_URL}/${clientEmail}/update_password`, body);
};

export const updateClietRoles = (clientEmail: string, body: UpdateClientRoleSchema): Promise<ApiResponse<ClientPrivate>> => {
    return Http.patch<UpdateClientRoleSchema>(`${BASE_URL}/${clientEmail}/update_roles`, body);
}