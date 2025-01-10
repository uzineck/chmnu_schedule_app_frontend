import CreateRoom from "./Forms/CreateRoom.tsx";
import UpdateRoomNumber from "./Forms/UpdateRoomNumber.tsx";
import DeleteRoom from "./Forms/DeleteRoom.tsx";
import RoomCard from "./RoomCard.tsx";
import {ClientRole} from "../../../../models/enums/ClientRole.ts";
import ProtectedRoute from "../../../Routers/ProtectedRouter.tsx";

export const roomFormRoutes = [
    {
        path: "room",
        element:  <ProtectedRoute roles={[ClientRole.ADMIN, ClientRole.ROOM_MANAGER]}><RoomCard /></ProtectedRoute>,
        children: [
            { path: "create_room", element: <CreateRoom /> },
            { path: "update_room_number", element: <UpdateRoomNumber /> },
            // { path: "update_room_description", element: <UpdateFacultyName /> },
            { path: "delete_room", element: <DeleteRoom /> },
        ],
    }
]