import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';
import {Faculty} from "../../../../../models/faculty/Faculty.ts";
import FacultySearch from "../../../Faculty/FacultySearch.tsx";
import {createGroup} from "../../../../../api/schedule/group.ts";
import {ApiCallError} from "../../../../../api/errors.ts";
import {
    ErrorMessage,
    FormCard,
    FormInput,
    FormInputGroup,
    FormLabel, SubmitButton
} from "../../../../Auth/Client/Forms/formikFormStyled.ts";

const CreateGroupValidationSchema = Yup.object().shape({
    number: Yup.string().required("Group number is required"),
    faculty_uuid: Yup.string().required("Faculty is required"),
    headman_email: Yup.string().email('Invalid email format').required("Headman email is required"),
    has_subgroups: Yup.boolean().required("Please select if the group has subgroups"),
});

const CreateGroup = () => {
    const [selectedFaculty, setSelectedFaculty] = useState<Faculty | null>(null);
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();
    const key = 'updatable';

    const formik = useFormik({
        initialValues: {
            number: '',
            faculty_uuid: '',
            headman_email: '',
            has_subgroups: true,
        },
        validationSchema: CreateGroupValidationSchema,
        onSubmit: async (values, { setSubmitting }) => {
            messageApi.loading({ key: key, content: 'Creating group...' });
            try {
                const response = await createGroup({
                    number: values.number,
                    headman_email: values.headman_email,
                    faculty_uuid: values.faculty_uuid,
                    has_subgroups: values.has_subgroups,
                });
                navigate("/admin/manage/group", { state: { createGroupMessage: `Group created successfully!(${response.data.number}(${response.data.faculty.code_name}))` } });
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

    const handleFacultySelect = (faculty: Faculty | null) => {
        setSelectedFaculty(faculty);
        formik.setFieldValue('faculty_uuid', faculty ? faculty.uuid : '');
    };

    return (
        <FormCard onSubmit={formik.handleSubmit}>
            {contextHolder}
            {/* Group Number */}
            <FormInputGroup>
                <FormLabel htmlFor="number">Group Number</FormLabel>
                <FormInput
                    id="number"
                    type="text"
                    {...formik.getFieldProps('number')}
                />
                {formik.touched.number && formik.errors.number && (
                    <ErrorMessage>{formik.errors.number}</ErrorMessage>
                )}
            </FormInputGroup>

            {/* Headman Email */}
            <FormInputGroup>
                <FormLabel htmlFor="headman_email">Headman Email</FormLabel>
                <FormInput
                    id="headman_email"
                    type="email"
                    {...formik.getFieldProps('headman_email')}
                />
                {formik.touched.headman_email && formik.errors.headman_email && (
                    <ErrorMessage>{formik.errors.headman_email}</ErrorMessage>
                )}
            </FormInputGroup>

            {/* Faculty Selection */}
            <FormInputGroup>
                <FormLabel htmlFor="faculty_uuid">Faculty</FormLabel>
                <FacultySearch
                    onFacultySelect={handleFacultySelect}
                    onFacultyListFetched={()=>{}}
                    selectedFaculty={selectedFaculty}
                />
                {formik.touched.faculty_uuid && formik.errors.faculty_uuid && (
                    <ErrorMessage>{formik.errors.faculty_uuid}</ErrorMessage>
                )}
            </FormInputGroup>

            {/* Has Subgroups */}
            <FormInputGroup>
                <FormLabel htmlFor="has_subgroups">Has Subgroups</FormLabel>
                <FormInput
                    id="has_subgroups"
                    type="checkbox"
                    {...formik.getFieldProps('has_subgroups')}
                />
                {formik.touched.has_subgroups && formik.errors.has_subgroups && (
                    <ErrorMessage>{formik.errors.has_subgroups}</ErrorMessage>
                )}
            </FormInputGroup>

            {/* Submit Button */}
            <SubmitButton type="submit" disabled={formik.isSubmitting}>
                {formik.isSubmitting ? 'Creating Group...' : 'Create Group'}
            </SubmitButton>
        </FormCard>
    );
};

export default CreateGroup;
