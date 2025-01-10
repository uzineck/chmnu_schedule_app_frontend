import {ScheduleOutlined} from "@ant-design/icons";
import {RiContactsBook2Fill} from "react-icons/ri";
import {HiUserGroup} from "react-icons/hi";
import {FaChalkboardTeacher, FaDoorClosed} from "react-icons/fa";
import {GiOpenBook} from "react-icons/gi";
import {FaBuildingColumns} from "react-icons/fa6";

export const managerMenuOptions = [
    {
        label: "Розклад студентів",
        key: "admin_schedule_manage",
        to: "/admin/schedule/manage/group",
        icon: <ScheduleOutlined />,
    },
    {
        label: "Клієнти",
        key: "admin_clients_manage",
        to: "/admin/schedule/manage/group",
        icon: <RiContactsBook2Fill />,
    },
    {
        label: "Групи",
        key: "admin_groups_manage",
        to: "/admin/schedule/manage/group",
        icon: <HiUserGroup />,
    },
    {
        label: "Викладачі",
        key: "admin_teachers_manage",
        to: "/admin/schedule/manage/group",
        icon: <FaChalkboardTeacher />,
    },
    {
        label: "Предмети",
        key: "admin_subjects_manage",
        to: "/admin/schedule/manage/group",
        icon: <GiOpenBook />,
    },
    {
        label: "Аудиторії",
        key: "admin_rooms_manage",
        to: "/admin/schedule/manage/group",
        icon: <FaDoorClosed />,
    },
    {
        label: "Панель факультетів",
        key: "admin_faculty_manage",
        to: "/admin/manage/faculty",
        icon: <FaBuildingColumns />,
    },
];