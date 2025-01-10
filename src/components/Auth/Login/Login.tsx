import { useFormik } from 'formik';
import * as Yup from 'yup';
import { login } from '../../../api/client/auth.ts';
import { useNavigate } from 'react-router-dom';
import { ApiCallError } from "../../../api/errors.ts";
import {message} from "antd";
import {useAuth} from "../Context/hooks/useAuth.ts";
import {
    ErrorMessage,
    FormInputGroup,
    FormInput,
    FormLabel,
    SubmitButton,
    FormSubmit
} from "../Client/Forms/formikFormStyled.ts";
import {FormTitle, FormPage, SmallFormDiv} from "../../Schedule/Lesson/Forms/formStyled.ts";

const LoginSchema = Yup.object().shape({
    email: Yup.string()
        .email('Невірний формат email')
        .matches(/^[a-zA-Z0-9_.+-]+@gmail\.com$/g, 'Невірний домен email, використовуйте @gmail.com')
        .required('Email обов\'язковий'),
    password: Yup.string()
        .required('Паролько обов\'язковий'),
});

const Login = () => {
    const { loginProp } = useAuth();
    const [messageApi, contextHolder] = message.useMessage();
    const navigate = useNavigate();
    const key = 'updatable';

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: LoginSchema,
        onSubmit: async (values, { setSubmitting }) => {
            messageApi.loading({ key: key, content: 'Завантаження...' });
            try {
                const response = await login({
                    email: values.email,
                    password: values.password,
                });
                loginProp(response.data.access_token);
                navigate("/", {
                    state: { successMessage: "Ви успішно увійшли у систему" },
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
        <FormPage>
            {contextHolder}
            <SmallFormDiv>
                <FormTitle>Увійдіть у свій акаунт розкладу</FormTitle>
                <FormSubmit onSubmit={formik.handleSubmit}>
                    <FormInputGroup>
                        <FormLabel htmlFor="email">Email</FormLabel>
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
                        {formik.isSubmitting ? 'Завантаження...' : 'Увійти'}
                    </SubmitButton>
                </FormSubmit>
            </SmallFormDiv>
        </FormPage>
    );
};

export default Login;
