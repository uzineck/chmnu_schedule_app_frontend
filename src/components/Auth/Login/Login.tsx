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
        .email('Invalid email format')
        .matches(/^.*@gmail\.com$/g, 'Invalid email domain, use @gmail.com')
        .required('Email is required'),
    password: Yup.string()
        .required('Password is required'),
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
            messageApi.loading({ key: key, content: 'Loading...' });
            try {
                const response = await login({
                    email: values.email,
                    password: values.password,
                });
                loginProp(response.data.access_token, response.data.refresh_token);
                navigate("/", {
                    state: { successMessage: "Logged in successfully!" },
                });
            } catch (error) {
                if (error instanceof ApiCallError) {
                    messageApi.error({ key: key, content: error.message, duration: 3 });
                } else {
                    messageApi.error({ key: key, content: "Unknown error occurred.", duration: 3 });
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
                <FormTitle>Log in to your schedule account</FormTitle>
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
                        <FormLabel htmlFor="password">Password</FormLabel>
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
                        {formik.isSubmitting ? 'Logging in...' : 'Log In'}
                    </SubmitButton>
                </FormSubmit>
            </SmallFormDiv>
        </FormPage>
    );
};

export default Login;
