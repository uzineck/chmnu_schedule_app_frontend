import React, {useEffect, useState} from "react";
import ButtonContainer from "../../Buttons/ButtonContainer.tsx";
import Title from "../../Title/Title.tsx";
import {Outlet, useLocation} from "react-router-dom";
import {useAuth} from "../Context/hooks/useAuth.ts";
import {message} from "antd";
import {MainCardButtons, MainCard, SecondaryCard, MainCardInfo, MainCardInfoItem, DoubleFormPage} from "./doubleFormStyled.ts";

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
        <DoubleFormPage>
            {contextHolder}
            <MainCard>
                <Title text="Profile" />
                <MainCardInfo>
                    <MainCardInfoItem>
                        Name: {`${client?.last_name} ${client?.first_name} ${client?.middle_name}`}
                    </MainCardInfoItem>
                    <MainCardInfoItem>Email: {client?.email}</MainCardInfoItem>
                    <MainCardInfoItem>Role: {client?.role.toUpperCase()}</MainCardInfoItem>
                </MainCardInfo>

                <MainCardButtons>
                    <ButtonContainer
                        options={[
                            { label: "Change Email", value: "change_email", isLink: true, to: "change_email" },
                            { label: "Change Password", value: "change_password", isLink: true, to: "change_password" },
                            { label: "Change Credentials", value: "change_credentials", isLink: true, to: "change_credentials" },
                        ]}
                        selectedValue={selectedPage}
                        onChange={handleButtonClick}
                    />
                </MainCardButtons>
            </MainCard>
            {selectedPage && (
                <SecondaryCard>
                    <Outlet />
                </SecondaryCard>
            )}
        </DoubleFormPage>
    );
};

export default Profile;
