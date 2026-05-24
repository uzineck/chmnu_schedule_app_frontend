import ClientManagePage from "./ClientManagePage.tsx";
import { ClientRole } from "../../../../models/enums/ClientRole.ts";
import ProtectedRoute from "../../../Routers/ProtectedRouter.tsx";

export const clientFormRoutes = [
    {
        path: "client",
        element: (
            <ProtectedRoute roles={[ClientRole.ADMIN, ClientRole.CLIENT_MANAGER]}>
                <ClientManagePage />
            </ProtectedRoute>
        ),
    },
];
