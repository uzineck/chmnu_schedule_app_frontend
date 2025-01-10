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
import {GroupWithHeadman} from "../../../../models/group/GroupWithHeadman.ts";

const GroupCard: React.FC = () => {
    const [selectedPage, setSelectedPage] = useState<string | null>(null);
    const [groupInfo, setGroupInfo] = useState<GroupWithHeadman | null>(null);
    const location = useLocation();
    const [messageApi, contextHolder] = message.useMessage();

    useEffect(() => {
        if (location.pathname === "/admin/manage/group") {
            setSelectedPage(null);
        }
    }, [location]);

    const handleButtonClick = (page: string) => {
        setSelectedPage(page === selectedPage ? null : page);
    };

    useEffect(() => {
        const successMessage = location.state?.successMessage;
        const groupInfo = location.state?.groupInfo;

        if (successMessage) {
            messageApi.success({ content: successMessage, duration: 2 });
        }
        if (groupInfo){
            setGroupInfo(groupInfo);
        }
    }, [location.state, messageApi]);

    return (
        <DoubleFormPage>
            {contextHolder}
            <MainCard>
                <Title text="Панель груп" />
                {groupInfo &&
                    (
                        <MainCardInfo>
                        <MainCardInfoItem>Група: {groupInfo.number}</MainCardInfoItem>
                        <MainCardInfoItem>Факультет: {groupInfo.faculty.code_name}</MainCardInfoItem>
                        <MainCardInfoItem>Староста: {groupInfo.headman.email}</MainCardInfoItem>
                        <MainCardInfoItem>Чи має підгрупи: {groupInfo.has_subgroups ? 'Так' : 'Ні'}</MainCardInfoItem>
                        </MainCardInfo>
                    )
                }
                <MainCardButtons>
                    <ButtonContainer
                        options={[
                            { label: "Дані групи", value: "get_group_info", isLink: true, to: "get_group_info" },
                            { label: "Створити групу", value: "create_group", isLink: true, to: "create_group" },
                            { label: "Змінити старосту групи", value: "update_headman", isLink: true, to: "update_headman" },
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

export default GroupCard;
