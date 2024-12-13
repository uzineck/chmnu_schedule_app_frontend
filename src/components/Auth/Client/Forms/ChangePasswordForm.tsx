import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import './module.css';
import {message} from "antd";
import {useNavigate} from "react-router-dom";
import { updatePassword } from "../../../../api/client/client.ts";
import {ApiCallError} from "../../../../api/errors.ts";

const ChangePasswordSchema = Yup.object().shape({
    currentPassword: Yup.string().required('Current password is required'),
    newPassword: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .required('New password is required'),
    verifyPassword: Yup.string()
        .oneOf([Yup.ref('newPassword'), undefined], 'Password must match new password')
        .required('Please confirm your new password'),
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
            messageApi.open({
                key,
                type: 'loading',
                content: 'Loading...',
            });
            try {
                await updatePassword({
                    old_password: values.currentPassword,
                    new_password: values.newPassword,
                    verify_password: values.verifyPassword,
                });
                messageApi.open({
                    key,
                    type: 'success',
                    content: 'Password changed successfully!',
                    duration: 2,
                });
                navigate('/profile', { replace: true });
            } catch (error) {
                if (error instanceof ApiCallError) {
                    messageApi.open({
                        key,
                        type: 'error',
                        content: error.message,
                        duration: 2,
                    });
                } else {
                    messageApi.open({
                        key,
                        type: 'error',
                        content: "Unknown error occurred.",
                        duration: 2,
                    });
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
                <label htmlFor="currentPassword">Current Password</label>
                <input
                    id="currentPassword"
                    type="password"
                    className="form-control"
                    {...formik.getFieldProps('currentPassword')}
                />
                {formik.touched.currentPassword && formik.errors.currentPassword && (
                    <div className="error-message">{formik.errors.currentPassword}</div>
                )}
            </div>

            <div className="form-group">
                <label htmlFor="newPassword">New Password</label>
                <input
                    id="newPassword"
                    type="password"
                    className="form-control"
                    {...formik.getFieldProps('newPassword')}
                />
                {formik.touched.newPassword && formik.errors.newPassword && (
                    <div className="error-message">{formik.errors.newPassword}</div>
                )}
            </div>

            <div className="form-group">
                <label htmlFor="verifyPassword">Verify New Password</label>
                <input
                    id="verifyPassword"
                    type="password"
                    className="form-control"
                    {...formik.getFieldProps('verifyPassword')}
                />
                {formik.touched.verifyPassword && formik.errors.verifyPassword && (
                    <div className="error-message">{formik.errors.verifyPassword}</div>
                )}
            </div>

            <button type="submit" className="submit-button" disabled={formik.isSubmitting}>
                {formik.isSubmitting ? 'Saving...' : 'Save'}
            </button>
        </form>
    );
};

export default ChangePasswordForm;
