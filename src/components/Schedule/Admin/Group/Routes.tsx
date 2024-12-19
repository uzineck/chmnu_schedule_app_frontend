import GroupCard from "./GroupCard.tsx";
import CreateGroup from "./Forms/CreateGroup.tsx";
import UpdateGroupHeadman from "./Forms/UpdateGroupHeadman.tsx";
import GetGroupInfo from "./Forms/GetGroupInfo.tsx";

export const groupFormRoutes = [
    {
        path: "group",
        element: <GroupCard />,
        children: [
            { path: "get_group_info", element: <GetGroupInfo /> },
            { path: "create_group", element: <CreateGroup />},
            { path: "update_headman", element: <UpdateGroupHeadman />},
        ],
    },
]