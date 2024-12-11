import { useFormik } from 'formik';
import * as Yup from 'yup';
import { login } from '../../../api/client/auth.ts';
import './Login.css';
import { useAuth } from '../Context/AuthProvider.tsx';
import { useNavigate } from 'react-router-dom';
import {useState} from "react";
import {ApiCallError} from "../../../api/errors.ts";

const LoginSchema = Yup.object().shape({
    email: Yup.string()
        .email('Invalid email format')
        .required('Email is required'),
    password: Yup.string()
        .required('Password is required'),
});

const Login = () => {
    const { loginProp } = useAuth();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: LoginSchema,
        onSubmit: async (values, { setSubmitting }) => {
            setErrorMessage(null);
            try {
                const response = await login({
                    email: values.email,
                    password: values.password,
                });
                loginProp( response.data.access_token, response.data.refresh_token );
                navigate('/');
            } catch (error) {
                if (error instanceof ApiCallError) {
                    setErrorMessage(error.message);
                } else {
                    setErrorMessage("An unknown error occurred");
                }
            } finally {
                setSubmitting(false);
            }
        },
    });

    return (
        <div className="login-page">
            <div className="login-container full-page">
                <h1 className="login-title">Welcome Back</h1>
                <p className="login-subtitle">Log in to your schedule account</p>

                {errorMessage && <div className="error-message">{errorMessage}</div>}

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
