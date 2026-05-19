import React, { useEffect, useState } from "react";
import ButtonContainer from "../Buttons/ButtonContainer.tsx";
import DropdownMenu from "../Menus/DropdownMenu.tsx";
import { message } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { menuOptions } from "./MenuOptions/HeaderMenuOptions.tsx";
import { useAuth } from "../Auth/Context/hooks/useAuth.ts";
import { HeaderButtons, HeaderContainer, HeaderTitle, HeaderTitleWrapper } from "./headerStyled.ts";

export const Header: React.FC = () => {
    const { isLoggedIn, client } = useAuth();
    const [selectedPage, setSelectedPage] = useState<string | null>(null);
    const [messageApi, contextHolder] = message.useMessage();
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const currentPath = location.pathname;

        if (currentPath.includes("/group") && !currentPath.includes("/manage")) {
            setSelectedPage("group");
            localStorage.setItem("lastPath", "/group");
        } else if (currentPath.includes("/teacher") && !currentPath.includes("/manage")) {
            setSelectedPage("teacher");
            localStorage.setItem("lastPath", "/teacher");
        } else if (currentPath.includes("/login")) {
            setSelectedPage("login");
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
        const successMessage = location.state?.successMessage;
        const errorMessage = location.state?.errorMessage;

        if (successMessage) {
            messageApi.success({ content: successMessage, duration: 2 });
        }
        if (errorMessage) {
            messageApi.error({ content: errorMessage, duration: 2 });
        }
    }, [location.state, messageApi]);

    const handleButtonClick = (page: string) => {
        setSelectedPage(page);
    };

    return (
        <>
            {contextHolder}
            <HeaderContainer>
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
                                    label: "Увійти",
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

                <HeaderTitleWrapper>
                    <HeaderTitle>Розклад ЧНУ</HeaderTitle>
                </HeaderTitleWrapper>

                <HeaderButtons>
                    <ButtonContainer
                        options={[
                            {
                                label: "Розклад для студентів",
                                value: "group",
                                isLink: true,
                                to: "/group",
                            },
                            {
                                label: "Розклад для викладачів",
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
        </>
    );
};
