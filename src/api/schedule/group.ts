import Http from "../index.ts";
import {ApiResponse} from "../../models/ApiResponse.ts";
import {GroupWithFaculty} from "../../models/group/GroupWithFaculty.ts";
import {GroupWithLessons} from "../../models/group/GroupWithLessons.ts";
import qs from "qs";
import {Subgroup} from "../../models/enums/Subgroup.ts";

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
