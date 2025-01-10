import React from 'react';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import { updateEmail } from "../../../../api/client/client.ts";
import { useNavigate } from "react-router-dom";
import { ApiCallError } from "../../../../api/errors.ts";
import { message } from "antd";

import {useAuth} from "../../Context/hooks/useAuth.ts";
import {ErrorMessage, FormCard, FormInputGroup, FormInput, FormLabel, SubmitButton} from "./formikFormStyled.ts";

const ChangeEmailSchema = Yup.object().shape({
    email: Yup.string()
        .email('Невірний формат email')
        .matches(/^[a-zA-Z0-9_.+-]+@gmail\.com$/g, 'Невірний домен email, використовуйте @gmail.com')
        .required('Email обов\'язковий'),
    password: Yup.string()
        .required('Паролько обов\'язковий'),
});

const ChangeEmailForm: React.FC = () => {
    const { loginProp } = useAuth()
    const [messageApi, contextHolder] = message.useMessage();
    const navigate = useNavigate();
    const key = 'updatable';

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: ChangeEmailSchema,
        onSubmit: async (values, { setSubmitting }) => {
            messageApi.loading({ key: key, content: 'Завантаження...' });
            try {
                const response = await updateEmail({
                    new_email: values.email,
                    password: values.password,
                });
                loginProp(response.data.access_token)
                navigate('/profile', {
                    state: { successMessage: 'Email змінено успішно' },
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
                <FormLabel htmlFor="email">Новий email</FormLabel>
                <FormInput
                    id="email"
                    type="email"
                    {...formik.getFieldProps('email')}
                />
                {formik.touched.email && formik.errors.email && (
                    <ErrorMessage>{formik.errors.email}</ErrorMessage>
                )}
            </FormInputGroup>
            <FormInputGroup>
                <FormLabel htmlFor="password">Пароль</FormLabel>
                <FormInput
                    id="password"
                    type="password"
                    {...formik.getFieldProps('password')}
                />
                {formik.touched.password && formik.errors.password && (
                    <ErrorMessage>{formik.errors.password}</ErrorMessage>
                )}
            </FormInputGroup>

            <SubmitButton type="submit" disabled={formik.isSubmitting}>
                {formik.isSubmitting ? 'Збереження...' : 'Змінити'}
            </SubmitButton>
        </FormCard>
    );
};

export default ChangeEmailForm;
