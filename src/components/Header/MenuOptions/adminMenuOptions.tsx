import {ScheduleOutlined} from "@ant-design/icons";
import {HiUserGroup} from "react-icons/hi";
import {FaChalkboardTeacher, FaDoorClosed} from "react-icons/fa";
import {GiOpenBook} from "react-icons/gi";
import {RiContactsBook2Fill} from "react-icons/ri";
import {FaBuildingColumns} from "react-icons/fa6";

export const adminMenuOptions = [
    {
        label: "Розклад студентів",
        key: "admin_schedule_manage",
        to: "/admin/manage/schedule/group",
        icon: <ScheduleOutlined />,
    },
    {
        label: "Панель клієнтів",
        key: "admin_clients_manage",
        to: "/admin/manage/client",
        icon: <RiContactsBook2Fill />,
    },
    {
        label: "Панель груп",
        key: "admin_groups_manage",
        to: "/admin/manage/group",
        icon: <HiUserGroup />,
    },
    {
        label: "Панель викладачів",
        key: "admin_teachers_manage",
        to: "/admin/manage/teacher",
        icon: <FaChalkboardTeacher />,
    },
    {
        label: "Панель дисциплін",
        key: "admin_subjects_manage",
        to: "/admin/manage/subject",
        icon: <GiOpenBook />,
    },
    {
        label: "Панель аудиторій",
        key: "admin_rooms_manage",
        to: "/admin/manage/room",
        icon: <FaDoorClosed />,
    },
    {
        label: "Панель факультетів",
        key: "admin_faculty_manage",
        to: "/admin/manage/faculty",
        icon: <FaBuildingColumns />,
    },
];