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
import {Subject} from "../../../../models/subject/Subject.ts";

const SubjectCard: React.FC = () => {
    const [selectedPage, setSelectedPage] = useState<string | null>(null);
    const [subjectInfo, setSubjectInfo] = useState<Subject | null>(null);
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
        const successMessage = location.state?.successMessage;
        const subjectInfo = location.state?.subjectInfo;

        if (successMessage) {
            messageApi.success({ content: successMessage, duration: 2 });
        }

        if (subjectInfo){
            setSubjectInfo(subjectInfo);
        }
    }, [location.state, messageApi]);

    return (
        <DoubleFormPage>
            {contextHolder}
            <MainCard>
                <Title text="Manage Subjects" />
                {subjectInfo &&
                    (
                        <MainCardInfo>
                            <MainCardInfoItem>Title: {subjectInfo.title}</MainCardInfoItem>
                            <MainCardInfoItem>Slug: {subjectInfo.slug}</MainCardInfoItem>
                        </MainCardInfo>
                    )
                }
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
