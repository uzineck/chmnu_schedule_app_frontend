import Http from "../index.ts";
import {ApiResponse} from "../../models/ApiResponse.ts";
import {Group} from "../../models/group/Group.ts";
import {GroupWithLessons} from "../../models/group/GroupWithLessons.ts";
import qs from "qs";
import {Subgroup} from "../../models/enums/Subgroup.ts";
import {GroupWithHeadman} from "../../models/group/GroupWithHeadman.ts";
import {CreateGroupSchema} from "../../models/group/requests/CreateGroupSchema.ts";
import {UpdateGroupHeadmanSchema} from "../../models/group/requests/UpdateGroupHeadmanSchema.ts";
import {StatusResponse} from "../../models/StatusResponse.ts";
import {ListPaginatedResponse, PaginationIn} from "../../models/ListPaginatedResponse.ts";
import {SearchFilter} from "../../models/filters/SearchFilter.ts";

const BASE_URL = '/schedule/group';

export const getAllGroups = (): Promise<ApiResponse<Group[]>> => {
    return Http.get(`${BASE_URL}/all`);
}

export const getListOfGroups = (
    filter: SearchFilter,
    pagination: PaginationIn,
): Promise<ApiResponse<ListPaginatedResponse<GroupWithHeadman>>> => {
    const queryParams = qs.stringify(
        { ...filter, ...pagination },
        { skipNulls: true },
    );
    return Http.get(`${BASE_URL}/?${queryParams}`);
}

export const deleteGroup = (groupUuid: string): Promise<ApiResponse<StatusResponse>> => {
    return Http.delete(`${BASE_URL}/${groupUuid}`, {});
}

export const getGroupLessons = (groupUuid: string, subgroup: Subgroup | null, is_even: boolean): Promise<ApiResponse<GroupWithLessons>> => {
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

export const getHeadmanGroup = (): Promise<ApiResponse<Group>> => {
    return Http.get(`${BASE_URL}/headman_group`);
}

export const createGroup = (body: CreateGroupSchema): Promise<ApiResponse<GroupWithHeadman>> => {
    return Http.post<CreateGroupSchema>(`${BASE_URL}/`, body);
}

export const updateGroupHeadman = (groupUuid: string, body: UpdateGroupHeadmanSchema): Promise<ApiResponse<GroupWithHeadman>> => {
    return Http.patch<UpdateGroupHeadmanSchema>(`${BASE_URL}/${groupUuid}/update_headman`, body);
}

export const addLessonToGroupAdmin = (groupUuid: string, lessonUuid: string, subgroup: Subgroup | null): Promise<ApiResponse<StatusResponse>> => {
    const queryParams = qs.stringify(
        {
            subgroup,
        },
        { skipNulls: true }
    );
    return Http.patch(`${BASE_URL}/${groupUuid}/add/${lessonUuid}?${queryParams}`, {});
}

export const updateLessonInGroupAdmin = (groupUuid: string, lessonUuid: string, oldLessonUuid: string, subgroup: Subgroup | null): Promise<ApiResponse<StatusResponse>> => {
    const queryParams = qs.stringify(
        {
            subgroup,
        },
        { skipNulls: true }
    );
    return Http.patch(`${BASE_URL}/${groupUuid}/${oldLessonUuid}/update/${lessonUuid}?${queryParams}`, {});
}

export const removeLessonFromGroupAdmin = (groupUuid: string, lessonUuid: string, subgroup: Subgroup | null): Promise<ApiResponse<StatusResponse>> => {
    const queryParams = qs.stringify(
        {
            subgroup,
        },
        { skipNulls: true }
    );
    return Http.patch(`${BASE_URL}/${groupUuid}/remove/${lessonUuid}?${queryParams}`, {});
}

export const addLessonToGroupHeadman = (lessonUuid: string, subgroup: Subgroup | null): Promise<ApiResponse<StatusResponse>> => {
    const queryParams = qs.stringify(
        {
            subgroup,
        },
        { skipNulls: true }
    );
    return Http.patch(`${BASE_URL}/add/${lessonUuid}?${queryParams}`, {});
}

export const updateLessonInGroupHeadman = (lessonUuid: string, oldLessonUuid: string, subgroup: Subgroup | null): Promise<ApiResponse<StatusResponse>> => {
    const queryParams = qs.stringify(
        {
            subgroup,
        },
        { skipNulls: true }
    );
    return Http.patch(`${BASE_URL}/${oldLessonUuid}/update/${lessonUuid}?${queryParams}`, {});
}

export const removeLessonToGroupHeadman = (lessonUuid: string, subgroup: Subgroup | null): Promise<ApiResponse<StatusResponse>> => {
    const queryParams = qs.stringify(
        {
            subgroup,
        },
        { skipNulls: true }
    );
    return Http.patch(`${BASE_URL}/remove/${lessonUuid}?${queryParams}`, {});
}