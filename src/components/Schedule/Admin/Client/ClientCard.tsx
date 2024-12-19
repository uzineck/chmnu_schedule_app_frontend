import React, {useEffect, useState} from "react";
import {message} from "antd";
import {Outlet, useLocation} from "react-router-dom";
import {
    DoubleFormPage,
    MainCard,
    MainCardButtons,
    SecondaryCard
} from "../../../Auth/Client/doubleFormStyled.ts";
import Title from "../../../Title/Title.tsx";
import ButtonContainer from "../../../Buttons/ButtonContainer.tsx";

const ClientCard: React.FC = () => {
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
        const signUpMessage = location.state?.signUpMessage;

        const successMessage = signUpMessage;

        if (successMessage) {
            messageApi.success({ content: successMessage, duration: 2 });
        }
    }, [location.state, messageApi]);

    return (
        <DoubleFormPage>
                {contextHolder}
            <MainCard>
                <Title text="Manage Clients" />
                <MainCardButtons>
                    <ButtonContainer
                        options={[
                            { label: "Create Client", value: "create_client", isLink: true, to: "create_client" },
                            // { label: "Change Email", value: "change_email", isLink: true, to: "change_email" },
                            // { label: "Change Password", value: "change_password", isLink: true, to: "change_password" },
                            // { label: "Change Credentials", value: "change_credentials", isLink: true, to: "change_credentials" },
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
