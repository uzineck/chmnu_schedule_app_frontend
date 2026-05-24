import RoomManagePage from "./RoomManagePage.tsx";
import { ClientRole } from "../../../../models/enums/ClientRole.ts";
import ProtectedRoute from "../../../Routers/ProtectedRouter.tsx";

export const roomFormRoutes = [
    {
        path: "room",
        element: (
            <ProtectedRoute roles={[ClientRole.ADMIN, ClientRole.ROOM_MANAGER]}>
                <RoomManagePage />
            </ProtectedRoute>
        ),
    },
];
