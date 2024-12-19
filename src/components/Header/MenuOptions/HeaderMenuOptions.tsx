import {LogoutOutlined, UserOutlined} from "@ant-design/icons";
import {ClientRole} from "../../../models/enums/ClientRole.ts";
import {ClientPrivate} from "../../../models/client/ClientPrivate.ts";
import {adminMenuOptions} from "./adminMenuOptions.tsx";
import {headmanMenuOptions} from "./headmanMenuOptions.tsx";
import {managerMenuOptions} from "./managerMenuOptions.tsx";

export const menuOptions = (client: ClientPrivate | null)=>  [
    {
        label: "Profile",
        key: "profile",
        to: "/profile",
        icon: <UserOutlined />,
    },
    ...(client?.role === ClientRole.HEADMAN ? headmanMenuOptions : []),
    ...(client?.role === ClientRole.ADMIN ? adminMenuOptions : []),
    ...(client?.role === ClientRole.MANAGER ? managerMenuOptions : []),
    {
        label: "Logout",
        key: "logout",
        to: "/logout",
        icon: <LogoutOutlined />,
    },
];
