import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {updateCredentials} from "../../../../api/client/client.ts";
import {ApiCallError} from "../../../../api/errors.ts";
import {message} from "antd";
import {useNavigate} from "react-router-dom";

import {useAuth} from "../../Context/hooks/useAuth.ts";
import {ErrorMessage, FormCard, FormInputGroup, FormInput, FormLabel, SubmitButton} from "./formikFormStyled.ts";

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
                navigate('/profile', {
                    state: { changeCredentials: 'Credentials changed successfully!' },
                });
            } catch (error) {
                if (error instanceof ApiCallError) {
                    messageApi.error({ key: key, content: error.message, duration: 3 });
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
                <FormLabel htmlFor="lastName">Last Name</FormLabel>
                <FormInput
                    id="lastName"
                    type="text"
                    {...formik.getFieldProps('lastName')}
                />
                {formik.touched.lastName && formik.errors.lastName && (
                    <ErrorMessage>{formik.errors.lastName}</ErrorMessage>
                )}
            </FormInputGroup>

            <FormInputGroup>
                <FormLabel htmlFor="firstName">First Name</FormLabel>
                <FormInput
                    id="firstName"
                    type="text"
                    {...formik.getFieldProps('firstName')}
                />
                {formik.touched.firstName && formik.errors.firstName && (
                    <ErrorMessage>{formik.errors.firstName}</ErrorMessage>
                )}
            </FormInputGroup>

            <FormInputGroup>
                <FormLabel htmlFor="middleName">Middle Name</FormLabel>
                <FormInput
                    id="middleName"
                    type="text"
                    {...formik.getFieldProps('middleName')}
                />
            </FormInputGroup>

            <SubmitButton type="submit" disabled={formik.isSubmitting}>
                {formik.isSubmitting ? 'Saving...' : 'Save'}
            </SubmitButton>
        </FormCard>
    );
};

export default ChangeCredentialsForm;
