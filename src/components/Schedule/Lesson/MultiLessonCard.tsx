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

    // Lock both <html> and <body> scroll while the modal is open. Locking
    // body alone isn't enough on some desktop browsers where <html> owns the
    // document scroll context. Antd's own scroll-locker isn't reliable enough
    // here — we belt-and-suspenders.
    useEffect(() => {
        if (!open) return;
        const html = document.documentElement;
        const body = document.body;
        const htmlOriginal = html.style.overflow;
        const bodyOriginal = body.style.overflow;
        html.style.overflow = 'hidden';
        body.style.overflow = 'hidden';
        return () => {
            html.style.overflow = htmlOriginal;
            body.style.overflow = bodyOriginal;
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
                destroyOnClose
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
