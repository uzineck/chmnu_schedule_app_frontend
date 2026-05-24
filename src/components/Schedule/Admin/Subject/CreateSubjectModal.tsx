import React from "react";
import { Modal } from "antd";
import type { MessageInstance } from "antd/es/message/interface";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Subject } from "../../../../models/subject/Subject.ts";
import { createSubject } from "../../../../api/schedule/subject.ts";
import { ApiCallError } from "../../../../api/errors.ts";
import { FormCard } from "../../../Forms/formStyled.ts";
import FormField from "../../../Forms/FormField.tsx";
import FormActions from "../../../Forms/FormActions.tsx";

const CreateSubjectValidationSchema = Yup.object().shape({
    title: Yup.string().required("Назва дисципліни обов'язкова"),
});

interface CreateSubjectModalProps {
    open: boolean;
    onClose: () => void;
    onCreated: (subject: Subject) => void;
    messageApi: MessageInstance;
}

const CreateSubjectModal: React.FC<CreateSubjectModalProps> = ({ open, onClose, onCreated, messageApi }) => {
    const formik = useFormik({
        initialValues: { title: '' },
        validationSchema: CreateSubjectValidationSchema,
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            messageApi.loading({ key: "create-subject", content: "Створення..." });
            try {
                const response = await createSubject({ title: values.title });
                messageApi.success({ key: "create-subject", content: "Дисципліну створено", duration: 2 });
                onCreated(response.data);
                resetForm();
                onClose();
            } catch (error) {
                const text = error instanceof ApiCallError ? error.message : "Виникла невідома помилка";
                messageApi.error({ key: "create-subject", content: text, duration: 3 });
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
            title="Створити дисципліну"
            centered
            destroyOnClose
        >
            <FormCard onSubmit={formik.handleSubmit} noValidate>
                <FormField
                    {...formik.getFieldProps('title')}
                    label="Назва дисципліни"
                    type="text"
                    touched={formik.touched.title}
                    error={formik.errors.title}
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

export default CreateSubjectModal;
