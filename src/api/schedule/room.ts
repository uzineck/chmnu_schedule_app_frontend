import Http from "../index.ts";
import {ApiResponse} from "../../models/ApiResponse.ts";
import {Room} from "../../models/room/Room.ts";
import {RoomNumberSchema} from "../../models/room/request/RoomNumberSchema.ts";
import {RoomDescriptionSchema} from "../../models/room/request/RoomDescriptionSchema.ts";


const BASE_URL = '/schedule/room';

export const getAllRooms = (): Promise<ApiResponse<Room[]>> => {
    return Http.get(`${BASE_URL}/all`);
}


export const createRoom = (body: RoomNumberSchema): Promise<ApiResponse<Room>> => {
    return Http.post<RoomNumberSchema>(`${BASE_URL}/`, body);
}

export const updateRoomNumber = (roomUuid: string, body: RoomNumberSchema): Promise<ApiResponse<Room>> => {
    return Http.patch<RoomNumberSchema>(`${BASE_URL}/${roomUuid}/update_number`, body);
}

export const updateRoomDescription = (roomUuid: string, body: RoomDescriptionSchema): Promise<ApiResponse<Room>> => {
    return Http.patch<RoomDescriptionSchema>(`${BASE_URL}/${roomUuid}/update_description`, body);
}