import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import type { MessageInstance } from "antd/es/message/interface";
import { updatePassword } from "../../../../api/client/client.ts";
import { FormCard } from "../../../Forms/formStyled.ts";
import FormField from "../../../Forms/FormField.tsx";
import FormActions from "../../../Forms/FormActions.tsx";
import { useFormSubmit } from "../../../Forms/useFormSubmit.ts";

const ChangePasswordSchema = Yup.object().shape({
    currentPassword: Yup.string().required('Поточний пароль обов\'язковий'),
    newPassword: Yup.string()
        .min(8, 'Пароль має містити не менше 8 символів')
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!#%^:;.,`~'"*?&+=\-_()]{8,}$/g,
            "Пароль повинен містити великі та малі літери, принаймні одну цифру",
        )
        .required('Новий пароль обов\'язковий'),
    verifyPassword: Yup.string()
        .oneOf([Yup.ref('newPassword'), undefined], 'Підтвердження має співпадати з новим паролем')
        .required('Підтвердження нового паролю обов\'язкове'),
});

interface ChangePasswordFormProps {
    onSuccess?: () => void;
    onCancel?: () => void;
    /** External messageApi — when provided, toasts survive form unmount. */
    messageApi?: MessageInstance;
}

const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({ onSuccess, onCancel, messageApi }) => {
    const { onSubmit, contextHolder } = useFormSubmit({
        submit: (values: { currentPassword: string; newPassword: string; verifyPassword: string }) =>
            updatePassword({
                old_password: values.currentPassword,
                new_password: values.newPassword,
                verify_password: values.verifyPassword,
            }),
        successTo: onSuccess ? undefined : '/profile',
        successMessage: 'Пароль змінено успішно',
        onSuccess,
        messageApi,
    });

    const formik = useFormik({
        initialValues: {
            currentPassword: '',
            newPassword: '',
            verifyPassword: '',
        },
        validationSchema: ChangePasswordSchema,
        onSubmit,
    });

    return (
        <FormCard onSubmit={formik.handleSubmit} noValidate>
            {contextHolder}

            <FormField
                {...formik.getFieldProps('currentPassword')}
                label="Поточний пароль"
                type="password"
                autoComplete="current-password"
                touched={formik.touched.currentPassword}
                error={formik.errors.currentPassword}
            />

            <FormField
                {...formik.getFieldProps('newPassword')}
                label="Новий пароль"
                type="password"
                autoComplete="new-password"
                helper="Мінімум 8 символів, велика та мала літери, цифра."
                touched={formik.touched.newPassword}
                error={formik.errors.newPassword}
            />

            <FormField
                {...formik.getFieldProps('verifyPassword')}
                label="Підтвердження нового паролю"
                type="password"
                autoComplete="new-password"
                touched={formik.touched.verifyPassword}
                error={formik.errors.verifyPassword}
            />

            <FormActions
                submitLabel="Змінити пароль"
                submitLoadingLabel="Збереження..."
                cancelTo={onCancel ? undefined : "/profile"}
                onCancel={onCancel}
                isSubmitting={formik.isSubmitting}
            />
        </FormCard>
    );
};

export default ChangePasswordForm;
