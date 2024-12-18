import React, {useEffect, useState} from "react";
import ButtonContainer from "../../Buttons/ButtonContainer.tsx";
import Title from "../../Title/Title.tsx";
import {Outlet, useLocation} from "react-router-dom";
import {useAuth} from "../Context/hooks/useAuth.ts";
import {message} from "antd";
import {ProfileButtons, ProfileCard, ProfileContent, ProfileInfo, ProfileInfoItem, ProfilePage} from "./profileStyled.ts";

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
        <ProfilePage>
            {contextHolder}
            <ProfileCard>
                <Title text="Profile" />
                <ProfileInfo>
                    <ProfileInfoItem>
                        Name: {`${client?.last_name} ${client?.first_name} ${client?.middle_name}`}
                    </ProfileInfoItem>
                    <ProfileInfoItem>Email: {client?.email}</ProfileInfoItem>
                    <ProfileInfoItem>Role: {client?.role.toUpperCase()}</ProfileInfoItem>
                </ProfileInfo>

                <ProfileButtons>
                    <ButtonContainer
                        options={[
                            { label: "Change Email", value: "change_email", isLink: true, to: "change_email" },
                            { label: "Change Password", value: "change_password", isLink: true, to: "change_password" },
                            { label: "Change Credentials", value: "change_credentials", isLink: true, to: "change_credentials" },
                        ]}
                        selectedValue={selectedPage}
                        onChange={handleButtonClick}
                    />
                </ProfileButtons>
            </ProfileCard>
            {selectedPage && (
                <ProfileContent>
                    <Outlet />
                </ProfileContent>
            )}
        </ProfilePage>
    );
};

export default Profile;
