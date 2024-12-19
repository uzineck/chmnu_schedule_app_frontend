import {ScheduleOutlined} from "@ant-design/icons";
import {HiUserGroup} from "react-icons/hi";
import {FaChalkboardTeacher, FaDoorClosed} from "react-icons/fa";
import {GiOpenBook} from "react-icons/gi";
import {RiContactsBook2Fill} from "react-icons/ri";

export const adminMenuOptions = [
    {
        label: "Manage Schedule",
        key: "admin_schedule_manage",
        to: "/admin/manage/schedule/group",
        icon: <ScheduleOutlined />,
    },
    {
        label: "Manage Clients",
        key: "admin_clients_manage",
        to: "/admin/manage/client",
        icon: <RiContactsBook2Fill />,
    },
    {
        label: "Manage Groups",
        key: "admin_groups_manage",
        to: "/admin/manage/group",
        icon: <HiUserGroup />,
    },
    {
        label: "Manage Teachers",
        key: "admin_teachers_manage",
        to: "/admin/manage/teacher",
        icon: <FaChalkboardTeacher />,
    },
    {
        label: "Manage Subjects",
        key: "admin_subjects_manage",
        to: "/admin/manage/subject",
        icon: <GiOpenBook />,
    },
    {
        label: "Manage Rooms",
        key: "admin_rooms_manage",
        to: "/admin/manage/room",
        icon: <FaDoorClosed />,
    },
];