import GroupManagePage from "./GroupManagePage.tsx";
import { ClientRole } from "../../../../models/enums/ClientRole.ts";
import ProtectedRoute from "../../../Routers/ProtectedRouter.tsx";

export const groupFormRoutes = [
    {
        path: "group",
        element: (
            <ProtectedRoute roles={[ClientRole.ADMIN, ClientRole.GROUP_MANAGER]}>
                <GroupManagePage />
            </ProtectedRoute>
        ),
    },
];
