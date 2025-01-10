export enum ClientRole {
    ADMIN = "admin",
    HEADMAN = "headman",
    CLIENT_MANAGER = "client_manager",
    FACULTY_MANAGER = "faculty_manager",
    ROOM_MANAGER = "room_manager",
    SUBJECT_MANAGER = "subject_manager",
    TEACHER_MANAGER = "teacher_manager",
    GROUP_MANAGER = "group_manager",
    SCHEDULE_MANAGER = "schedule_manager",
}

export const clientRoleOptionsUa = [
    { value: ClientRole.ADMIN, label: "Адмін" },
    { value: ClientRole.HEADMAN, label: "Староста" },
    { value: ClientRole.CLIENT_MANAGER, label: "Менеджер клієнтів" },
    { value: ClientRole.FACULTY_MANAGER, label: "Менеджер факультетів" },
    { value: ClientRole.ROOM_MANAGER, label: "Менеджер аудиторій" },
    { value: ClientRole.TEACHER_MANAGER, label: "Менеджер викладачів" },
    { value: ClientRole.SUBJECT_MANAGER, label: "Менеджер дисциплін" },
    { value: ClientRole.GROUP_MANAGER, label: "Менеджер груп" },
    { value: ClientRole.SCHEDULE_MANAGER, label: "Менеджер розкладу" },
];

export const getClientRoleLabels = (roles: ClientRole[] | undefined): string => {
    if (!roles || roles.length === 0) {
        return "Невідома роль";
    }

    const labels = roles
        .map(role => {
            const option = clientRoleOptionsUa.find(option => option.value === role);
            return option ? option.label : role;
        })
        .filter(Boolean);

    return labels.length > 0 ? labels.join(", ") : "Невідома роль";
};
