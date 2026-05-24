import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import type { MessageInstance } from "antd/es/message/interface";
import { updateEmail } from "../../../../api/client/client.ts";
import { useAuth } from "../../Context/hooks/useAuth.ts";
import { FormCard } from "../../../Forms/formStyled.ts";
import FormField from "../../../Forms/FormField.tsx";
import FormActions from "../../../Forms/FormActions.tsx";
import { useFormSubmit } from "../../../Forms/useFormSubmit.ts";

const ChangeEmailSchema = Yup.object().shape({
    email: Yup.string()
        .email('Невірний формат email')
        .required('Email обов\'язковий'),
    password: Yup.string()
        .required('Пароль обов\'язковий'),
});

interface ChangeEmailFormProps {
    onSuccess?: () => void;
    onCancel?: () => void;
    /** External messageApi — when provided, toasts survive form unmount. */
    messageApi?: MessageInstance;
}

const ChangeEmailForm: React.FC<ChangeEmailFormProps> = ({ onSuccess, onCancel, messageApi }) => {
    const { loginProp } = useAuth();

    const { onSubmit, contextHolder } = useFormSubmit({
        submit: async (values: { email: string; password: string }) => {
            const response = await updateEmail({
                new_email: values.email,
                password: values.password,
            });
            loginProp(response.data.access_token);
            return response;
        },
        successTo: onSuccess ? undefined : '/profile',
        successMessage: 'Email змінено успішно',
        onSuccess,
        messageApi,
    });

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: ChangeEmailSchema,
        onSubmit,
    });

    return (
        <FormCard onSubmit={formik.handleSubmit} noValidate>
            {contextHolder}

            <FormField
                {...formik.getFieldProps('email')}
                label="Новий email"
                type="email"
                autoComplete="email"
                touched={formik.touched.email}
                error={formik.errors.email}
            />

            <FormField
                {...formik.getFieldProps('password')}
                label="Пароль"
                type="password"
                autoComplete="current-password"
                touched={formik.touched.password}
                error={formik.errors.password}
            />

            <FormActions
                submitLabel="Змінити email"
                submitLoadingLabel="Збереження..."
                cancelTo={onCancel ? undefined : "/profile"}
                onCancel={onCancel}
                isSubmitting={formik.isSubmitting}
            />
        </FormCard>
    );
};

export default ChangeEmailForm;
