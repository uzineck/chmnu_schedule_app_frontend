import Http from "../index.ts";
import {ApiResponse} from "../../models/ApiResponse.ts";
import {TimeInfo} from "../../models/time/TimeInfo.ts";

const BASE_URL = '/time/time';

export const getCurrentTime = (): Promise<ApiResponse<TimeInfo>> => {
    return Http.get(`${BASE_URL}/current`);
};
