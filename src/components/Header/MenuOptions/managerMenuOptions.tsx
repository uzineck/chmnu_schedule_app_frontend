import {RiContactsBook2Fill} from "react-icons/ri";
import {HiUserGroup} from "react-icons/hi";
import {FaChalkboardTeacher, FaDoorClosed} from "react-icons/fa";
import {GiOpenBook} from "react-icons/gi";
import {FaBuildingColumns} from "react-icons/fa6";
import {ScheduleOutlined} from "@ant-design/icons";

export const scheduleManagerMenuOptions = [
    {
        label: "Розклад студентів",
        key: "manager_schedule_manage",
        to: "/admin/manage/schedule/group",
        icon: <ScheduleOutlined />,
    },
];

export const clientManagerMenuOptions = [
    {
        label: "Панель клієнтів",
        key: "manager_clients_manage",
        to: "/admin/manage/client",
        icon: <RiContactsBook2Fill />,
    },
];


export const groupManagerMenuOptions = [
    {
        label: "Панель груп",
        key: "manager_groups_manage",
        to: "/admin/manage/group",
        icon: <HiUserGroup />,
    },
];

export const teacherManagerMenuOptions = [
    {
        label: "Панель викладачів",
        key: "manager_teachers_manage",
        to: "/admin/manage/teacher",
        icon: <FaChalkboardTeacher />,
    },
];

export const roomManagerMenuOptions = [
    {
        label: "Панель аудиторій",
        key: "manager_rooms_manage",
        to: "/admin/manage/room",
        icon: <FaDoorClosed />,
    },
];

export const subjectManagerMenuOptions = [
    {
        label: "Панель дисциплін",
        key: "manager_subjects_manage",
        to: "/admin/manage/subject",
        icon: <GiOpenBook />,
    },
];

export const facultyManagerMenuOptions = [
    {
        label: "Панель факультетів",
        key: "manager_faculty_manage",
        to: "/admin/manage/faculty",
        icon: <FaBuildingColumns />,
    },
];