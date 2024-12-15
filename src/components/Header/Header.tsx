import React, {useEffect, useState} from "react";
import ButtonContainer from "../Buttons/ButtonContainer.tsx";
import "./module.css";
import DropdownMenu from "../Menus/DropdownMenu.tsx";
import {message} from "antd";
import {useLocation} from "react-router-dom";
import {menuOptions} from "./HeaderMenuOptions.tsx";
import {useAuth} from "../Auth/Context/hooks/useAuth.ts";

export const Header: React.FC = () => {
    const { isLoggedIn, client } = useAuth();
    const [selectedPage, setSelectedPage] = useState<string | null>(null);
    const [messageApi, contextHolder] = message.useMessage();
    const location = useLocation();

    useEffect(() => {
        const logoutMessage = location.state?.logoutMessage;
        const logoutMessageError = location.state?.logoutMessageError;
        const loginMessage = location.state?.loginMessage;

        const successMessage = logoutMessage || loginMessage;
        const errorMessage = logoutMessageError;

        if (successMessage) {
            messageApi.success({content: successMessage, duration: 2});
        }
        if (errorMessage) {
            messageApi.error({content: errorMessage, duration: 2});
        }
    }, [location.state, messageApi]);

    const handleButtonClick = (page: string) => {
        setSelectedPage(page);
    };

    return (
        <header className="header">
            {contextHolder}
            <div className="header-buttons">
                {isLoggedIn ? (
                    <DropdownMenu
                        menuName={`${client?.last_name} ${client?.first_name.charAt(0)}. ${client?.middle_name.charAt(0)}.`}
                        options={menuOptions(client)}
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
