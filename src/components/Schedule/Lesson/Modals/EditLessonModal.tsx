import { useEffect, useState } from "react";
import { Modal, message } from "antd";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Subject } from "../../../../models/subject/Subject.ts";
import { Teacher } from "../../../../models/teacher/Teacher.ts";
import { Room } from "../../../../models/room/Room.ts";
import { LessonType, lessonTypeOptionsUa } from "../../../../models/enums/LessonType.ts";
import { LessonSchema } from "../../../../models/lesson/request/LessonSchema.ts";
import { updateLesson } from "../../../../api/schedule/lesson.ts";
import {
    updateLessonInGroupAdmin,
    updateLessonInGroupHeadman,
} from "../../../../api/schedule/group.ts";
import { ApiCallError } from "../../../../api/errors.ts";
import { useSchedule } from "../../Context/hooks/useSchedule.ts";
import { useScheduleEditTarget } from "../../hooks/useScheduleEditTarget.ts";
import SubjectSearch from "../../Subject/SubjectSearch.tsx";
import TeacherSearch from "../../Teacher/TeacherSearchAsync.tsx";
import RoomSearch from "../../Room/RoomSearch.tsx";
import { FormCard, FormFieldSelect } from "../../../Forms/formStyled.ts";
import FormField from "../../../Forms/FormField.tsx";
import FormActions from "../../../Forms/FormActions.tsx";

const EditLessonValidationSchema = Yup.object().shape({
    subject_uuid: Yup.string().required("Оберіть дисципліну"),
    teacher_uuid: Yup.string().required("Оберіть викладача"),
    room_uuid: Yup.string().required("Оберіть аудиторію"),
    type: Yup.string()
        .oneOf(Object.values(LessonType), "Невірний тип заняття")
        .required("Тип заняття обов'язковий"),
});

interface EditLessonModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const EditLessonModal = ({ open, onClose, onSuccess }: EditLessonModalProps) => {
    const { day, ordinaryNumber, isEvenWeek, groupUuid, subgroup, lesson } = useSchedule();
    const { mode } = useScheduleEditTarget();
    const [messageApi, contextHolder] = message.useMessage();

    const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
    const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

    const formik = useFormik<{
        subject_uuid: string;
        teacher_uuid: string;
        room_uuid: string;
        type: LessonType;
    }>({
        initialValues: {
            subject_uuid: '',
            teacher_uuid: '',
            room_uuid: '',
            type: LessonType.LECTURE,
        },
        validationSchema: EditLessonValidationSchema,
        onSubmit: async (values, { setSubmitting }) => {
            if (!lesson || !lesson.uuid) {
                messageApi.error({ content: "Дані про пару відсутні", duration: 3 });
                setSubmitting(false);
                return;
            }
            if (!day || !ordinaryNumber || !groupUuid) {
                messageApi.error({ content: "Редагуйте пару тільки з панелі розкладу", duration: 3 });
                setSubmitting(false);
                return;
            }
            messageApi.loading({ key: "update-lesson", content: "Оновлення..." });
            try {
                const lessonData: LessonSchema = {
                    schema: {
                        subject_uuid: values.subject_uuid,
                        teacher_uuid: values.teacher_uuid,
                        room_uuid: values.room_uuid,
                    },
                    lesson_schema: {
                        type: values.type,
                        timeslot: { day, ord_number: ordinaryNumber, is_even: isEvenWeek },
                    },
                };
                const updateResponse = await updateLesson(lesson.uuid, lessonData);
                const oldUuid = updateResponse.data.old_lesson.uuid;
                const newUuid = updateResponse.data.updated_lesson.uuid;
                // API signature is (newLesson, oldLesson, ...) — URL is /:old/update/:new.
                if (mode === 'headman') {
                    await updateLessonInGroupHeadman(newUuid, oldUuid, subgroup);
                } else {
                    await updateLessonInGroupAdmin(groupUuid, newUuid, oldUuid, subgroup);
                }
                messageApi.success({ key: "update-lesson", content: "Пару успішно оновлено", duration: 2 });
                onSuccess();
            } catch (error) {
                const text = error instanceof ApiCallError ? error.message : "Виникла невідома помилка";
                messageApi.error({ key: "update-lesson", content: text, duration: 3 });
            } finally {
                setSubmitting(false);
            }
        },
    });

    // Hydrate form when the modal opens with a lesson in context.
    useEffect(() => {
        if (!open || !lesson) return;
        const teacher = 'teacher' in lesson ? lesson.teacher : null;
        setSelectedSubject(lesson.subject);
        setSelectedTeacher(teacher);
        setSelectedRoom(lesson.room);
        formik.setValues({
            subject_uuid: lesson.subject.uuid,
            teacher_uuid: teacher ? teacher.uuid : '',
            room_uuid: lesson.room.uuid,
            type: lesson.type,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, lesson]);

    const handleCancel = () => {
        if (formik.isSubmitting) return;
        onClose();
    };

    const handleSubjectSelect = (subject: Subject | null) => {
        setSelectedSubject(subject);
        formik.setFieldValue('subject_uuid', subject ? subject.uuid : '');
    };
    const handleTeacherSelect = (teacher: Teacher | null) => {
        setSelectedTeacher(teacher);
        formik.setFieldValue('teacher_uuid', teacher ? teacher.uuid : '');
    };
    const handleRoomSelect = (room: Room | null) => {
        setSelectedRoom(room);
        formik.setFieldValue('room_uuid', room ? room.uuid : '');
    };

    return (
        <Modal
            open={open}
            onCancel={handleCancel}
            footer={null}
            title="Редагувати пару"
            centered
            destroyOnClose
            styles={{ body: { maxHeight: 'calc(100vh - 160px)', overflowY: 'auto' } }}
        >
            {contextHolder}
            <FormCard onSubmit={formik.handleSubmit} noValidate>
                <FormField
                    name="type"
                    label="Тип заняття"
                    touched={formik.touched.type}
                    error={formik.errors.type}
                >
                    <FormFieldSelect
                        id="type"
                        $hasError={Boolean(formik.touched.type && formik.errors.type)}
                        {...formik.getFieldProps('type')}
                    >
                        {lessonTypeOptionsUa.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </FormFieldSelect>
                </FormField>

                <FormField
                    name="subject_uuid"
                    label="Дисципліна"
                    touched={formik.touched.subject_uuid}
                    error={formik.errors.subject_uuid}
                >
                    <SubjectSearch
                        onSubjectSelect={handleSubjectSelect}
                        selectedSubject={selectedSubject}
                    />
                </FormField>

                <FormField
                    name="teacher_uuid"
                    label="Викладач"
                    touched={formik.touched.teacher_uuid}
                    error={formik.errors.teacher_uuid}
                >
                    <TeacherSearch
                        onTeacherSelect={handleTeacherSelect}
                        selectedTeacher={selectedTeacher}
                    />
                </FormField>

                <FormField
                    name="room_uuid"
                    label="Аудиторія"
                    touched={formik.touched.room_uuid}
                    error={formik.errors.room_uuid}
                >
                    <RoomSearch
                        onRoomSelect={handleRoomSelect}
                        selectedRoom={selectedRoom}
                    />
                </FormField>

                <FormActions
                    submitLabel="Оновити пару"
                    submitLoadingLabel="Оновлення..."
                    onCancel={handleCancel}
                    cancelLabel="Скасувати"
                    isSubmitting={formik.isSubmitting}
                />
            </FormCard>
        </Modal>
    );
};

export default EditLessonModal;
