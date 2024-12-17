import React, {useEffect, useState} from "react";
import "./module.css";
import ButtonContainer from "../../Buttons/ButtonContainer.tsx";
import Title from "../../Title/Title.tsx";
import {Outlet, useLocation} from "react-router-dom";
import {useAuth} from "../Context/hooks/useAuth.ts";
import {message} from "antd";

const Profile: React.FC = () => {
    const { client } = useAuth();
    const [selectedPage, setSelectedPage] = useState<string | null>(null);
    const location = useLocation();
    const [messageApi, contextHolder] = message.useMessage();

    useEffect(() => {
        if (location.pathname === "/profile") {
            setSelectedPage(null);
        }
    }, [location]);

    const handleButtonClick = (page: string) => {
        setSelectedPage(page === selectedPage ? null : page);
    };

    useEffect(() => {
        const changeCredentials = location.state?.changeCredentials;
        const changeEmail = location.state?.changeEmail;
        const changePassword = location.state?.changePassword;


        const successMessage = changeCredentials || changeEmail || changePassword;

        if (successMessage) {
            messageApi.success({ content: successMessage, duration: 2 });
        }
    }, [location.state, messageApi]);

    return (
        <div className="profile-page">
            {contextHolder}
            <div className="profile-card">
                <Title text="Profile" />
                <div className="profile-info">
                    <div className="profile-info-item">Name: {`${client?.last_name} ${client?.first_name} ${client?.middle_name}`}</div>
                    <div className="profile-info-item">Email: {client?.email}</div>
                    <div className="profile-info-item">Role: {client?.role.toUpperCase()}</div>
                </div>

                <div className="profile-buttons">
                    <ButtonContainer
                        options={[
                            { label: "Change Email", value: "change_email", isLink: true, to:"change_email" },
                            { label: "Change Password", value: "change_password", isLink: true, to:"change_password" },
                            { label: "Change Credentials", value: "change_credentials", isLink: true, to:"change_credentials" },
                        ]}
                        selectedValue={selectedPage}
                        onChange={handleButtonClick}
                    />
                </div>
            </div>
            {selectedPage &&
            <div className="profile-content">
                <Outlet />
            </div>
            }
        </div>
    );
};

export default Profile;
