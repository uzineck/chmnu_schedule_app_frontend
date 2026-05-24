import React from "react";
import { Modal } from "antd";
import type { MessageInstance } from "antd/es/message/interface";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Teacher } from "../../../../models/teacher/Teacher.ts";
import { createTeacher } from "../../../../api/schedule/teacher.ts";
import { ApiCallError } from "../../../../api/errors.ts";
import { rankOptionsUa, TeacherRanks } from "../../../../models/enums/TeacherRanks.ts";
import { FormCard, FormFieldSelect } from "../../../Forms/formStyled.ts";
import FormField from "../../../Forms/FormField.tsx";
import FormActions from "../../../Forms/FormActions.tsx";

const CreateTeacherValidationSchema = Yup.object().shape({
    first_name: Yup.string().required("Ім'я обов'язкове"),
    last_name: Yup.string().required("Прізвище обов'язкове"),
    middle_name: Yup.string().required("Ім'я по-батькові обов'язкове"),
    rank: Yup.string()
        .oneOf(Object.values(TeacherRanks), "Невірне звання")
        .required("Звання обов'язкове"),
});

interface CreateTeacherModalProps {
    open: boolean;
    onClose: () => void;
    onCreated: (teacher: Teacher) => void;
    messageApi: MessageInstance;
}

const CreateTeacherModal: React.FC<CreateTeacherModalProps> = ({ open, onClose, onCreated, messageApi }) => {
    const formik = useFormik<{
        first_name: string;
        last_name: string;
        middle_name: string;
        rank: TeacherRanks;
    }>({
        initialValues: {
            first_name: '',
            last_name: '',
            middle_name: '',
            rank: TeacherRanks.LECTURER,
        },
        validationSchema: CreateTeacherValidationSchema,
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            messageApi.loading({ key: "create-teacher", content: "Створення..." });
            try {
                const response = await createTeacher({
                    first_name: values.first_name,
                    last_name: values.last_name,
                    middle_name: values.middle_name,
                    rank: values.rank,
                });
                messageApi.success({ key: "create-teacher", content: "Викладача створено", duration: 2 });
                onCreated(response.data);
                resetForm();
                onClose();
            } catch (error) {
                const text = error instanceof ApiCallError ? error.message : "Виникла невідома помилка";
                messageApi.error({ key: "create-teacher", content: text, duration: 3 });
            } finally {
                setSubmitting(false);
            }
        },
    });

    const handleCancel = () => {
        if (formik.isSubmitting) return;
        formik.resetForm();
        onClose();
    };

    return (
        <Modal
            open={open}
            onCancel={handleCancel}
            footer={null}
            title="Створити викладача"
            centered
            destroyOnClose
        >
            <FormCard onSubmit={formik.handleSubmit} noValidate>
                <FormField
                    {...formik.getFieldProps('last_name')}
                    label="Прізвище"
                    type="text"
                    autoComplete="family-name"
                    touched={formik.touched.last_name}
                    error={formik.errors.last_name}
                />
                <FormField
                    {...formik.getFieldProps('first_name')}
                    label="Ім'я"
                    type="text"
                    autoComplete="given-name"
                    touched={formik.touched.first_name}
                    error={formik.errors.first_name}
                />
                <FormField
                    {...formik.getFieldProps('middle_name')}
                    label="По-батькові"
                    type="text"
                    autoComplete="additional-name"
                    touched={formik.touched.middle_name}
                    error={formik.errors.middle_name}
                />
                <FormField
                    name="rank"
                    label="Звання"
                    touched={formik.touched.rank}
                    error={formik.errors.rank}
                >
                    <FormFieldSelect
                        id="rank"
                        $hasError={Boolean(formik.touched.rank && formik.errors.rank)}
                        {...formik.getFieldProps('rank')}
                    >
                        {rankOptionsUa.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </FormFieldSelect>
                </FormField>

                <FormActions
                    submitLabel="Створити"
                    submitLoadingLabel="Створення..."
                    onCancel={handleCancel}
                    isSubmitting={formik.isSubmitting}
                />
            </FormCard>
        </Modal>
    );
};

export default CreateTeacherModal;
