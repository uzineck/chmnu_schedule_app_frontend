import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import './module.css';
import { updateEmail } from "../../../../api/client/client.ts";
import { useNavigate } from "react-router-dom";
import { ApiCallError } from "../../../../api/errors.ts";
import { message } from "antd";

import {useAuth} from "../../Context/hooks/useAuth.ts";

const ChangeEmailSchema = Yup.object().shape({
    email: Yup.string()
        .email('Invalid email format')
        .matches(/^[a-zA-Z0-9_.+-]+@gmail\.com$/g, 'Invalid email domain, use @gmail.com')
        .required('Email is required'),
    password: Yup.string()
        .required('Password is required'),
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
            messageApi.loading({ key: key, content: 'Loading...' });
            try {
                const response = await updateEmail({
                    new_email: values.email,
                    password: values.password,
                });
                loginProp(response.data.access_token, response.data.refresh_token)
                navigate('/profile', {
                    state: { changeEmail: 'Email changed successfully!' },
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
        <form onSubmit={formik.handleSubmit} className="form-container">
            {contextHolder}

            <div className="form-group">
                <label htmlFor="email">New Email</label>
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

            <button type="submit" className="submit-button" disabled={formik.isSubmitting}>
                {formik.isSubmitting ? 'Saving...' : 'Save'}
            </button>
        </form>
    );
};

export default ChangeEmailForm;
