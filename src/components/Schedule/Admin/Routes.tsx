import ProtectedRoute from "../../Routers/ProtectedRouter.tsx";
import {ClientRole} from "../../../models/enums/ClientRole.ts";
import AdminGroupScreen from "./AdminGroupScreen.tsx";
import {roomFormRoutes} from "./Room/Routes.tsx";
import {subjectFormRoutes} from "./Subject/Routes.tsx";
import {teacherFormRoutes} from "./Teacher/Routes.tsx";
import {clientFormRoutes} from "./Client/Routes.tsx";
import {groupFormRoutes} from "./Group/Routes.tsx";
import {Outlet} from "react-router-dom";
import {facultyFormRoutes} from "./Faculty/Routes.tsx";
import {lessonChildRoutes} from "../Lesson/Routes.tsx";

export const adminRoutes = [
    {
        path: "admin",
        element: <Outlet />,
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
                                    { index: true, element: <ProtectedRoute roles={[ClientRole.ADMIN, ClientRole.SCHEDULE_MANAGER]}><AdminGroupScreen /></ProtectedRoute>},
                                    {
                                        path: ":groupUuid/lessons",
                                        element: <ProtectedRoute roles={[ClientRole.ADMIN, ClientRole.SCHEDULE_MANAGER]}><AdminGroupScreen /></ProtectedRoute>,
                                        children: lessonChildRoutes,
                                    },
                                ]
                            },
                        ]
                    },
                    ...clientFormRoutes,
                    ...groupFormRoutes,
                    ...teacherFormRoutes,
                    ...subjectFormRoutes,
                    ...roomFormRoutes,
                    ...facultyFormRoutes,
                ],
            },
        ],
    },
];