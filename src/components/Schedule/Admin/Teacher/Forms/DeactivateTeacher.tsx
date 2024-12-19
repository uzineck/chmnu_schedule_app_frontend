import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';
import {ApiCallError} from "../../../../../api/errors.ts";
import {
    ErrorMessage,
    FormCard,
    FormInputGroup,
    FormLabel,
    SubmitButton
} from "../../../../Auth/Client/Forms/formikFormStyled.ts";
import {Teacher} from "../../../../../models/teacher/Teacher.ts";
import {deactivateTeacher} from "../../../../../api/schedule/teacher.ts";
import TeacherSearch from "../../../Teacher/TeacherSearch.tsx";

const DeactivateTeacherValidationSchema = Yup.object().shape({
    teacher_uuid: Yup.string().required("Teacher is required"),
});

const DeactivateTeacher = () => {
    const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();
    const key = 'updatable';

    const formik = useFormik({
        initialValues: {
            teacher_uuid: '',
        },
        validationSchema: DeactivateTeacherValidationSchema,
        onSubmit: async (values, { setSubmitting }) => {
            messageApi.loading({ key: key, content: 'Deactivating teacher...' });
            try {
                const response = await deactivateTeacher(values.teacher_uuid);
                navigate("/admin/manage/teacher", { state: { updateTeacherRankMessage: response.data.status } });
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

            {/* Submit Button */}
            <SubmitButton type="submit" disabled={formik.isSubmitting}>
                {formik.isSubmitting ? 'Deactivating Teacher...' : 'Deactivate Teacher'}
            </SubmitButton>
        </FormCard>
    );
};

export default DeactivateTeacher;
