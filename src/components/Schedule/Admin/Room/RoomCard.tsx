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
import {Room} from "../../../../models/room/Room.ts";

const RoomCard: React.FC = () => {
    const [selectedPage, setSelectedPage] = useState<string | null>(null);
    const [roomInfo, setRoomInfo] = useState<Room | null>(null);

    const location = useLocation();
    const [messageApi, contextHolder] = message.useMessage();

    useEffect(() => {
        if (location.pathname === "/admin/manage/room") {
            setSelectedPage(null);
        }
    }, [location]);

    const handleButtonClick = (page: string) => {
        setSelectedPage(page === selectedPage ? null : page);
    };

    useEffect(() => {
        const successMessage = location.state?.successMessage;
        const roomInfo = location.state?.roomInfo;

        if (successMessage) {
            messageApi.success({ content: successMessage, duration: 2 });
        }
        if (roomInfo){
            setRoomInfo(roomInfo);
        }
    }, [location.state, messageApi]);

    return (
        <DoubleFormPage>
            {contextHolder}
            <MainCard>
                <Title text="Manage Rooms" />
                {roomInfo &&
                    (
                        <MainCardInfo>
                            <MainCardInfoItem>Number: {roomInfo.number}</MainCardInfoItem>
                            <MainCardInfoItem>Description: {roomInfo.description}</MainCardInfoItem>
                        </MainCardInfo>
                    )
                }
                <MainCardButtons>
                    <ButtonContainer
                        options={[
                            { label: "Create Room", value: "create_room", isLink: true, to: "create_room" },
                            { label: "Update Room Number", value: "update_room_number", isLink: true, to: "update_room_number" },
                            { label: "Update Room Description", value: "update_room_description", isLink: true, to: "update_room_description" },
                            { label: "Delete Room", value: "delete_room", isLink: true, to: "delete_room" },
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

export default RoomCard;
