import React from "react";
import { message } from "antd";
import { LessonDetailsContainer, LessonTypeContainer, LessonTitle, LessonRoom, LessonTeacher, LessonGroups, LessonActions } from "./lessonDetailStyled.ts";
import { Lesson } from "../../../models/lesson/Lesson";
import { LessonForTeacher } from "../../../models/lesson/LessonForTeacher";
import { Link, useNavigate } from "react-router-dom";
import { useSchedule } from "../Context/hooks/useSchedule.ts";
import { useScheduleEditTarget } from "../hooks/useScheduleEditTarget.ts";
import { removeLessonFromGroupAdmin, removeLessonToGroupHeadman } from "../../../api/schedule/group.ts";
import { ApiCallError } from "../../../api/errors.ts";
import { useConfirm } from "../../Forms/useConfirm.ts";
import { DoorIcon, EditIcon, GroupIcon, TeacherIcon, TrashIcon } from "./lessonIcons.tsx";
import { LessonType, lessonTypeOptionsUa } from "../../../models/enums/LessonType.ts";

function isLessonForTeacher(lesson: Lesson | LessonForTeacher): lesson is LessonForTeacher {
    return (lesson as LessonForTeacher).groups !== undefined;
}

interface LessonDetailsProps {
    lesson: Lesson | LessonForTeacher;
    isEditable?: boolean;
}

const getLessonTypeLabel = (type: LessonType) => {
    const option = lessonTypeOptionsUa.find(option => option.value === type);
    return option ? option.label : type;
};

const LessonDetails: React.FC<LessonDetailsProps> = ({ lesson, isEditable = false }) => {
    const { setLessonUuid, setLesson, setDay, setOrdinaryNumber, groupUuid, subgroup, bumpScheduleRefresh } = useSchedule();
    const { mode } = useScheduleEditTarget();
    const navigate = useNavigate();
    const confirm = useConfirm();
    const [messageApi, contextHolder] = message.useMessage();

    const handleEditLesson = () => {
        setLessonUuid(lesson.uuid);
        setLesson(lesson);
        setDay(lesson.timeslot.day);
        setOrdinaryNumber(lesson.timeslot.ord_number);
        navigate(`lesson/${lesson.uuid}/edit`);
    };

    const handleDeleteLesson = () => {
        confirm(
            {
                title: "Видалити пару?",
                content: `${lesson.subject.title} буде видалено з розкладу. Цю дію не можна скасувати.`,
                okText: "Видалити",
                danger: true,
            },
            async () => {
                if (!groupUuid) {
                    messageApi.error({ content: "Видаляйте пару тільки з панелі розкладу", duration: 3 });
                    return;
                }
                messageApi.loading({ key: "delete-lesson", content: "Видалення..." });
                try {
                    if (mode === 'headman') {
                        await removeLessonToGroupHeadman(lesson.uuid, subgroup);
                    } else {
                        await removeLessonFromGroupAdmin(groupUuid, lesson.uuid, subgroup);
                    }
                    messageApi.success({ key: "delete-lesson", content: "Пара успішно видалена", duration: 2 });
                    bumpScheduleRefresh();
                } catch (error) {
                    const text = error instanceof ApiCallError ? error.message : "Виникла невідома помилка";
                    messageApi.error({ key: "delete-lesson", content: text, duration: 3 });
                }
            },
        );
    };

    return (
        <LessonDetailsContainer>
            {contextHolder}
            <LessonTypeContainer type={lesson.type}>{getLessonTypeLabel(lesson.type)}</LessonTypeContainer>
            <LessonTitle>{lesson.subject.title}</LessonTitle>
            <LessonRoom><DoorIcon /> {lesson.room.number}</LessonRoom>
            {isLessonForTeacher(lesson) ? (
                <LessonGroups>
                    <GroupIcon/>{" "}
                    {lesson.groups.map((group, index) => (
                        <span key={group.uuid}>
                            <Link
                                to={
                                    group.subgroups && group.subgroups.length === 1
                                        ? `/group/${group.uuid}/lessons?subgroup=${group.subgroups[0]}`
                                        : `/group/${group.uuid}/lessons`
                                }
                            >
                                {group.number}{group.subgroups && group.subgroups.length === 1 ? `(${group.subgroups.join(", ")})` : ""}
                            </Link>
                            {index < lesson.groups.length - 1 && ","}
                        </span>
                    ))}
                </LessonGroups>
            ) : (
                <LessonTeacher>
                    <TeacherIcon/>
                    <Link to={`/teacher/${lesson.teacher.uuid}/lessons`}>
                        {lesson.teacher.last_name} {lesson.teacher.first_name.charAt(0)}. {lesson.teacher.middle_name.charAt(0)}.
                    </Link>
                </LessonTeacher>
            )}

            {isEditable && (
                <LessonActions>
                    <EditIcon onClick={handleEditLesson} />
                    <TrashIcon onClick={handleDeleteLesson} />
                </LessonActions>
            )}
        </LessonDetailsContainer>
    );
};

export default LessonDetails;
