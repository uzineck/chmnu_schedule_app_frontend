import Http from "../index.ts";
import {ApiResponse} from "../../models/ApiResponse.ts";
import {GroupWithFaculty} from "../../models/group/GroupWithFaculty.ts";
import {GroupWithLessons} from "../../models/group/GroupWithLessons.ts";
import qs from "qs";
import {Subgroup} from "../../models/enums/Subgroup.ts";
import {GroupWithHeadman} from "../../models/group/GroupWithHeadman.ts";
import {CreateGroupSchema} from "../../models/group/requests/CreateGroupSchema.ts";
import {UpdateGroupHeadmanSchema} from "../../models/group/requests/UpdateGroupHeadmanSchema.ts";
import {StatusResponse} from "../../models/StatusResponse.ts";

const BASE_URL = '/schedule/group';

export const getAllGroups = (): Promise<ApiResponse<GroupWithFaculty[]>> => {
    return Http.get(`${BASE_URL}/all`);
}

export const getGroupLessons = (groupUuid: string, subgroup: Subgroup, is_even: boolean): Promise<ApiResponse<GroupWithLessons>> => {
    const queryParams = qs.stringify(
        {
            subgroup,
            is_even,
        },
        { skipNulls: true }
    );
    return Http.get(`${BASE_URL}/${groupUuid}/lessons?${queryParams}`);
}

export const getGroupInfo = (groupUuid: string): Promise<ApiResponse<GroupWithHeadman>> => {
    return Http.get(`${BASE_URL}/${groupUuid}/info`);
}

export const getHeadmanInfo = (headmanEmail: string): Promise<ApiResponse<GroupWithHeadman>> => {
    return Http.get(`${BASE_URL}/${headmanEmail}/headman_info`);
}

export const createGroup = (body: CreateGroupSchema): Promise<ApiResponse<GroupWithHeadman>> => {
    return Http.post<CreateGroupSchema>(`${BASE_URL}/`, body);
}

export const updateGroupHeadman = (groupUuid: string, body: UpdateGroupHeadmanSchema): Promise<ApiResponse<GroupWithHeadman>> => {
    return Http.patch<UpdateGroupHeadmanSchema>(`${BASE_URL}/${groupUuid}/update_headman`, body);
}

export const addLessonToGroupAdmin = (groupUuid: string, lessonUuid: string, subgroup: Subgroup): Promise<ApiResponse<StatusResponse>> => {
    const queryParams = qs.stringify(
        {
            subgroup,
        },
        { skipNulls: true }
    );
    return Http.patch(`${BASE_URL}/${groupUuid}/add/${lessonUuid}?${queryParams}`, {});
}

export const removeLessonFromGroupAdmin = (groupUuid: string, lessonUuid: string, subgroup: Subgroup): Promise<ApiResponse<StatusResponse>> => {
    const queryParams = qs.stringify(
        {
            subgroup,
        },
        { skipNulls: true }
    );
    return Http.patch(`${BASE_URL}/${groupUuid}/remove/${lessonUuid}?${queryParams}`, {});
}

export const addLessonToGroupHeadman = (lessonUuid: string, subgroup: Subgroup): Promise<ApiResponse<StatusResponse>> => {
    const queryParams = qs.stringify(
        {
            subgroup,
        },
        { skipNulls: true }
    );
    return Http.patch(`${BASE_URL}/add/${lessonUuid}?${queryParams}`, {});
}

export const removeLessonToGroupHeadman = (lessonUuid: string, subgroup: Subgroup): Promise<ApiResponse<StatusResponse>> => {
    const queryParams = qs.stringify(
        {
            subgroup,
        },
        { skipNulls: true }
    );
    return Http.patch(`${BASE_URL}/remove/${lessonUuid}?${queryParams}`, {});
}