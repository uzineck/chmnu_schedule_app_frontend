import { useState } from "react";
import { Modal, message } from "antd";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Subject } from "../../../../models/subject/Subject.ts";
import { Teacher } from "../../../../models/teacher/Teacher.ts";
import { Room } from "../../../../models/room/Room.ts";
import { LessonType, lessonTypeOptionsUa } from "../../../../models/enums/LessonType.ts";
import { LessonSchema } from "../../../../models/lesson/request/LessonSchema.ts";
import { createLesson } from "../../../../api/schedule/lesson.ts";
import { addLessonToGroupAdmin, addLessonToGroupHeadman } from "../../../../api/schedule/group.ts";
import { ApiCallError } from "../../../../api/errors.ts";
import { useSchedule } from "../../Context/hooks/useSchedule.ts";
import { useScheduleEditTarget } from "../../hooks/useScheduleEditTarget.ts";
import SubjectSearch from "../../Subject/SubjectSearch.tsx";
import TeacherSearch from "../../Teacher/TeacherSearchAsync.tsx";
import RoomSearch from "../../Room/RoomSearch.tsx";
import { FormCard, FormFieldSelect } from "../../../Forms/formStyled.ts";
import FormField from "../../../Forms/FormField.tsx";
import FormActions from "../../../Forms/FormActions.tsx";

const CreateLessonValidationSchema = Yup.object().shape({
    subject_uuid: Yup.string().required("Оберіть дисципліну"),
    teacher_uuid: Yup.string().required("Оберіть викладача"),
    room_uuid: Yup.string().required("Оберіть аудиторію"),
    type: Yup.string()
        .oneOf(Object.values(LessonType), "Невірний тип заняття")
        .required("Тип заняття обов'язковий"),
});

interface CreateLessonModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const CreateLessonModal = ({ open, onClose, onSuccess }: CreateLessonModalProps) => {
    const { day, ordinaryNumber, isEvenWeek, groupUuid, subgroup } = useSchedule();
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
        validationSchema: CreateLessonValidationSchema,
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            if (!day || !ordinaryNumber || !groupUuid) {
                messageApi.error({ content: "Створюйте пару тільки з панелі розкладу", duration: 3 });
                setSubmitting(false);
                return;
            }
            messageApi.loading({ key: "create-lesson", content: "Створення..." });
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
                const createResponse = await createLesson(lessonData);
                const newLessonUuid = createResponse.data.uuid;
                if (mode === 'headman') {
                    await addLessonToGroupHeadman(newLessonUuid, subgroup);
                } else {
                    await addLessonToGroupAdmin(groupUuid, newLessonUuid, subgroup);
                }
                messageApi.success({ key: "create-lesson", content: "Пару успішно створено", duration: 2 });
                resetForm();
                setSelectedSubject(null);
                setSelectedTeacher(null);
                setSelectedRoom(null);
                onSuccess();
            } catch (error) {
                const text = error instanceof ApiCallError ? error.message : "Виникла невідома помилка";
                messageApi.error({ key: "create-lesson", content: text, duration: 3 });
            } finally {
                setSubmitting(false);
            }
        },
    });

    const handleCancel = () => {
        if (formik.isSubmitting) return;
        formik.resetForm();
        setSelectedSubject(null);
        setSelectedTeacher(null);
        setSelectedRoom(null);
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
            title="Створити пару"
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
                    submitLabel="Створити пару"
                    submitLoadingLabel="Створення..."
                    onCancel={handleCancel}
                    cancelLabel="Скасувати"
                    isSubmitting={formik.isSubmitting}
                />
            </FormCard>
        </Modal>
    );
};

export default CreateLessonModal;
