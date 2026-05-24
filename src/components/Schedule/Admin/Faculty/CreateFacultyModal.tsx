import React from "react";
import { Modal } from "antd";
import type { MessageInstance } from "antd/es/message/interface";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Faculty } from "../../../../models/faculty/Faculty.ts";
import { createFaculty } from "../../../../api/schedule/faculty.ts";
import { ApiCallError } from "../../../../api/errors.ts";
import { FormCard } from "../../../Forms/formStyled.ts";
import FormField from "../../../Forms/FormField.tsx";
import FormActions from "../../../Forms/FormActions.tsx";

const CreateFacultyValidationSchema = Yup.object().shape({
    name: Yup.string().required("Назва факультету обов'язкова"),
    code_name: Yup.string().required("Абривіатура факультету обов'язкова"),
});

interface CreateFacultyModalProps {
    open: boolean;
    onClose: () => void;
    onCreated: (faculty: Faculty) => void;
    messageApi: MessageInstance;
}

const CreateFacultyModal: React.FC<CreateFacultyModalProps> = ({ open, onClose, onCreated, messageApi }) => {
    const formik = useFormik({
        initialValues: { name: '', code_name: '' },
        validationSchema: CreateFacultyValidationSchema,
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            messageApi.loading({ key: "create-faculty", content: "Створення..." });
            try {
                const response = await createFaculty({
                    name: values.name,
                    code_name: values.code_name,
                });
                messageApi.success({ key: "create-faculty", content: "Факультет створено", duration: 2 });
                onCreated(response.data);
                resetForm();
                onClose();
            } catch (error) {
                const text = error instanceof ApiCallError ? error.message : "Виникла невідома помилка";
                messageApi.error({ key: "create-faculty", content: text, duration: 3 });
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
            title="Створити факультет"
            centered
            destroyOnClose
        >
            <FormCard onSubmit={formik.handleSubmit} noValidate>
                <FormField
                    {...formik.getFieldProps('name')}
                    label="Назва факультету"
                    type="text"
                    touched={formik.touched.name}
                    error={formik.errors.name}
                />

                <FormField
                    {...formik.getFieldProps('code_name')}
                    label="Абривіатура"
                    type="text"
                    touched={formik.touched.code_name}
                    error={formik.errors.code_name}
                />

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

export default CreateFacultyModal;
