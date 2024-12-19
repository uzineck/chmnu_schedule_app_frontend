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

const SubjectCard: React.FC = () => {
    const [selectedPage, setSelectedPage] = useState<string | null>(null);
    const location = useLocation();
    const [messageApi, contextHolder] = message.useMessage();

    useEffect(() => {
        if (location.pathname === "/admin/manage/subject") {
            setSelectedPage(null);
        }
    }, [location]);

    const handleButtonClick = (page: string) => {
        setSelectedPage(page === selectedPage ? null : page);
    };

    useEffect(() => {
        const createSubjectMessage = location.state?.createSubjectMessage;
        const updateSubjectNumberMessage = location.state?.updateSubjectNumberMessage;
        const updateSubjectDescriptionMessage = location.state?.updateSubjectDescriptionMessage;
        const deleteSubjectMessage = location.state?.deleteSubjectMessage;

        const successMessage = createSubjectMessage || updateSubjectNumberMessage || updateSubjectDescriptionMessage || deleteSubjectMessage;

        if (successMessage) {
            messageApi.success({ content: successMessage, duration: 2 });
        }
    }, [location.state, messageApi]);

    return (
        <DoubleFormPage>
            {contextHolder}
            <MainCard>
                <Title text="Manage Subjects" />
                <MainCardButtons>
                    <ButtonContainer
                        options={[
                            { label: "Create Subject", value: "create_subject", isLink: true, to: "create_subject" },
                            { label: "Update Subject Title", value: "update_subject_title", isLink: true, to: "update_subject_title" },
                            { label: "Delete Subject", value: "delete_subject", isLink: true, to: "delete_subject" },
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

export default SubjectCard;
