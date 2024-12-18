import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {message} from "antd";
import {useNavigate} from "react-router-dom";
import { updatePassword } from "../../../../api/client/client.ts";
import {ApiCallError} from "../../../../api/errors.ts";
import {ErrorMessage, FormCard, FormInputGroup, FormInput, FormLabel, SubmitButton} from "./formikFormStyled.ts";

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
            messageApi.loading({ key: key, content: 'Loading...' });
            try {
                await updatePassword({
                    old_password: values.currentPassword,
                    new_password: values.newPassword,
                    verify_password: values.verifyPassword,
                });
                navigate('/profile', {
                    state: { changePassword: 'Password changed successfully!' },
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
        <FormCard onSubmit={formik.handleSubmit}>
            {contextHolder}
            <FormInputGroup>
                <FormLabel htmlFor="currentPassword">Current Password</FormLabel>
                <FormInput
                    id="currentPassword"
                    type="password"
                    {...formik.getFieldProps('currentPassword')}
                />
                {formik.touched.currentPassword && formik.errors.currentPassword && (
                    <ErrorMessage>{formik.errors.currentPassword}</ErrorMessage>
                )}
            </FormInputGroup>

            <FormInputGroup>
                <FormLabel htmlFor="newPassword">New Password</FormLabel>
                <FormInput
                    id="newPassword"
                    type="password"
                    {...formik.getFieldProps('newPassword')}
                />
                {formik.touched.newPassword && formik.errors.newPassword && (
                    <ErrorMessage>{formik.errors.newPassword}</ErrorMessage>
                )}
            </FormInputGroup>

            <FormInputGroup>
                <FormLabel htmlFor="verifyPassword">Verify New Password</FormLabel>
                <FormInput
                    id="verifyPassword"
                    type="password"
                    {...formik.getFieldProps('verifyPassword')}
                />
                {formik.touched.verifyPassword && formik.errors.verifyPassword && (
                    <ErrorMessage>{formik.errors.verifyPassword}</ErrorMessage>
                )}
            </FormInputGroup>

            <SubmitButton type="submit" disabled={formik.isSubmitting}>
                {formik.isSubmitting ? 'Saving...' : 'Save'}
            </SubmitButton>
        </FormCard>
    );
};

export default ChangePasswordForm;
