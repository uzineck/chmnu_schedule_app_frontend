export enum ClientRole {
    ADMIN = "admin",
    MANAGER = "manager",
    HEADMAN = "headman",
}

export const clientRoleOptionsUa = [
    { value: ClientRole.ADMIN, label: "Адмін" },
    { value: ClientRole.MANAGER, label: "Менеджер" },
    { value: ClientRole.HEADMAN, label: "Староста" },
];

export const getClientRoleLabel = (role: ClientRole | undefined): string => {
    const option = clientRoleOptionsUa.find(option => option.value === role);
    return option ? option.label : role || "Невідома роль"; // Fallback if role is undefined or not found
};