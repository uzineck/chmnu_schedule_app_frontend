import React, {useEffect, useState} from "react";
import ButtonContainer from "../Buttons/ButtonContainer.tsx";
import DropdownMenu from "../Menus/DropdownMenu.tsx";
import {message} from "antd";
import {useLocation, useNavigate} from "react-router-dom";
import {menuOptions} from "./HeaderMenuOptions.tsx";
import {useAuth} from "../Auth/Context/hooks/useAuth.ts";
import {HeaderButtons, HeaderContainer} from "./headerStyled.ts";

export const Header: React.FC = () => {
    const { isLoggedIn, client } = useAuth();
    const [selectedPage, setSelectedPage] = useState<string | null>(null);
    const [messageApi, contextHolder] = message.useMessage();
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const currentPath = location.pathname;

        if (currentPath.includes("/group") && !currentPath.includes("/manage")) {
            setSelectedPage('group');
            localStorage.setItem("lastPath", "/group");
        } else if (currentPath.includes("/teacher")) {
            setSelectedPage('teacher');
            localStorage.setItem("lastPath", "/teacher");
        } else if (currentPath.includes("/login")) {
            setSelectedPage('login');
        } else {
            setSelectedPage(null);
        }
    }, [location]);

    useEffect(() => {
        if (location.pathname === "/") {
            const lastPath = localStorage.getItem("lastPath");
            if (lastPath) {
                navigate(lastPath);
            }
        }
    }, [location, navigate]);

    useEffect(() => {
        const logoutMessage = location.state?.logoutMessage;
        const logoutMessageError = location.state?.logoutMessageError;
        const loginMessage = location.state?.loginMessage;
        const unauthorized = location.state?.unauthorized;

        const successMessage = logoutMessage || loginMessage;
        const errorMessage = logoutMessageError || unauthorized;

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
        <HeaderContainer>
            {contextHolder}
            <HeaderButtons>
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
            </HeaderButtons>

            <h1>CHMNU Schedule</h1>

            <HeaderButtons>
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
            </HeaderButtons>
        </HeaderContainer>
    );
};
