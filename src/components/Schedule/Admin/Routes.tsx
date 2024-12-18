import ProtectedRoute from "../../Routers/ProtectedRouter.tsx";
import {ClientRole} from "../../../models/enums/ClientRole.ts";
import AdminPanel from "./AdminPanel.tsx";
import AdminGroupScreen from "./AdminGroupScreen.tsx";

export const adminRoutes = [
    {
        path: "admin",
        children: [
            { index: true, element: <ProtectedRoute role={ClientRole.ADMIN}><AdminPanel/></ProtectedRoute> },
            {
                path: "schedule",
                children: [
                    {
                        path: "manage",
                        children: [
                            {
                                path: "group",
                                children: [
                                    { index: true, element: <AdminGroupScreen /> },
                                    { path: ":groupUuid/lessons", element: <AdminGroupScreen />},
                                ]
                            },
                        ]
                    }
                ]}
        ],
    },
];