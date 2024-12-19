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
        <FormCard onSubmit={formik.handleSubmit}>
            {contextHolder}
            <FormInputGroup>
                <FormLabel htmlFor="email">New Email</FormLabel>
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
                {formik.isSubmitting ? 'Saving...' : 'Save'}
            </SubmitButton>
        </FormCard>
    );
};

export default ChangeEmailForm;
