import { useState } from "react";
import { Modal, message } from "antd";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Subject } from "../../../../models/subject/Subject.ts";
import { Teacher } from "../../../../models/teacher/Teacher.ts";
import { Room } from "../../../../models/room/Room.ts";
import { LessonType, lessonTypeOptionsUa } from "../../../../models/enums/LessonType.ts";
import { OrdinaryNumber } from "../../../../models/enums/OrdinaryNumber.ts";
import { Subgroup } from "../../../../models/enums/Subgroup.ts";
import { LessonSchema } from "../../../../models/lesson/request/LessonSchema.ts";
import { createLesson } from "../../../../api/schedule/lesson.ts";
import { addLessonToGroupAdmin, addLessonToGroupHeadman } from "../../../../api/schedule/group.ts";
import { ApiCallError, ConflictError } from "../../../../api/errors.ts";
import { useSchedule } from "../../Context/hooks/useSchedule.ts";
import { useScheduleEditTarget } from "../../hooks/useScheduleEditTarget.ts";
import SubjectSearch from "../../Subject/SubjectSearch.tsx";
import TeacherSearch from "../../Teacher/TeacherSearchAsync.tsx";
import RoomSearch from "../../Room/RoomSearch.tsx";
import { FormCard, FormFieldSelect } from "../../../Forms/formStyled.ts";
import FormField from "../../../Forms/FormField.tsx";
import FormActions from "../../../Forms/FormActions.tsx";
import LessonTimeslotSelector from "./LessonTimeslotSelector.tsx";

const LAST_LESSON_TYPE_KEY = 'lastLessonType';

const readStoredLessonType = (): LessonType => {
    if (typeof window === 'undefined') return LessonType.LECTURE;
    const stored = localStorage.getItem(LAST_LESSON_TYPE_KEY);
    if (stored && (Object.values(LessonType) as string[]).includes(stored)) {
        return stored as LessonType;
    }
    return LessonType.LECTURE;
};

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

    const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
    const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

    const [extraOrds, setExtraOrds] = useState<Set<OrdinaryNumber>>(new Set());
    const [extraWeeks, setExtraWeeks] = useState<Set<boolean>>(new Set());
    const [extraSubgroups, setExtraSubgroups] = useState<Set<Subgroup>>(new Set());

    const resetExtras = () => {
        setExtraOrds(new Set());
        setExtraWeeks(new Set());
        setExtraSubgroups(new Set());
    };

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
            type: readStoredLessonType(),
        },
        validationSchema: CreateLessonValidationSchema,
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            if (!day || !ordinaryNumber || !groupUuid) {
                message.error({ content: "Створюйте пару тільки з панелі розкладу", duration: 3 });
                setSubmitting(false);
                return;
            }

            const allOrds = Array.from(new Set([ordinaryNumber, ...extraOrds]));
            const allWeeks = Array.from(new Set([isEvenWeek, ...extraWeeks]));
            const allSubgroups: (Subgroup | null)[] = subgroup !== null
                ? Array.from(new Set([subgroup, ...extraSubgroups]))
                : [null];

            // "Slot" = a single cell the user sees in the matrix (week × ord × subgroup).
            // That's what we count for the summary toast.
            const expected = allWeeks.length * allOrds.length * allSubgroups.length;

            let created = 0;
            let skipped = 0;
            let failed = 0;
            const failureMessages: string[] = [];

            message.loading({ key: "create-lesson", content: "Створення..." });

            // Each (week, ord) gets its own Lesson row; that Lesson is then
            // attached to every selected subgroup. We continue past per-slot
            // errors so a single conflict doesn't abort the whole batch.
            for (const w of allWeeks) {
                for (const ord of allOrds) {
                    let newLessonUuid: string | null = null;
                    try {
                        const lessonData: LessonSchema = {
                            schema: {
                                subject_uuid: values.subject_uuid,
                                teacher_uuid: values.teacher_uuid,
                                room_uuid: values.room_uuid,
                            },
                            lesson_schema: {
                                type: values.type,
                                timeslot: { day, ord_number: ord, is_even: w },
                            },
                        };
                        const response = await createLesson(lessonData);
                        newLessonUuid = response.data.uuid;
                    } catch (error) {
                        // createLesson failed for every subgroup at this (week, ord).
                        failed += allSubgroups.length;
                        if (error instanceof ApiCallError) failureMessages.push(error.message);
                    }

                    if (!newLessonUuid) continue;

                    for (const sg of allSubgroups) {
                        try {
                            if (mode === 'headman') {
                                await addLessonToGroupHeadman(newLessonUuid, sg);
                            } else {
                                await addLessonToGroupAdmin(groupUuid, newLessonUuid, sg);
                            }
                            created++;
                        } catch (error) {
                            // ConflictError = slot already occupied for this
                            // group/subgroup. Treat as skipped, not failed.
                            if (error instanceof ConflictError) {
                                skipped++;
                            } else {
                                failed++;
                                if (error instanceof ApiCallError) failureMessages.push(error.message);
                            }
                        }
                    }
                }
            }

            if (created === expected) {
                const label = expected > 1
                    ? `Створено ${expected} пар`
                    : "Пару успішно створено";
                message.success({ key: "create-lesson", content: label, duration: 2 });
            } else if (created > 0) {
                const parts = [`Створено: ${created}`];
                if (skipped > 0) parts.push(`пропущено: ${skipped}`);
                if (failed > 0) parts.push(`помилок: ${failed}`);
                message.warning({ key: "create-lesson", content: parts.join(", "), duration: 4 });
            } else {
                const hint = failureMessages[0] ?? (skipped > 0 ? "усі слоти вже зайняті" : "не вдалося створити пару");
                message.error({ key: "create-lesson", content: hint, duration: 4 });
            }

            if (created > 0) {
                localStorage.setItem(LAST_LESSON_TYPE_KEY, values.type);
                resetForm();
                setSelectedSubject(null);
                setSelectedTeacher(null);
                setSelectedRoom(null);
                resetExtras();
                onSuccess();
            }
            setSubmitting(false);
        },
    });

    const handleCancel = () => {
        if (formik.isSubmitting) return;
        formik.resetForm();
        setSelectedSubject(null);
        setSelectedTeacher(null);
        setSelectedRoom(null);
        resetExtras();
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
            <FormCard onSubmit={formik.handleSubmit} noValidate>
                {day && ordinaryNumber && (
                    <LessonTimeslotSelector
                        currentOrd={ordinaryNumber}
                        currentIsEven={isEvenWeek}
                        currentSubgroup={subgroup}
                        extraOrds={extraOrds}
                        extraWeeks={extraWeeks}
                        extraSubgroups={extraSubgroups}
                        onExtraOrdsChange={setExtraOrds}
                        onExtraWeeksChange={setExtraWeeks}
                        onExtraSubgroupsChange={setExtraSubgroups}
                    />
                )}

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
