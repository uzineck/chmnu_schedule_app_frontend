import qs from "qs";
import Http from "../index.ts";
import {ApiResponse} from "../../models/ApiResponse.ts";
import {Room} from "../../models/room/Room.ts";
import {RoomNumberSchema} from "../../models/room/request/RoomNumberSchema.ts";
import {RoomDescriptionSchema} from "../../models/room/request/RoomDescriptionSchema.ts";
import {StatusResponse} from "../../models/StatusResponse.ts";
import {ListPaginatedResponse, PaginationIn} from "../../models/ListPaginatedResponse.ts";
import {SearchFilter} from "../../models/filters/SearchFilter.ts";


const BASE_URL = '/schedule/room';

export const getAllRooms = (): Promise<ApiResponse<Room[]>> => {
    return Http.get(`${BASE_URL}/all`);
}

export const getListOfRooms = (
    filter: SearchFilter,
    pagination: PaginationIn,
): Promise<ApiResponse<ListPaginatedResponse<Room>>> => {
    const queryParams = qs.stringify(
        { ...filter, ...pagination },
        { skipNulls: true },
    );
    return Http.get(`${BASE_URL}/?${queryParams}`);
}


export const createRoom = (body: RoomNumberSchema): Promise<ApiResponse<Room>> => {
    return Http.post<RoomNumberSchema>(`${BASE_URL}/`, body);
}

export const updateRoomNumber = (roomUuid: string, body: RoomNumberSchema): Promise<ApiResponse<Room>> => {
    return Http.patch<RoomNumberSchema>(`${BASE_URL}/${roomUuid}/update_number`, body);
}

export const updateRoomDescription = (roomUuid: string, body: RoomDescriptionSchema): Promise<ApiResponse<Room>> => {
    return Http.patch<RoomDescriptionSchema >(`${BASE_URL}/${roomUuid}/update_description`, body);
}

export const deleteRoom = (roomUuid: string): Promise<ApiResponse<StatusResponse>> => {
    return Http.delete(`${BASE_URL}/${roomUuid}`, {});
}