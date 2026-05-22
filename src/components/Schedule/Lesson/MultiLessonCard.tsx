import React, { useEffect, useState } from "react";
import { Modal } from "antd";
import { Lesson } from "../../../models/lesson/Lesson";
import { LessonForTeacher } from "../../../models/lesson/LessonForTeacher";
import { LessonType } from "../../../models/enums/LessonType.ts";
import LessonDetails from "./LessonDetail.tsx";
import {
    MultiLessonContainer,
    MultiLessonCount,
    MultiLessonDetailsButton,
    MultiLessonHeader,
    MultiLessonList,
    MultiLessonModalBody,
    MultiLessonRow,
    MultiLessonSubject,
    MultiLessonTypeBadge,
} from "./multiLessonCardStyled.ts";

const typeLabel = (type: string): string => {
    if (type === LessonType.LECTURE) return "Л";
    if (type === LessonType.PRACTICE) return "П";
    return "•";
};

interface MultiLessonCardProps {
    lessons: (Lesson | LessonForTeacher)[];
}

const MultiLessonCard: React.FC<MultiLessonCardProps> = ({ lessons }) => {
    const [open, setOpen] = useState(false);

    // Lock body scroll while the modal is open. Antd's mask alone doesn't
    // prevent touch-scroll on iOS Safari / older Android.
    useEffect(() => {
        if (!open) return;
        const original = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = original;
        };
    }, [open]);

    return (
        <>
            <MultiLessonContainer>
                <MultiLessonHeader>
                    <span>Заняття</span>
                    <MultiLessonCount>{lessons.length}</MultiLessonCount>
                </MultiLessonHeader>
                <MultiLessonList>
                    {lessons.map((lesson, idx) => (
                        <MultiLessonRow key={idx} title={lesson.subject.title}>
                            <MultiLessonTypeBadge type={lesson.type}>
                                {typeLabel(lesson.type)}
                            </MultiLessonTypeBadge>
                            <MultiLessonSubject>{lesson.subject.title}</MultiLessonSubject>
                        </MultiLessonRow>
                    ))}
                </MultiLessonList>
                <MultiLessonDetailsButton type="button" onClick={() => setOpen(true)}>
                    Деталі
                </MultiLessonDetailsButton>
            </MultiLessonContainer>

            <Modal
                open={open}
                onCancel={() => setOpen(false)}
                footer={null}
                title={`Заняття в цей час · ${lessons.length}`}
                centered
                destroyOnHidden
            >
                <MultiLessonModalBody>
                    {lessons.map((lesson, idx) => (
                        <LessonDetails key={idx} lesson={lesson} />
                    ))}
                </MultiLessonModalBody>
            </Modal>
        </>
    );
};

export default MultiLessonCard;
