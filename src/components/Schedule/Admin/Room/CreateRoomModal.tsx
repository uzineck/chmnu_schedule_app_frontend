import React from "react";
import { Modal } from "antd";
import type { MessageInstance } from "antd/es/message/interface";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Room } from "../../../../models/room/Room.ts";
import { createRoom } from "../../../../api/schedule/room.ts";
import { ApiCallError } from "../../../../api/errors.ts";
import { FormCard } from "../../../Forms/formStyled.ts";
import FormField from "../../../Forms/FormField.tsx";
import FormActions from "../../../Forms/FormActions.tsx";

const CreateRoomValidationSchema = Yup.object().shape({
    number: Yup.string().required("Номер аудиторії обов'язковий"),
});

interface CreateRoomModalProps {
    open: boolean;
    onClose: () => void;
    onCreated: (room: Room) => void;
    messageApi: MessageInstance;
}

const CreateRoomModal: React.FC<CreateRoomModalProps> = ({ open, onClose, onCreated, messageApi }) => {
    const formik = useFormik({
        initialValues: { number: '' },
        validationSchema: CreateRoomValidationSchema,
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            messageApi.loading({ key: "create-room", content: "Створення..." });
            try {
                const response = await createRoom({ number: values.number });
                messageApi.success({ key: "create-room", content: "Аудиторію створено", duration: 2 });
                onCreated(response.data);
                resetForm();
                onClose();
            } catch (error) {
                const text = error instanceof ApiCallError ? error.message : "Виникла невідома помилка";
                messageApi.error({ key: "create-room", content: text, duration: 3 });
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
            title="Створити аудиторію"
            centered
            destroyOnClose
        >
            <FormCard onSubmit={formik.handleSubmit} noValidate>
                <FormField
                    {...formik.getFieldProps('number')}
                    label="Номер аудиторії"
                    type="text"
                    touched={formik.touched.number}
                    error={formik.errors.number}
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

export default CreateRoomModal;
