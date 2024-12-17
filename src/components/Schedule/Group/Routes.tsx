import GroupScreen from "./GroupScreen.tsx";
import ProtectedRoute from "../../Routers/ProtectedRouter.tsx";
import {ClientRole} from "../../../models/enums/ClientRole.ts";
import HeadmanGroupScreen from "./Headman/HeadmanGroupScreen.tsx";


export const groupRoutes = [
    {
        path: "group",
        children: [
            { index: true, element: <GroupScreen /> },
            {  path: ":groupUuid/lessons", element: <GroupScreen /> },
            {
                path: "manage",
                element: <ProtectedRoute role={ClientRole.HEADMAN}><HeadmanGroupScreen /></ProtectedRoute>
            }
        ],
    },
];