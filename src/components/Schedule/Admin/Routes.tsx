import ProtectedRoute from "../../Routers/ProtectedRouter.tsx";
import {ClientRole} from "../../../models/enums/ClientRole.ts";
import AdminGroupScreen from "./AdminGroupScreen.tsx";
import {roomFormRoutes} from "./Room/Routes.tsx";
import {subjectFormRoutes} from "./Subject/Routes.tsx";
import {teacherFormRoutes} from "./Teacher/Routes.tsx";
import {clientFormRoutes} from "./Client/Routes.tsx";
import {groupFormRoutes} from "./Group/Routes.tsx";
import {Outlet} from "react-router-dom";

export const adminRoutes = [
    {
        path: "admin",
        element: <ProtectedRoute role={ClientRole.ADMIN}><Outlet /></ProtectedRoute>,
        children: [
            {
                path: "manage",
                children: [
                    {
                        path: "schedule",
                        children: [
                            {
                                path: "group",
                                children: [
                                    { index: true, element: <AdminGroupScreen /> },
                                    { path: ":groupUuid/lessons", element: <AdminGroupScreen />},
                                ]
                            },
                        ]
                    },
                    ...clientFormRoutes,
                    ...groupFormRoutes,
                    ...teacherFormRoutes,
                    ...subjectFormRoutes,
                    ...roomFormRoutes,
                ],
            },
        ],
    },
];