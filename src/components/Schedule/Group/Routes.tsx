import GroupScreen from "./GroupScreen.tsx";
import {headmanRoutes} from "../Headman/Routes.tsx";


export const groupRoutes = [
    {
        path: "group",
        children: [
            { index: true, element: <GroupScreen /> },
            {  path: ":groupUuid/lessons", element: <GroupScreen /> },
            ...headmanRoutes,
        ],
    },
];