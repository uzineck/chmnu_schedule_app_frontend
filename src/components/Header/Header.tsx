import React, { useState } from "react";
import { useAuth } from "../Auth/Context/AuthProvider.tsx";
import ButtonContainer from "../Buttons/ButtonContainer.tsx";
import "./module.css";

export const Header: React.FC = () => {
    const { isLoggedIn } = useAuth();
    const [selectedPage, setSelectedPage] = useState<string | null>(null);

    const handleButtonClick = (page: string) => {
        setSelectedPage(page);
    };

    return (
        <header className="header">
            <div className="header-buttons">
                <ButtonContainer
                    options={[
                        {
                            label: isLoggedIn ? "Logout" : "Login",
                            value: isLoggedIn ? "logout" : "login",
                            isLink: true,
                            to: isLoggedIn ? "/logout" : "/login",
                        },

                    ]}
                    selectedValue={selectedPage}
                    onChange={handleButtonClick}
                >

                </ButtonContainer>

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
