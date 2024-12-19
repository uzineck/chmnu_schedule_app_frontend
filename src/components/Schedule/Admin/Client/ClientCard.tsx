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
                <Title text="Manage Clients" />
                {clientInfo &&
                    (
                        <MainCardInfo>
                            <MainCardInfoItem>Full name: {clientInfo.last_name} {clientInfo.first_name} {clientInfo.middle_name}</MainCardInfoItem>
                            <MainCardInfoItem>Email: {clientInfo.email}</MainCardInfoItem>
                            <MainCardInfoItem>Role: {clientInfo.role}</MainCardInfoItem>
                        </MainCardInfo>
                    )
                }
                <MainCardButtons>
                    <ButtonContainer
                        options={[
                            { label: "Get Client Info", value: "get_client_info", isLink: true, to: "get_client_info" },
                            { label: "Create Client", value: "create_client", isLink: true, to: "create_client" },
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
