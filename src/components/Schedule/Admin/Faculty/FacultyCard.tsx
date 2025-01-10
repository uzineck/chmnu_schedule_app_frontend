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
import {Faculty} from "../../../../models/faculty/Faculty.ts";

const FacultyCard: React.FC = () => {
    const [selectedPage, setSelectedPage] = useState<string | null>(null);
    const [facultyInfo, setFacultyInfo] = useState<Faculty | null>(null);

    const location = useLocation();
    const [messageApi, contextHolder] = message.useMessage();

    useEffect(() => {
        if (location.pathname === "/admin/manage/faculty") {
            setSelectedPage(null);
        }
    }, [location]);

    const handleButtonClick = (page: string) => {
        setSelectedPage(page === selectedPage ? null : page);
    };

    useEffect(() => {
        const successMessage = location.state?.successMessage;
        const facultyInfo = location.state?.facultyInfo;

        if (successMessage) {
            messageApi.success({ content: successMessage, duration: 2 });
        }
        if (facultyInfo){
            setFacultyInfo(facultyInfo);
        }
    }, [location.state, messageApi]);

    return (
        <DoubleFormPage>
            {contextHolder}
            <MainCard>
                <Title text="Панель факультетів" />
                {facultyInfo &&
                    (
                        <MainCardInfo>
                            <MainCardInfoItem>Назва: {facultyInfo.name}</MainCardInfoItem>
                            <MainCardInfoItem>Абривіатура: {facultyInfo.code_name}</MainCardInfoItem>
                        </MainCardInfo>
                    )
                }
                <MainCardButtons>
                    <ButtonContainer
                        options={[
                            { label: "Створити факультет", value: "create_faculty", isLink: true, to: "create_faculty" },
                            { label: "Змінити назву факультету", value: "update_faculty_name", isLink: true, to: "update_faculty_name" },
                            { label: "Змінити абривіатуру факультету", value: "update_faculty_code_name", isLink: true, to: "update_faculty_code_name" },
                            { label: "Видалити факультет", value: "delete_faculty", isLink: true, to: "delete_faculty" },
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

export default FacultyCard;
