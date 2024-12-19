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

const TeacherCard: React.FC = () => {
    const [selectedPage, setSelectedPage] = useState<string | null>(null);
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
        const createTeacherMessage = location.state?.createTeacherMessage;
        const updateTeacherNameMessage = location.state?.updateTeacherNameMessage;
        const updateTeacherRankMessage = location.state?.updateTeacherRankMessage;
        const deactivateTeacherMessage = location.state?.deactivateTeacherMessage;

        const successMessage = createTeacherMessage || updateTeacherNameMessage || updateTeacherRankMessage || deactivateTeacherMessage;

        if (successMessage) {
            messageApi.success({ content: successMessage, duration: 2 });
        }
    }, [location.state, messageApi]);

    return (
        <DoubleFormPage>
            {contextHolder}
            <MainCard>
                <Title text="Manage Teachers" />
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
