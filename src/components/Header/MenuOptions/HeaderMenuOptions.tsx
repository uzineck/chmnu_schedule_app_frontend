import {LogoutOutlined, UserOutlined} from "@ant-design/icons";
import {ClientRole} from "../../../models/enums/ClientRole.ts";
import {ClientPrivate} from "../../../models/client/ClientPrivate.ts";
import {adminMenuOptions} from "./adminMenuOptions.tsx";
import {headmanMenuOptions} from "./headmanMenuOptions.tsx";
import {
    clientManagerMenuOptions, facultyManagerMenuOptions,
    groupManagerMenuOptions, roomManagerMenuOptions, scheduleManagerMenuOptions,
    subjectManagerMenuOptions,
    teacherManagerMenuOptions
} from "./managerMenuOptions.tsx";

const roleBasedMenu = [
    { roles: [ClientRole.ADMIN], options: adminMenuOptions },
    { roles: [ClientRole.HEADMAN], options: headmanMenuOptions },
    { roles: [ClientRole.SCHEDULE_MANAGER], options: scheduleManagerMenuOptions },
    { roles: [ClientRole.CLIENT_MANAGER], options: clientManagerMenuOptions },
    { roles: [ClientRole.GROUP_MANAGER], options: groupManagerMenuOptions },
    { roles: [ClientRole.TEACHER_MANAGER], options: teacherManagerMenuOptions },
    { roles: [ClientRole.SUBJECT_MANAGER], options: subjectManagerMenuOptions },
    { roles: [ClientRole.ROOM_MANAGER], options: roomManagerMenuOptions },
    { roles: [ClientRole.FACULTY_MANAGER], options: facultyManagerMenuOptions },
];

export const menuOptions = (client: ClientPrivate | null)=>  [
    {
        label: "Профіль",
        key: "profile",
        to: "/profile",
        icon: <UserOutlined />,
    },
    ...roleBasedMenu.flatMap(({ roles, options }) =>
        roles.some((role) => client?.roles.includes(role)) ? options : []
    ),
    {
        label: "Вийти",
        key: "logout",
        to: "/logout",
        icon: <LogoutOutlined />,
    },
];
