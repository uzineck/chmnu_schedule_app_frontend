import GroupCard from "./GroupCard.tsx";
import CreateGroup from "./Forms/CreateGroup.tsx";
import UpdateGroupHeadman from "./Forms/UpdateGroupHeadman.tsx";

export const groupFormRoutes = [
    {
        path: "group",
        element: <GroupCard />,
        children: [
            { path: "create_group", element: <CreateGroup />},
            { path: "update_headman", element: <UpdateGroupHeadman />},
        ],
    },
]