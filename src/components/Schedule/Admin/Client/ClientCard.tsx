import React, {useEffect, useState} from "react";
import {message} from "antd";
import {Outlet, useLocation} from "react-router-dom";
import {
    DoubleFormPage,
    MainCard,
    MainCardButtons, MainCardInfo, MainCardInfoItem,
    SecondaryCard
} from "../../../Auth/Client/doubleFormStyled.ts";
import Title from "../../../Title/Title.tsx";
import ButtonContainer from "../../../Buttons/ButtonContainer.tsx";
import {ClientPrivate} from "../../../../models/client/ClientPrivate.ts";
import {getClientRoleLabels} from "../../../../models/enums/ClientRole.ts";

const ClientCard: React.FC = () => {
    const [clientInfo, setClientInfo] = useState<ClientPrivate | null>(null);
    const [selectedPage, setSelectedPage] = useState<string | null>(null);
    const location = useLocation();
    const [messageApi, contextHolder] = message.useMessage();

    useEffect(() => {
        if (location.pathname === "/admin/manage/client") {
            setSelectedPage(null);
        }
    }, [location]);

    const handleButtonClick = (page: string) => {
        setSelectedPage(page === selectedPage ? null : page);
    };

    useEffect(() => {
        const successMessage = location.state?.successMessage;
        const clientInfo = location.state?.clientInfo;

        if (successMessage) {
            messageApi.success({ content: successMessage, duration: 2 });
        }
        if (clientInfo){
            setClientInfo(clientInfo);
        }
    }, [location.state, messageApi]);

    return (
        <DoubleFormPage>
                {contextHolder}
            <MainCard>
                <Title text="Панель клієнтів" />
                {clientInfo &&
                    (
                        <MainCardInfo>
                            <MainCardInfoItem>Повне ім'я: {clientInfo.last_name} {clientInfo.first_name} {clientInfo.middle_name}</MainCardInfoItem>
                            <MainCardInfoItem>Email: {clientInfo.email}</MainCardInfoItem>
                            <MainCardInfoItem>Ролі: {getClientRoleLabels(clientInfo?.roles)}</MainCardInfoItem>
                        </MainCardInfo>
                    )
                }
                <MainCardButtons>
                    <ButtonContainer
                        options={[
                            { label: "Зареєструвати клієнта", value: "create_client", isLink: true, to: "create_client" },
                            { label: "Дані про клієнта", value: "get_client_info", isLink: true, to: "get_client_info" },
                            { label: "Змінити ролі клієнта", value: "update_client_roles", isLink: true, to: "update_client_roles" },
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

export default ClientCard;