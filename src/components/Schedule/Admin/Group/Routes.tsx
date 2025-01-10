import GroupCard from "./GroupCard.tsx";
import CreateGroup from "./Forms/CreateGroup.tsx";
import UpdateGroupHeadman from "./Forms/UpdateGroupHeadman.tsx";
import GetGroupInfo from "./Forms/GetGroupInfo.tsx";
import {ClientRole} from "../../../../models/enums/ClientRole.ts";
import ProtectedRoute from "../../../Routers/ProtectedRouter.tsx";

export const groupFormRoutes = [
    {
        path: "group",
        element:  <ProtectedRoute roles={[ClientRole.ADMIN, ClientRole.GROUP_MANAGER]}><GroupCard /></ProtectedRoute>,
        children: [
            { path: "get_group_info", element: <GetGroupInfo /> },
            { path: "create_group", element: <CreateGroup />},
            { path: "update_headman", element: <UpdateGroupHeadman />},
        ],
    },
]