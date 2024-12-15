import { useFormik } from 'formik';
import * as Yup from 'yup';
import { login } from '../../../api/client/auth.ts';
import './module.css';
import { useNavigate } from 'react-router-dom';
import { ApiCallError } from "../../../api/errors.ts";
import {message} from "antd";
import {useAuth} from "../Context/hooks/useAuth.ts";

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
                    state: { loginMessage: "Logged in successfully!" },
                });
            } catch (error) {
                if (error instanceof ApiCallError) {
                    messageApi.error({ key: key, content: error.message, duration: 2 });
                } else {
                    messageApi.error({ key: key, content: "Unknown error occurred.", duration: 2 });
                }
            } finally {
                setSubmitting(false);
            }
        },
    });

    return (
        <div className="login-page">
            {contextHolder}
            <div className="login-container">
                <div className="login-title">Log in to your schedule account</div>

                <form onSubmit={formik.handleSubmit} className="login-form">
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            className="form-control"
                            {...formik.getFieldProps('email')}
                        />
                        {formik.touched.email && formik.errors.email && (
                            <div className="error-message">{formik.errors.email}</div>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            className="form-control"
                            {...formik.getFieldProps('password')}
                        />
                        {formik.touched.password && formik.errors.password && (
                            <div className="error-message">{formik.errors.password}</div>
                        )}
                    </div>

                    {formik.status && (
                        <div className="status-message error">{formik.status}</div>
                    )}

                    <button
                        type="submit"
                        className="submit-button"
                        disabled={formik.isSubmitting}
                    >
                        {formik.isSubmitting ? 'Logging in...' : 'Log In'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
