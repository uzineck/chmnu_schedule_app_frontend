import React, {useEffect, useState} from "react";
import ButtonContainer from "../../Buttons/ButtonContainer.tsx";
import Title from "../../Title/Title.tsx";
import {Outlet, useLocation} from "react-router-dom";
import {useAuth} from "../Context/hooks/useAuth.ts";
import {message} from "antd";
import {MainCardButtons, MainCard, SecondaryCard, MainCardInfo, MainCardInfoItem, DoubleFormPage} from "./doubleFormStyled.ts";
import {getClientRoleLabel} from "../../../models/enums/ClientRole.ts";

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
        const successMessage = location.state?.successMessage;

        if (successMessage) {
            messageApi.success({ content: successMessage, duration: 2 });
        }
    }, [location.state, messageApi]);

    return (
        <DoubleFormPage>
            {contextHolder}
            <MainCard>
                <Title text="Профіль" />
                <MainCardInfo>
                    <MainCardInfoItem>
                        Повне ім'я: {`${client?.last_name} ${client?.first_name} ${client?.middle_name}`}
                    </MainCardInfoItem>
                    <MainCardInfoItem>Email: {client?.email}</MainCardInfoItem>
                    <MainCardInfoItem>Роль: {getClientRoleLabel(client?.role)}</MainCardInfoItem>
                </MainCardInfo>

                <MainCardButtons>
                    <ButtonContainer
                        options={[
                            { label: "Змінити email", value: "change_email", isLink: true, to: "change_email" },
                            { label: "Змінити пароль", value: "change_password", isLink: true, to: "change_password" },
                            { label: "Змінити ім'я", value: "change_credentials", isLink: true, to: "change_credentials" },
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
