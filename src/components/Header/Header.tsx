import React, { useState } from "react";
import { useAuth } from "../Auth/Context/AuthProvider.tsx";
import ButtonContainer from "../Buttons/ButtonContainer.tsx";
import "./module.css";
import DropdownMenu from "../Menus/DropdownMenu.tsx";
import {
    ContactsOutlined,
    LogoutOutlined,
    ScheduleOutlined,
    UserOutlined
} from "@ant-design/icons";
import { ClientRole } from "../../models/enums/ClientRole.ts";

export const Header: React.FC = () => {
    const { isLoggedIn, client } = useAuth();
    const [selectedPage, setSelectedPage] = useState<string | null>(null);

    const handleButtonClick = (page: string) => {
        setSelectedPage(page);
    };

    const menuOptions = [
        {
            label: "Profile",
            key: "profile",
            to: "/profile",
            icon: <UserOutlined />,
        },
        ...(client?.role === ClientRole.HEADMAN
            ? [
                {
                    label: "My Group",
                    key: "my_group",
                    to: "/my_group",
                    icon: <ScheduleOutlined />,
                },
            ]
            : []),
        ...(client?.role === ClientRole.ADMIN
            ? [
                {
                    label: "Admin Panel",
                    key: "admin_panel",
                    to: "/admin_panel",
                    icon: <ContactsOutlined />,
                },
            ]
            : []),
        {
            label: "Logout",
            key: "logout",
            to: "/logout",
            icon: <LogoutOutlined />,
        },
    ];

    return (
        <header className="header">
            <div className="header-buttons">
                {isLoggedIn ? (
                    <DropdownMenu
                        menuName={`${client?.last_name} ${client?.first_name.charAt(0)}. ${client?.middle_name.charAt(0)}.`}
                        options={menuOptions}
                    />
                ) : (
                    <ButtonContainer
                        options={[
                            {
                                label: "Login",
                                value: "login",
                                isLink: true,
                                to: "/login",
                            },
                        ]}
                        selectedValue={selectedPage}
                        onChange={handleButtonClick}
                    />
                )}
            </div>

            <h1>CHMNU Schedule</h1>

            <div className="header-buttons">
                <ButtonContainer
                    options={[
                        {
                            label: "Group",
                            value: "group",
                            isLink: true,
                            to: "/group",
                        },
                        {
                            label: "Teacher",
                            value: "teacher",
                            isLink: true,
                            to: "/teacher",
                        },
                    ]}
                    selectedValue={selectedPage}
                    onChange={handleButtonClick}
                />
            </div>
        </header>
    );
};
