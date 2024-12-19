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
import {Teacher} from "../../../../models/teacher/Teacher.ts";

const TeacherCard: React.FC = () => {
    const [selectedPage, setSelectedPage] = useState<string | null>(null);
    const [teacherInfo, setTeacherInfo] = useState<Teacher | null>(null);

    const location = useLocation();
    const [messageApi, contextHolder] = message.useMessage();

    useEffect(() => {
        if (location.pathname === "/admin/manage/teacher") {
            setSelectedPage(null);
        }
    }, [location]);

    const handleButtonClick = (page: string) => {
        setSelectedPage(page === selectedPage ? null : page);
    };

    useEffect(() => {
        const successMessage = location.state?.successMessage;
        const teacherInfo = location.state?.teacherInfo;
        if (successMessage) {
            messageApi.success({ content: successMessage, duration: 2 });
        }
        if (teacherInfo){
            setTeacherInfo(teacherInfo);
        }
    }, [location.state, messageApi]);

    return (
        <DoubleFormPage>
            {contextHolder}
            <MainCard>
                <Title text="Manage Teachers" />
                {teacherInfo &&
                    (
                        <MainCardInfo>
                            <MainCardInfoItem>Full name: {teacherInfo.last_name} {teacherInfo.first_name} {teacherInfo.middle_name}</MainCardInfoItem>
                            <MainCardInfoItem>Rank: {teacherInfo.rank}</MainCardInfoItem>
                        </MainCardInfo>
                    )
                }
                <MainCardButtons>
                    <ButtonContainer
                        options={[
                            { label: "Create Teacher", value: "create_teacher", isLink: true, to: "create_teacher" },
                            { label: "Update Teacher Name", value: "update_teacher_name", isLink: true, to: "update_teacher_name" },
                            { label: "Update Teacher Rank", value: "update_teacher_rank", isLink: true, to: "update_teacher_rank" },
                            { label: "Deactivate Teacher", value: "deactivate_teacher", isLink: true, to: "deactivate_teacher" },
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

export default TeacherCard;
