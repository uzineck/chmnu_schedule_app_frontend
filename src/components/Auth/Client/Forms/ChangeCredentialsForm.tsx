import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import type { MessageInstance } from "antd/es/message/interface";
import { updateCredentials } from "../../../../api/client/client.ts";
import { useAuth } from "../../Context/hooks/useAuth.ts";
import { FormCard } from "../../../Forms/formStyled.ts";
import FormField from "../../../Forms/FormField.tsx";
import FormActions from "../../../Forms/FormActions.tsx";
import { useFormSubmit } from "../../../Forms/useFormSubmit.ts";

const ChangeCredentialsSchema = Yup.object().shape({
    lastName: Yup.string().required('Прізвище обов\'язкове'),
    firstName: Yup.string().required('Ім\'я обов\'язкове'),
    middleName: Yup.string().required('Ім\'я по-батькові обов\'язкове'),
});

interface ChangeCredentialsFormProps {
    onSuccess?: () => void;
    onCancel?: () => void;
    /** External messageApi — when provided, toasts survive form unmount. */
    messageApi?: MessageInstance;
}

const ChangeCredentialsForm: React.FC<ChangeCredentialsFormProps> = ({ onSuccess, onCancel, messageApi }) => {
    const { client, updateClient } = useAuth();

    const { onSubmit, contextHolder } = useFormSubmit({
        submit: async (values: { lastName: string; firstName: string; middleName: string }) => {
            const result = await updateCredentials({
                first_name: values.firstName,
                last_name: values.lastName,
                middle_name: values.middleName,
            });
            updateClient();
            return result;
        },
        successTo: onSuccess ? undefined : '/profile',
        successMessage: 'Повне ім\'я змінено успішно',
        onSuccess,
        messageApi,
    });

    const formik = useFormik({
        initialValues: {
            lastName: client?.last_name || '',
            firstName: client?.first_name || '',
            middleName: client?.middle_name || '',
        },
        validationSchema: ChangeCredentialsSchema,
        onSubmit,
    });

    return (
        <FormCard onSubmit={formik.handleSubmit} noValidate>
            {contextHolder}

            <FormField
                {...formik.getFieldProps('lastName')}
                label="Прізвище"
                type="text"
                autoComplete="family-name"
                touched={formik.touched.lastName}
                error={formik.errors.lastName}
            />

            <FormField
                {...formik.getFieldProps('firstName')}
                label="Ім'я"
                type="text"
                autoComplete="given-name"
                touched={formik.touched.firstName}
                error={formik.errors.firstName}
            />

            <FormField
                {...formik.getFieldProps('middleName')}
                label="Ім'я по-батькові"
                type="text"
                autoComplete="additional-name"
                touched={formik.touched.middleName}
                error={formik.errors.middleName}
            />

            <FormActions
                submitLabel="Зберегти зміни"
                submitLoadingLabel="Збереження..."
                cancelTo={onCancel ? undefined : "/profile"}
                onCancel={onCancel}
                isSubmitting={formik.isSubmitting}
            />
        </FormCard>
    );
};

export default ChangeCredentialsForm;
