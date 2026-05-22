import React, {useCallback, useEffect, useState} from "react";
import ButtonContainer from "../Buttons/ButtonContainer.tsx";
import DropdownMenu from "../Menus/DropdownMenu.tsx";
import {message} from "antd";
import {useLocation, useNavigate} from "react-router-dom";
import {menuOptions} from "./MenuOptions/HeaderMenuOptions.tsx";
import {useAuth} from "../Auth/Context/hooks/useAuth.ts";
import {
    DrawerCloseButton,
    DrawerNavItem,
    DrawerOverlay,
    DrawerPanel,
    DrawerSection,
    DrawerSectionTitle,
    DrawerTopRow,
    DrawerUserPill,
    HamburgerButton,
    HeaderButtons,
    HeaderContainer,
    HeaderLogo,
    HeaderTitle,
    HeaderTitleAccent,
    HeaderTitleLink,
    HeaderTitleWrapper,
} from "./headerStyled.ts";
import {useMediaQuery} from "../../hooks/useMediaQuery.ts";
import {mq} from "../../styles/media.ts";
import {AiOutlineClose, AiOutlineMenu} from "react-icons/ai";
import {UserOutlined} from "@ant-design/icons";

export const Header: React.FC = () => {
    const {isLoggedIn, client} = useAuth();
    const [selectedPage, setSelectedPage] = useState<string | null>(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const location = useLocation();
    const navigate = useNavigate();

    const isDesktop = useMediaQuery(mq.up('desktop'));

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
            const lastPath = localStorage.getItem("lastPath") || "/group";
            navigate(lastPath);
        }
    }, [location, navigate]);

    useEffect(() => {
        const successMessage = location.state?.successMessage;
        const errorMessage = location.state?.errorMessage;
        const warningMessage = location.state?.warningMessage;

        if (successMessage) {
            messageApi.success({content: successMessage, duration: 2});
        }
        if (errorMessage) {
            messageApi.error({content: errorMessage, duration: 3});
        }
        if (warningMessage) {
            messageApi.warning({content: warningMessage, duration: 3});
        }
    }, [location.state, messageApi]);

    useEffect(() => {
        setDrawerOpen(false);
    }, [location.pathname]);

    useEffect(() => {
        if (!drawerOpen) return;
        const original = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setDrawerOpen(false);
        };
        window.addEventListener('keydown', handleKey);
        return () => {
            document.body.style.overflow = original;
            window.removeEventListener('keydown', handleKey);
        };
    }, [drawerOpen]);

    const handleButtonClick = (page: string) => {
        setSelectedPage(page);
    };

    const closeDrawer = useCallback(() => setDrawerOpen(false), []);
    const handleDrawerNav = useCallback((to: string) => {
        setDrawerOpen(false);
        navigate(to);
    }, [navigate]);

    const userMenu = isLoggedIn ? menuOptions(client) : [];
    const userDisplayName = client
        ? `${client.last_name} ${client.first_name.charAt(0)}. ${client.middle_name.charAt(0)}.`
        : '';

    return (
        <>
            {contextHolder}
            <HeaderContainer>
                <HeaderTitleWrapper>
                    <HeaderTitleLink to="/" aria-label="Розклад ЧНУ — на головну">
                        <HeaderLogo aria-hidden="true" />
                        <HeaderTitle>
                            Розклад <HeaderTitleAccent>ЧНУ</HeaderTitleAccent>
                        </HeaderTitle>
                    </HeaderTitleLink>
                </HeaderTitleWrapper>

                {isDesktop ? (
                    <HeaderButtons>
                        {isLoggedIn ? (
                            <DropdownMenu
                                menuName={userDisplayName}
                                options={userMenu}
                            />
                        ) : (
                            <ButtonContainer
                                options={[
                                    {label: "Увійти", value: "login", isLink: true, to: "/login"},
                                ]}
                                selectedValue={selectedPage}
                                onChange={handleButtonClick}
                            />
                        )}
                    </HeaderButtons>
                ) : (
                    <HamburgerButton
                        type="button"
                        aria-label="Відкрити меню"
                        aria-expanded={drawerOpen}
                        onClick={() => setDrawerOpen(true)}
                    >
                        <AiOutlineMenu size={24} />
                    </HamburgerButton>
                )}
            </HeaderContainer>

            {!isDesktop && drawerOpen && (
                <DrawerOverlay onClick={closeDrawer}>
                    <DrawerPanel onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Меню навігації">
                        <DrawerTopRow>
                            {isLoggedIn ? (
                                <DrawerUserPill>
                                    <UserOutlined />
                                    <span>{userDisplayName}</span>
                                </DrawerUserPill>
                            ) : (
                                <DrawerNavItem
                                    type="button"
                                    active={selectedPage === "login"}
                                    onClick={() => handleDrawerNav('/login')}
                                >
                                    <UserOutlined /> Увійти
                                </DrawerNavItem>
                            )}
                            <DrawerCloseButton
                                type="button"
                                aria-label="Закрити меню"
                                onClick={closeDrawer}
                            >
                                <AiOutlineClose size={22} />
                            </DrawerCloseButton>
                        </DrawerTopRow>

                        {isLoggedIn && userMenu.length > 0 && (
                            <DrawerSection>
                                <DrawerSectionTitle>Акаунт</DrawerSectionTitle>
                                {userMenu.map((opt) => (
                                    <DrawerNavItem
                                        key={opt.key}
                                        type="button"
                                        onClick={() => opt.to && handleDrawerNav(opt.to)}
                                    >
                                        {opt.icon}
                                        {opt.label}
                                    </DrawerNavItem>
                                ))}
                            </DrawerSection>
                        )}
                    </DrawerPanel>
                </DrawerOverlay>
            )}
        </>
    );
};
