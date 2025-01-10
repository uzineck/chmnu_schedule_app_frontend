import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {message} from "antd";
import {useNavigate} from "react-router-dom";
import { updatePassword } from "../../../../api/client/client.ts";
import {ApiCallError} from "../../../../api/errors.ts";
import {ErrorMessage, FormCard, FormInputGroup, FormInput, FormLabel, SubmitButton} from "./formikFormStyled.ts";

const ChangePasswordSchema = Yup.object().shape({
    currentPassword: Yup.string().required('Поточний пароль обов\'язковий'),
    newPassword: Yup.string()
        .min(8, 'Пароль має містити не меньше 8 символів')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!#%^:;.,`~'"*?&+=\-_()]{8,}$/g,
        "Пароль повинен містити як великі, так і малі літери, принаймні одну цифру, і може містити тільки такі" +
        "символи !@#$%^:;.,&*?`~\\'\"+=-_")
        .required('Новий пароль обов\'язковий'),
    verifyPassword: Yup.string()
        .oneOf([Yup.ref('newPassword'), undefined], 'Підтвердження паролю має співпадати з новим паролем')
        .required('Підтвердження нового паролю обов\'язкове'),
});

const ChangePasswordForm: React.FC = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const navigate = useNavigate();
    const key = 'updatable';

    const formik = useFormik({
        initialValues: {
            currentPassword: '',
            newPassword: '',
            verifyPassword: '',
        },
        validationSchema: ChangePasswordSchema,
        onSubmit: async (values, { setSubmitting }) => {
            messageApi.loading({ key: key, content: 'Завантаження...' });
            try {
                await updatePassword({
                    old_password: values.currentPassword,
                    new_password: values.newPassword,
                    verify_password: values.verifyPassword,
                });
                navigate('/profile', {
                    state: { successMessage: 'Пароль змінено успішно' },
                });
            } catch (error) {
                if (error instanceof ApiCallError) {
                    messageApi.error({ key: key, content: error.message, duration: 3 });
                } else {
                    messageApi.error({ key: key, content: "Виникла невідома помилка", duration: 3 });
                }
            } finally {
                setSubmitting(false);
            }
        },
    });

    return (
        <FormCard onSubmit={formik.handleSubmit}>
            {contextHolder}
            <FormInputGroup>
                <FormLabel htmlFor="currentPassword">Поточний пароль</FormLabel>
                <FormInput
                    id="currentPassword"
                    type="password"
                    {...formik.getFieldProps('currentPassword')}
                />
                {formik.touched.currentPassword && formik.errors.currentPassword && (
                    <ErrorMessage>{formik.errors.currentPassword}</ErrorMessage>
                )}
            </FormInputGroup>

            <FormInputGroup>
                <FormLabel htmlFor="newPassword">Новий пароль</FormLabel>
                <FormInput
                    id="newPassword"
                    type="password"
                    {...formik.getFieldProps('newPassword')}
                />
                {formik.touched.newPassword && formik.errors.newPassword && (
                    <ErrorMessage>{formik.errors.newPassword}</ErrorMessage>
                )}
            </FormInputGroup>

            <FormInputGroup>
                <FormLabel htmlFor="verifyPassword">Підтвердження нового паролю</FormLabel>
                <FormInput
                    id="verifyPassword"
                    type="password"
                    {...formik.getFieldProps('verifyPassword')}
                />
                {formik.touched.verifyPassword && formik.errors.verifyPassword && (
                    <ErrorMessage>{formik.errors.verifyPassword}</ErrorMessage>
                )}
            </FormInputGroup>

            <SubmitButton type="submit" disabled={formik.isSubmitting}>
                {formik.isSubmitting ? 'Збереження...' : 'Змінити'}
            </SubmitButton>
        </FormCard>
    );
};

export default ChangePasswordForm;
