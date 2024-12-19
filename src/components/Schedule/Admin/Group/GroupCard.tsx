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
                <Title text="Manage Groups" />
                {groupInfo &&
                    (
                        <MainCardInfo>
                        <MainCardInfoItem>Group: {groupInfo.number}</MainCardInfoItem>
                        <MainCardInfoItem>Faculty: {groupInfo.faculty.code_name}</MainCardInfoItem>
                        <MainCardInfoItem>Headman: {groupInfo.headman.email}</MainCardInfoItem>
                        <MainCardInfoItem>Has subgroups: {groupInfo.has_subgroups.toString()}</MainCardInfoItem>
                        </MainCardInfo>
                    )
                }
                <MainCardButtons>
                    <ButtonContainer
                        options={[
                            { label: "Get Group Info", value: "get_group_info", isLink: true, to: "get_group_info" },
                            { label: "Create Group", value: "create_group", isLink: true, to: "create_group" },
                            { label: "Update Group Headman", value: "update_headman", isLink: true, to: "update_headman" },
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
