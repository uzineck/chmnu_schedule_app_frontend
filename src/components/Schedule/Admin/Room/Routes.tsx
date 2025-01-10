import CreateRoom from "./Forms/CreateRoom.tsx";
import UpdateRoomNumber from "./Forms/UpdateRoomNumber.tsx";
import DeleteRoom from "./Forms/DeleteRoom.tsx";
import RoomCard from "./RoomCard.tsx";

export const roomFormRoutes = [
    {
        path: "room",
        element: <RoomCard />,
        children: [
            { path: "create_room", element: <CreateRoom /> },
            { path: "update_room_number", element: <UpdateRoomNumber /> },
            // { path: "update_room_description", element: <UpdateFacultyName /> },
            { path: "delete_room", element: <DeleteRoom /> },
        ],
    }
]