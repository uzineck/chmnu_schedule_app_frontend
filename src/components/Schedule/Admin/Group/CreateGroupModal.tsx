import React, { useState } from "react";
import { Modal } from "antd";
import type { MessageInstance } from "antd/es/message/interface";
import { useFormik } from "formik";
import * as Yup from "yup";
import styled from "styled-components";
import { Faculty } from "../../../../models/faculty/Faculty.ts";
import { GroupWithHeadman } from "../../../../models/group/GroupWithHeadman.ts";
import { createGroup } from "../../../../api/schedule/group.ts";
import { ApiCallError } from "../../../../api/errors.ts";
import { FormCard, FormFieldRow } from "../../../Forms/formStyled.ts";
import FormField from "../../../Forms/FormField.tsx";
import FormActions from "../../../Forms/FormActions.tsx";
import FacultySearch from "../../Faculty/FacultySearch.tsx";

const CheckboxRow = styled.label`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.textPrimary};
    font-size: 0.9rem;
    cursor: pointer;

    input[type='checkbox'] {
        width: 1.1rem;
        height: 1.1rem;
        cursor: pointer;
        accent-color: ${({ theme }) => theme.colors.primary};
    }
`;

const CreateGroupValidationSchema = Yup.object().shape({
    number: Yup.string().required("Номер групи обов'язковий"),
    faculty_uuid: Yup.string().required("Факультет обов'язковий"),
    headman_email: Yup.string().email("Невірний формат email").required("Email старости обов'язковий"),
    has_subgroups: Yup.boolean().required(""),
});

interface CreateGroupModalProps {
    open: boolean;
    onClose: () => void;
    onCreated: (group: GroupWithHeadman) => void;
    messageApi: MessageInstance;
}

const CreateGroupModal: React.FC<CreateGroupModalProps> = ({ open, onClose, onCreated, messageApi }) => {
    const [selectedFaculty, setSelectedFaculty] = useState<Faculty | null>(null);

    const formik = useFormik({
        initialValues: {
            number: '',
            faculty_uuid: '',
            headman_email: '',
            has_subgroups: true,
        },
        validationSchema: CreateGroupValidationSchema,
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            messageApi.loading({ key: "create-group", content: "Створення..." });
            try {
                const response = await createGroup({
                    number: values.number,
                    headman_email: values.headman_email,
                    faculty_uuid: values.faculty_uuid,
                    has_subgroups: values.has_subgroups,
                });
                messageApi.success({ key: "create-group", content: "Групу створено", duration: 2 });
                onCreated(response.data);
                resetForm();
                setSelectedFaculty(null);
                onClose();
            } catch (error) {
                const text = error instanceof ApiCallError ? error.message : "Виникла невідома помилка";
                messageApi.error({ key: "create-group", content: text, duration: 3 });
            } finally {
                setSubmitting(false);
            }
        },
    });

    const handleFacultySelect = (faculty: Faculty | null) => {
        setSelectedFaculty(faculty);
        formik.setFieldValue('faculty_uuid', faculty ? faculty.uuid : '');
    };

    const handleCancel = () => {
        if (formik.isSubmitting) return;
        formik.resetForm();
        setSelectedFaculty(null);
        onClose();
    };

    return (
        <Modal
            open={open}
            onCancel={handleCancel}
            footer={null}
            title="Створити групу"
            centered
            destroyOnClose
        >
            <FormCard onSubmit={formik.handleSubmit} noValidate>
                <FormField
                    {...formik.getFieldProps('number')}
                    label="Номер групи"
                    type="text"
                    touched={formik.touched.number}
                    error={formik.errors.number}
                />

                <FormField
                    {...formik.getFieldProps('headman_email')}
                    label="Email старости"
                    type="email"
                    autoComplete="email"
                    touched={formik.touched.headman_email}
                    error={formik.errors.headman_email}
                />

                <FormField
                    name="faculty_uuid"
                    label="Факультет групи"
                    touched={formik.touched.faculty_uuid}
                    error={formik.errors.faculty_uuid}
                >
                    <FacultySearch
                        onFacultySelect={handleFacultySelect}
                        selectedFaculty={selectedFaculty}
                    />
                </FormField>

                <FormFieldRow>
                    <CheckboxRow>
                        <input
                            id="has_subgroups"
                            type="checkbox"
                            name="has_subgroups"
                            checked={formik.values.has_subgroups}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        Група має підгрупи
                    </CheckboxRow>
                </FormFieldRow>

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

export default CreateGroupModal;
