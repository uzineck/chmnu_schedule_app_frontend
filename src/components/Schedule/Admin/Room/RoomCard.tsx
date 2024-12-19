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

const RoomCard: React.FC = () => {
    const [selectedPage, setSelectedPage] = useState<string | null>(null);
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
        const createRoomMessage = location.state?.createRoomMessage;
        const updateRoomNumberMessage = location.state?.updateRoomNumberMessage;
        const updateRoomDescriptionMessage = location.state?.updateRoomDescriptionMessage;
        const deleteRoomMessage = location.state?.deleteRoomMessage;

        const successMessage = createRoomMessage || updateRoomNumberMessage || updateRoomDescriptionMessage || deleteRoomMessage;

        if (successMessage) {
            messageApi.success({ content: successMessage, duration: 2 });
        }
    }, [location.state, messageApi]);

    return (
        <DoubleFormPage>
            {contextHolder}
            <MainCard>
                <Title text="Manage Rooms" />
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
