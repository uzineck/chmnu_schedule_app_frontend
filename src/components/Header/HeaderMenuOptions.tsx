import {ContactsOutlined, LogoutOutlined, ScheduleOutlined, UserOutlined} from "@ant-design/icons";
import {ClientRole} from "../../models/enums/ClientRole.ts";
import {ClientPrivate} from "../../models/client/ClientPrivate.ts";

export const menuOptions = (client: ClientPrivate | null)=>  [
    {
        label: "Profile",
        key: "profile",
        to: "/profile",
        icon: <UserOutlined />,
    },
    ...(client?.role === ClientRole.HEADMAN
        ? [
            {
                label: "Manage Group Lessons",
                key: "group_lessons_manage",
                to: "/group/manage",
                icon: <ScheduleOutlined />,
            },
        ]
        : []),
    ...(client?.role === ClientRole.ADMIN
        ? [
            {
                label: "Admin Panel",
                key: "admin",
                to: "/admin",
                icon: <ContactsOutlined />,
            },
        ]
        : []),
    ...(client?.role === ClientRole.MANAGER
     ? [
            {
                label: "Manager Panel",
                key: "manager",
                to: "/manager",
                icon: <UserOutlined />,
            }
        ]
        : []),
    {
        label: "Logout",
        key: "logout",
        to: "/logout",
        icon: <LogoutOutlined />,
    },
];
