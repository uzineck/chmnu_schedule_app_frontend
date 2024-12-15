import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import './module.css';
import {updateCredentials} from "../../../../api/client/client.ts";
import {ApiCallError} from "../../../../api/errors.ts";
import {message} from "antd";
import {useNavigate} from "react-router-dom";

import {useAuth} from "../../Context/hooks/useAuth.ts";

const ChangeCredentialsSchema = Yup.object().shape({
    lastName: Yup.string().required('Last name is required'),
    firstName: Yup.string().required('First name is required'),
    middleName: Yup.string().required('Middle name is required'),
});

const ChangeCredentialsForm: React.FC = () => {
    const { client, updateClient } = useAuth();
    const [messageApi, contextHolder] = message.useMessage();
    const navigate = useNavigate();
    const key = 'updatable';

    const formik = useFormik({
        initialValues: {
            lastName: client?.last_name || '',
            firstName: client?.first_name || '',
            middleName: client?.middle_name || '',
        },
        validationSchema: ChangeCredentialsSchema,
        onSubmit: async (values, { setSubmitting }) => {
            messageApi.loading({ key: key, content: 'Loading...' });
            try {
                await updateCredentials({
                    first_name: values.firstName,
                    last_name: values.lastName,
                    middle_name: values.middleName,
                });
                updateClient();
                messageApi.success({ key: key, content: 'Credentials changed successfully!', duration: 2 });
                navigate('/profile');
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
                <label htmlFor="lastName">Last Name</label>
                <input
                    id="lastName"
                    type="text"
                    className="form-control"
                    {...formik.getFieldProps('lastName')}
                />
                {formik.touched.lastName && formik.errors.lastName && (
                    <div className="error-message">{formik.errors.lastName}</div>
                )}
            </div>

            <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <input
                    id="firstName"
                    type="text"
                    className="form-control"
                    {...formik.getFieldProps('firstName')}
                />
                {formik.touched.firstName && formik.errors.firstName && (
                    <div className="error-message">{formik.errors.firstName}</div>
                )}
            </div>

            <div className="form-group">
                <label htmlFor="middleName">Middle Name</label>
                <input
                    id="middleName"
                    type="text"
                    className="form-control"
                    {...formik.getFieldProps('middleName')}
                />
            </div>

            <button type="submit" className="submit-button" disabled={formik.isSubmitting}>
                {formik.isSubmitting ? 'Saving...' : 'Save'}
            </button>
        </form>
    );
};

export default ChangeCredentialsForm;
