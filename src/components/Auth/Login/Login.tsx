import { useFormik } from 'formik';
import * as Yup from 'yup';
import styled from "styled-components";
import { login } from '../../../api/client/auth.ts';
import {
    ApiCallError,
    AuthError,
    BadRequestError,
    NetworkError,
    RateLimitError,
    ServerError,
} from "../../../api/errors.ts";
import { useAuth } from "../Context/hooks/useAuth.ts";
import { FormCard } from "../../Forms/formStyled.ts";
import FormField from "../../Forms/FormField.tsx";
import FormActions from "../../Forms/FormActions.tsx";
import { useFormSubmit } from "../../Forms/useFormSubmit.ts";
import { media } from "../../../styles/media.ts";

const LoginPage = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    min-height: 100vh;
    padding: 1.5rem 0.75rem;
    gap: 16px;

    ${media.up('phone')} {
        padding: 2.5rem 1rem;
        gap: 20px;
    }

    ${media.up('tablet')} {
        padding: 4rem 1rem;
    }
`;

const LoginTitle = styled.h1`
    font-size: 1.1rem;
    font-weight: 700;
    color: ${({theme}) => theme.colors.textPrimary};
    text-align: center;
    margin: 0;

    ${media.up('phone')} {
        font-size: 1.35rem;
    }

    ${media.up('tablet')} {
        font-size: 1.5rem;
    }
`;

const LoginSchema = Yup.object().shape({
    email: Yup.string()
        .email('Невірний формат email')
        .required('Email обов\'язковий'),
    password: Yup.string()
        .required('Пароль обов\'язковий'),
});

const messageForError = (error: unknown): string => {
    if (error instanceof AuthError || error instanceof BadRequestError) {
        return error.message || "Невірний email або пароль";
    }
    if (error instanceof RateLimitError) {
        return error.message;
    }
    if (error instanceof NetworkError) {
        return "Не вдалось зв'язатись із сервером. Перевірте інтернет.";
    }
    if (error instanceof ServerError) {
        return "Помилка на сервері. Спробуйте пізніше.";
    }
    if (error instanceof ApiCallError) {
        return error.message || "Виникла невідома помилка";
    }
    return "Виникла невідома помилка";
};

const Login = () => {
    const { loginProp } = useAuth();

    const { onSubmit, contextHolder } = useFormSubmit({
        submit: async (values: { email: string; password: string }) => {
            const response = await login({ email: values.email, password: values.password });
            await loginProp(response.data.access_token);
            return response;
        },
        successTo: "/",
        successMessage: "Ви успішно увійшли у систему",
        loadingKey: "login",
        formatError: messageForError,
    });

    const formik = useFormik({
        initialValues: { email: '', password: '' },
        validationSchema: LoginSchema,
        onSubmit,
    });

    return (
        <LoginPage>
            {contextHolder}
            <LoginTitle>Увійдіть у свій акаунт розкладу</LoginTitle>

            <FormCard onSubmit={formik.handleSubmit} noValidate>
                <FormField
                    {...formik.getFieldProps('email')}
                    label="Email"
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
                    submitLabel="Увійти"
                    submitLoadingLabel="Вхід..."
                    cancelTo="/"
                    cancelLabel="На головну"
                    isSubmitting={formik.isSubmitting}
                />
            </FormCard>
        </LoginPage>
    );
};

export default Login;
