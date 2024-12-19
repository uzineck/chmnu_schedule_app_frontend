import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';
import {ApiCallError} from "../../../../../api/errors.ts";
import {
    ErrorMessage,
    FormCard, FormInput,
    FormInputGroup,
    FormLabel, SubmitButton
} from "../../../../Auth/Client/Forms/formikFormStyled.ts";
import {Teacher} from "../../../../../models/teacher/Teacher.ts";
import {updateTeacherName} from "../../../../../api/schedule/teacher.ts";
import TeacherSearch from "../../../Teacher/TeacherSearch.tsx";

const UpdateTeacherNameValidationSchema = Yup.object().shape({
    teacher_uuid: Yup.string().required("Teacher is required"),
    first_name: Yup.string().required("First name is required"),
    last_name: Yup.string().required("Last name is required"),
    middle_name: Yup.string().required("Middle name is required"),
});

const UpdateTeacherName = () => {
    const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();
    const key = 'updatable';

    const formik = useFormik({
        initialValues: {
            teacher_uuid: '',
            first_name: selectedTeacher?.first_name || '',
            last_name: selectedTeacher?.last_name || '',
            middle_name: selectedTeacher?.middle_name || '',
        },
        validationSchema: UpdateTeacherNameValidationSchema,
        onSubmit: async (values, { setSubmitting }) => {
            messageApi.loading({ key: key, content: 'Updating teacher name...' });
            try {
                const response = await updateTeacherName(
                    values.teacher_uuid,
                    {
                        first_name: values.first_name,
                        last_name: values.last_name,
                        middle_name: values.middle_name,
                    },
                );
                navigate("/admin/manage/teacher", { state:
                        {
                            successMessage: `Teacher Name updated successfully`,
                            teacherInfo: response.data,
                        }
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

    const handleTeacherSelect = (teacher: Teacher | null) => {
        setSelectedTeacher(teacher);
        formik.setFieldValue('teacher_uuid', teacher ? teacher.uuid : '');
        formik.setFieldValue('first_name', teacher ? teacher.first_name : '');
        formik.setFieldValue('last_name', teacher ? teacher.last_name : '');
        formik.setFieldValue('middle_name', teacher ? teacher.middle_name : '');
    };

    return (
        <FormCard onSubmit={formik.handleSubmit}>
            {contextHolder}

            {/* Teacher Selection */}
            <FormInputGroup>
                <FormLabel htmlFor="teacher_uuid">Teacher</FormLabel>
                <TeacherSearch
                    onTeacherSelect={handleTeacherSelect}
                    onTeacherListFetched={()=>{}}
                    selectedTeacher={selectedTeacher}
                />
                {formik.touched.teacher_uuid && formik.errors.teacher_uuid && (
                    <ErrorMessage>{formik.errors.teacher_uuid}</ErrorMessage>
                )}
            </FormInputGroup>

            {/* First Name */}
            <FormInputGroup>
                <FormLabel htmlFor="first_name">First Name</FormLabel>
                <FormInput
                    id="first_name"
                    type="text"
                    {...formik.getFieldProps('first_name')}
                />
                {formik.touched.first_name && formik.errors.first_name && (
                    <ErrorMessage>{formik.errors.first_name}</ErrorMessage>
                )}
            </FormInputGroup>

            {/* Last Name */}
            <FormInputGroup>
                <FormLabel htmlFor="last_name">Last Name</FormLabel>
                <FormInput
                    id="last_name"
                    type="text"
                    {...formik.getFieldProps('last_name')}
                />
                {formik.touched.last_name && formik.errors.last_name && (
                    <ErrorMessage>{formik.errors.last_name}</ErrorMessage>
                )}
            </FormInputGroup>

            {/* Middle Name */}
            <FormInputGroup>
                <FormLabel htmlFor="middle_name">Middle Name</FormLabel>
                <FormInput
                    id="middle_name"
                    type="text"
                    {...formik.getFieldProps('middle_name')}
                />
                {formik.touched.middle_name && formik.errors.middle_name && (
                    <ErrorMessage>{formik.errors.middle_name}</ErrorMessage>
                )}
            </FormInputGroup>

            {/* Submit Button */}
            <SubmitButton type="submit" disabled={formik.isSubmitting}>
                {formik.isSubmitting ? 'Updating Teacher Name...' : 'Update Teacher Name'}
            </SubmitButton>
        </FormCard>
    );
};

export default UpdateTeacherName;
