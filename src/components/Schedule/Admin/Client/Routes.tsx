import ClientCard from "../Client/ClientCard.tsx";
import SignUp from "./Forms/SignUp.tsx";
import GetClientInfo from "./Forms/GetClientInfo.tsx";
import {ClientRole} from "../../../../models/enums/ClientRole.ts";
import ProtectedRoute from "../../../Routers/ProtectedRouter.tsx";
import UpdateClientRoles from "./Forms/UpdateClientRoles.tsx";

export const clientFormRoutes =[
    {
        path: "client",
        element: <ProtectedRoute roles={[ClientRole.ADMIN, ClientRole.CLIENT_MANAGER]}><ClientCard /></ProtectedRoute>,
        children: [
            { path: "get_client_info", element: <GetClientInfo />},
            { path: "create_client", element: <SignUp />},
            { path: "update_client_roles", element: <UpdateClientRoles />},
        ],
    },
]